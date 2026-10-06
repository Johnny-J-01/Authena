import { doubleCsrf } from "csrf-csrf";
import { env } from "../config/env.js";
import type { Request } from "express";

const csrfUtilities = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  cookieName: "x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
    path: "/",
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getSessionIdentifier: (req: Request) => {
    const sessionId =
      (req as any).session?.id ??
      req.headers["x-session-id"] ??
      req.ip ??
      "anonymous";

    return String(sessionId);
  },
  getCsrfTokenFromRequest: (req: Request) => req.headers["x-csrf-token"] as string,
}) as any;

export const {
  invalidCsrfTokenError,
  generateCsrfToken,
  doubleCsrfProtection,
} = csrfUtilities;
