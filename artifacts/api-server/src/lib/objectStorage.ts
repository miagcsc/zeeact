import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { logger } from "./logger";

// ── 1. Singleton S3 client ────────────────────────────────────────────────────
let _r2Client: S3Client | null = null;
let _r2Bucket: string | null = null;

function getR2Client(): S3Client {
  if (_r2Client) return _r2Client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY env vars must all be set"
    );
  }

  _r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return _r2Client;
}

function getR2Bucket(): string {
  if (_r2Bucket) return _r2Bucket;
  const bucket = process.env.R2_BUCKET;
  if (!bucket) throw new Error("R2_BUCKET env var must be set");
  _r2Bucket = bucket;
  return _r2Bucket;
}

// Kept for backwards compatibility with upload.ts route
export function getR2Config(): { client: S3Client; bucket: string } {
  return { client: getR2Client(), bucket: getR2Bucket() };
}

// ── 2 & 3. Validation constants ───────────────────────────────────────────────
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ── 4. Extension map (handles types like image/svg+xml correctly) ─────────────
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const ALLOWED_MIME_TYPES = new Set(Object.keys(MIME_TO_EXT));

// ── Errors ────────────────────────────────────────────────────────────────────
export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class InvalidFileTypeError extends Error {
  constructor(mime: string) {
    super(`File type not allowed: ${mime}. Allowed: jpeg, png, webp, gif`);
    this.name = "InvalidFileTypeError";
    Object.setPrototypeOf(this, InvalidFileTypeError.prototype);
  }
}

export class FileTooLargeError extends Error {
  constructor() {
    super(`File exceeds maximum size of ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB`);
    this.name = "FileTooLargeError";
    Object.setPrototypeOf(this, FileTooLargeError.prototype);
  }
}

// ── Service ───────────────────────────────────────────────────────────────────
export class ObjectStorageService {
  async streamObject(key: string, cacheTtlSec = 3600): Promise<Response> {
    const client = getR2Client();
    const bucket = getR2Bucket();
    try {
      const data = await client.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      );
      if (!data.Body) throw new ObjectNotFoundError();

      const webStream = data.Body.transformToWebStream();
      const headers: Record<string, string> = {
        "Content-Type": data.ContentType ?? "application/octet-stream",
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      };
      if (data.ContentLength) {
        headers["Content-Length"] = String(data.ContentLength);
      }
      return new Response(webStream, { headers });
    } catch (err: unknown) {
      const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
      if (e?.name === "NoSuchKey" || e?.$metadata?.httpStatusCode === 404) {
        throw new ObjectNotFoundError();
      }
      // ── 6. Log before rethrowing ─────────────────────────────────────────
      logger.error({ err, key }, "Unexpected error streaming object from R2");
      throw err;
    }
  }

  async uploadObject(
    key: string,
    body: Buffer,
    contentType: string
  ): Promise<string> {
    // ── 3. Content-type whitelist ─────────────────────────────────────────
    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      throw new InvalidFileTypeError(contentType);
    }

    // ── 2. File size validation ───────────────────────────────────────────
    if (body.length > MAX_FILE_SIZE_BYTES) {
      throw new FileTooLargeError();
    }

    const client = getR2Client();
    const bucket = getR2Bucket();
    await client.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType })
    );

    // ── 5. Return R2 public CDN URL if configured, else proxy URL ─────────
    const publicDomain = process.env.R2_PUBLIC_DOMAIN;
    if (publicDomain) {
      const base = publicDomain.replace(/\/$/, "");
      return `${base}/${key}`;
    }
    return `/api/storage/objects/${key}`;
  }

  // ── 4. Extension map used here ────────────────────────────────────────────
  generateUploadKey(mimetype: string): string {
    const ext = MIME_TO_EXT[mimetype] ?? "bin";
    return `uploads/${randomUUID()}.${ext}`;
  }

  async getSignedUploadUrl(key: string, contentType: string, ttlSec = 900): Promise<string> {
    const client = getR2Client();
    const bucket = getR2Bucket();
    return getSignedUrl(
      client,
      new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
      { expiresIn: ttlSec }
    );
  }
}
