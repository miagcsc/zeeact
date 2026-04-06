import { Router } from "express";
import multer from "multer";
import { requireAuth } from "@clerk/express";
import { objectStorageClient } from "../lib/objectStorage";
import { randomUUID } from "crypto";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/webp", "image/png", "image/jpeg", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

function parseGCSPath(rawPath: string): { bucketName: string; objectName: string } {
  const path = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;
  const parts = path.split("/");
  return { bucketName: parts[0], objectName: parts.slice(1).join("/") };
}

router.post("/upload", requireAuth(), upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const privateDir = process.env.PRIVATE_OBJECT_DIR || "";
  if (!privateDir) {
    res.status(500).json({ error: "Object storage not configured" });
    return;
  }

  try {
    const { bucketName, objectName: dirName } = parseGCSPath(privateDir);
    const ext = req.file.mimetype.split("/")[1] || "bin";
    const filename = `${randomUUID()}.${ext}`;
    const objectName = `${dirName}/uploads/${filename}`.replace(/\/+/g, "/");

    const bucket = objectStorageClient.bucket(bucketName);
    const gcsFile = bucket.file(objectName);
    await gcsFile.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    const url = `/api/storage/objects/${bucketName}/${objectName}`;
    res.json({ url });
  } catch (err) {
    console.error("[upload] GCS error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

import { Readable } from "stream";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";

const objectStorageService = new ObjectStorageService();

router.get("/storage/objects/*filePath", async (req, res) => {
  try {
    const rawPath = req.params.filePath as string | string[];
    const filePath = Array.isArray(rawPath) ? rawPath.join("/") : rawPath;
    const objectPath = `/objects/${filePath}`;
    const file = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(file, 86400);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Not found" });
    } else {
      console.error("[storage] serve error:", err);
      res.status(500).json({ error: "Failed to serve object" });
    }
  }
});

export default router;
