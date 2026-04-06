import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import fs from "fs";
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

  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  if (devDomain) {
    origins.add(`https://${devDomain}`);
  }

  (process.env.REPLIT_DOMAINS ?? "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean)
    .forEach((d) => origins.add(`https://${d}`));

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

export default app;
