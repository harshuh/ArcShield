
import { Router } from "express";
import { validate } from "../middleware/zod.middleware";
import { UpdateBrowserLockSchema } from "../shared/types";
import { getMe, updateBrowserLock } from "../controllers/user.controller";

const router = Router();

router.get("/", getMe);

router.patch(
  "/browser-lock",
  validate(UpdateBrowserLockSchema),
  updateBrowserLock
);

export { router as userRouter };