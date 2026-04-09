import { type Request, type Response, type NextFunction } from "express";

/**
 * No-op auth middleware for closed/local environments.
 * All requests are treated as authenticated.
 */
export function requireAuth(_req: Request, _res: Response, next: NextFunction) {
  next();
}
