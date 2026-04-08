import type { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { AppError } from "./error.middleware";


export async function jwtMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {

    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      throw new AppError(401, "No token provided. Please log in.");
    }

    const payload = verifyToken(token);

    const session = await prisma.session.findUnique({
      where: { jwtJti: payload.jti },
    });

    if (!session) {
      throw new AppError(401, "Session not found. Please log in again.");
    }

    if (session.revoked) {
      throw new AppError(401, "Session has been revoked. Please log in again.");
    }

    if (session.expiresAt < new Date()) {
      throw new AppError(401, "Session has expired. Please log in again.");
    }
    
    req.user = { userId: payload.userId };

    next();
  } catch (err) {
    next(err);
  }
}