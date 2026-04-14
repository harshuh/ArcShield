import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";
import { tabsRouter } from "./routes/tabs.routes";
import { userRouter } from "./routes/user.routes";
import { jwtMiddleware } from "./middleware/jwt.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

export const app: Express = express();
const PORT = process.env.PORT ?? 1124;

// ─── Global Middleware ────────────────────────────────────────────────────────

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// ─── Public Routes ────────────────────────────────────────────────────────────

app.use("/auth", authRouter);

// ─── Protected Routes ─────────────────────────────────────────────────────────

app.use("/me", jwtMiddleware, userRouter);
app.use("/tabs", jwtMiddleware, tabsRouter);

// ─── Health check ─────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error Handler ────────────────────────────────────────────────────────────

app.use(errorMiddleware);

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[Arc Shield API] Running on http://localhost:${PORT}`);
});

export default app;