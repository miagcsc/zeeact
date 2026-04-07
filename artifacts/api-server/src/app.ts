import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";
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

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

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

  (process.env.REPLIT_DOMAINS ?? "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean)
    .forEach((d) => origins.add(`https://${d}`));

  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  if (devDomain) origins.add(`https://${devDomain}`);

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
        cb(new Error(`CORS policy: malformed origin — ${origin}`));
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/api/uploads", express.static(uploadsDir));

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
