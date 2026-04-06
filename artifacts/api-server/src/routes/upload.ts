import { Router } from "express";
import multer from "multer";
import { requireAuth } from "@clerk/express";
import { Readable } from "stream";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";

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

const storageService = new ObjectStorageService();

router.post("/upload", requireAuth(), upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  try {
    const key = storageService.generateUploadKey(req.file.mimetype);
    const url = await storageService.uploadObject(key, req.file.buffer, req.file.mimetype);
    res.json({ url });
  } catch (err) {
    console.error("[upload] R2 error:", err);
    res.status(500).json({ error: "Upload failed — check R2 credentials" });
  }
});

router.get("/storage/objects/*filePath", async (req, res) => {
  try {
    const rawPath = req.params.filePath as string | string[];
    const key = Array.isArray(rawPath) ? rawPath.join("/") : rawPath;
    const response = await storageService.streamObject(key, 86400);
    res.status(response.status || 200);
    response.headers.forEach((value, headerKey) => res.setHeader(headerKey, value));
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
