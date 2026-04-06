import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

function createR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY env vars must all be set"
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

function getR2Bucket(): string {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) throw new Error("R2_BUCKET env var must be set");
  return bucket;
}

export function getR2Config(): { client: S3Client; bucket: string } {
  return { client: createR2Client(), bucket: getR2Bucket() };
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  async streamObject(key: string, cacheTtlSec = 3600): Promise<Response> {
    const { client, bucket } = getR2Config();
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
      throw err;
    }
  }

  async uploadObject(
    key: string,
    body: Buffer,
    contentType: string
  ): Promise<string> {
    const { client, bucket } = getR2Config();
    await client.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType })
    );
    return `/api/storage/objects/${key}`;
  }

  generateUploadKey(mimetype: string): string {
    const ext = mimetype.split("/")[1] || "bin";
    return `uploads/${randomUUID()}.${ext}`;
  }

  async getSignedUploadUrl(key: string, contentType: string, ttlSec = 900): Promise<string> {
    const { client, bucket } = getR2Config();
    return getSignedUrl(
      client,
      new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
      { expiresIn: ttlSec }
    );
  }
}
