import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface JwtPayload {
  userId: string;
  jti: string;
  iat?: number;
  exp?: number;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  return secret;
}

export function signToken(userId: string): string {
  const payload = {
    userId,
    jti: crypto.randomUUID(),
  };

  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";

  return jwt.sign(payload, getSecret(), {
    expiresIn,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, getSecret()) as JwtPayload;
    return payload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired. Please log in again.");
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token. Please log in again.");
    }
    throw new Error("Token verification failed.");
  }
}

export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  return token ?? null;
}