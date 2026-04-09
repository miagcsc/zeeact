import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

const isProduction = process.env.NODE_ENV === "production";

function buildAllowedOrigins(): Set<string> {
  const origins = new Set<string>();

  (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)
    .forEach((o) => origins.add(o));

  // Auto-allow the site's own public URL (e.g. Railway domain or custom domain)
  const siteUrl = process.env.SITE_URL;
  if (siteUrl) {
    try { origins.add(new URL(siteUrl).origin); } catch {}
  }

  return origins;
}

const ALLOWED_ORIGINS = buildAllowedOrigins();

app.use(
  cors({
    credentials: true,
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }

      let parsedOrigin: string;
      try {
        parsedOrigin = new URL(origin).origin;
      } catch {
        cb(null, false);
        return;
      }

      if (ALLOWED_ORIGINS.has(parsedOrigin)) {
        cb(null, true);
      } else if (!isProduction) {
        cb(null, true);
      } else {
        cb(new Error(`CORS policy: origin not allowed — ${origin}`));
      }
    },
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

app.use("/api", apiLimiter);
app.use("/api", router);

// Derive path from this file's location so it works regardless of process.cwd()
// Compiled output: artifacts/api-server/dist/index.mjs
// Website dist:    artifacts/zeeacts-website/dist/public
const __serverDir = path.dirname(fileURLToPath(import.meta.url));
const websiteDistDir = path.resolve(__serverDir, "../../zeeacts-website/dist/public");

logger.info({ websiteDistDir, exists: fs.existsSync(websiteDistDir) }, "Static files path");

if (fs.existsSync(websiteDistDir)) {
  app.use(express.static(websiteDistDir, { maxAge: "1d" }));
  app.use((_req, res) => {
    res.sendFile(path.join(websiteDistDir, "index.html"));
  });
} else {
  logger.warn({ websiteDistDir }, "Website dist directory not found — static serving disabled");
}

export default app;
