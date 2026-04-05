import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { logger } from "../lib/logger";

const isProduction = process.env.NODE_ENV === "production";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

if (isProduction && ADMIN_USER_IDS.length === 0) {
  logger.error(
    "FATAL: ADMIN_USER_IDS is not configured in production. " +
      "All admin endpoints will return 503 until ADMIN_USER_IDS is set " +
      "to a comma-separated list of permitted Clerk user IDs.",
  );
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (isProduction && ADMIN_USER_IDS.length === 0) {
    res.status(503).json({
      error: "Admin access is not configured. Set ADMIN_USER_IDS on the server.",
    });
    return;
  }

  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (ADMIN_USER_IDS.length > 0 && !ADMIN_USER_IDS.includes(userId)) {
    res.status(403).json({ error: "Forbidden: admin access only" });
    return;
  }

  next();
}
