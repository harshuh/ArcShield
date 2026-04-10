import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error.middleware";


export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        browserLockEnabled: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateBrowserLock(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { browserLockEnabled } = req.body as {
      browserLockEnabled: boolean;
    };

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { browserLockEnabled },
      select: {
        id: true,
        email: true,
        browserLockEnabled: true,
        createdAt: true,
      },
    });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}