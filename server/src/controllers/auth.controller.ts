import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken, verifyToken, extractTokenFromHeader } from "../lib/jwt";
import { AppError } from "../middleware/error.middleware";



export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new AppError(409, "An account with this email already exists.");
    }

    // Hash password before storing
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        browserLockEnabled: false,
      },
    });

    const token = signToken(user.id);
    const payload = verifyToken(token);

    await prisma.session.create({
      data: {
        userId: user.id,
        jwtJti: payload.jti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        browserLockEnabled: user.browserLockEnabled,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password.");
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, "Invalid email or password.");
    }
    const token = signToken(user.id);
    const payload = verifyToken(token);

    await prisma.session.create({
      data: {
        userId: user.id,
        jwtJti: payload.jti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        browserLockEnabled: user.browserLockEnabled,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { password } = req.body as { password: string };

    let userId: string | null = null;
    const token = extractTokenFromHeader(req.headers.authorization);
    if (token) {
      try {
        const payload = verifyToken(token);
        userId = payload.userId;
      } catch {
        // Token expired or invalid 
      }
    }

    // Find the user
    const user = userId
      ? await prisma.user.findUnique({ where: { id: userId } })
      : await prisma.user.findFirst(); 

    if (!user) {
      throw new AppError(401, "Invalid password.");
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, "Invalid password.");
    }

    // Issue a fresh token
    const newToken = signToken(user.id);
    const payload = verifyToken(newToken);

    // Store new session
    await prisma.session.create({
      data: {
        userId: user.id,
        jwtJti: payload.jti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({ token: newToken });
  } catch (err) {
    next(err);
  }
}


export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      try {
        const payload = verifyToken(token);

        await prisma.session.updateMany({
          where: { jwtJti: payload.jti },
          data: { revoked: true },
        });
      } catch {
        // Token already expired
      }
    }

    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
}