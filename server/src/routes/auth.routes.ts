import { Router } from "express";
import { validate } from "../middleware/zod.middleware";
import {
  LoginRequestSchema,
  VerifyPasswordRequestSchema,
  RegisterRequestSchema
} from "../shared/types";
import {
  login,
  verifyPassword,
  logout,
  register
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", validate(RegisterRequestSchema), register);

router.post("/login", validate(LoginRequestSchema), login);

router.post("/verify", validate(VerifyPasswordRequestSchema), verifyPassword);

router.post("/logout", logout);

export { router as authRouter };