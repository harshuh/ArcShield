import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error.middleware";

export async function getLockedTabs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tabs = await prisma.lockedTab.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(tabs);
  } catch (err) {
    next(err);
  }
}

export async function createLockedTab(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { urlPattern, label, isActive } = req.body as {
      urlPattern: string;
      label: string;
      isActive: boolean;
    };

    const tab = await prisma.lockedTab.create({
      data: {
        userId: req.user!.userId,
        urlPattern,
        label,
        isActive,
      },
    });

    res.status(201).json(tab);
  } catch (err) {
    next(err);
  }
}

export async function updateLockedTab(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.lockedTab.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(404, "Locked tab not found.");
    }

    if (existing.userId !== req.user!.userId) {
      throw new AppError(403, "You do not have permission to update this.");
    }

    const tab = await prisma.lockedTab.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json(tab);
  } catch (err) {
    next(err);
  }
}


export async function deleteLockedTab(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.lockedTab.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(404, "Locked tab not found.");
    }

    if (existing.userId !== req.user!.userId) {
      throw new AppError(403, "You do not have permission to delete this.");
    }

    await prisma.lockedTab.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}