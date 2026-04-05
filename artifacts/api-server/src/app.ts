import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

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

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const REPLIT_DEV_DOMAIN = process.env.REPLIT_DEV_DOMAIN;
if (REPLIT_DEV_DOMAIN) {
  ALLOWED_ORIGINS.push(`https://${REPLIT_DEV_DOMAIN}`);
}

app.use(
  cors({
    credentials: true,
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
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

app.use("/api", router);

export default app;
