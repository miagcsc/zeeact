import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { logger } from "../lib/logger";

const isProduction = process.env.NODE_ENV === "production";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

if (isProduction && ADMIN_USER_IDS.length === 0) {
  logger.warn(
    "ADMIN_USER_IDS is not set in production. All authenticated users will be treated as admins. " +
      "Set ADMIN_USER_IDS to a comma-separated list of allowed Clerk user IDs.",
  );
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
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
