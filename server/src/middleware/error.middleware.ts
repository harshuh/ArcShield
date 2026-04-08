
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";


export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorMiddlreware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
  res.status(400).json({
    error: "Validation failed",
    issues: err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    })),
  });
  return;
}

  // AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }


  console.error("[Arc Shield Error]", err);
  res.status(500).json({
    error:
      process.env.NODE_ENV === "development"
        ? (err as Error)?.message ?? "Internal server error"
        : "Internal server error",
  });
}