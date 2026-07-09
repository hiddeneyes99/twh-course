import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.SESSION_SECRET;
if (!JWT_SECRET) throw new Error("SESSION_SECRET env var is required for auth.");

export interface AuthPayload {
  memberId: number;
  memberName: string;
  isOwner: boolean;
}

export type AuthenticatedRequest = Request & { auth: AuthPayload };

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "30d" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET!) as AuthPayload;
}

/** Express middleware — attaches req.auth or returns 401. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Login karo pehle. Token missing hai." });
    return;
  }
  try {
    const payload = verifyToken(header.slice(7));
    (req as AuthenticatedRequest).auth = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token invalid ya expired hai. Dobara login karo." });
  }
}

/** Middleware — requires auth + caller must be the owner (name === 'Twh'). */
export function requireOwner(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (!(req as AuthenticatedRequest).auth.isOwner) {
      res.status(403).json({ error: "Sirf owner yeh kaam kar sakta hai." });
      return;
    }
    next();
  });
}
