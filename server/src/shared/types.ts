
import { z } from "zod";

export const RegisterRequestSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});


export const LoginRequestSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const VerifyPasswordRequestSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const CreateLockedTabSchema = z.object({
  urlPattern: z.string().min(1, "URL pattern is required"),
  label: z.string().min(1, "Label is required").max(60, "Label too long"),
  isActive: z.boolean().default(true),
});

export const UpdateLockedTabSchema = z.object({
  urlPattern: z.string().min(1).optional(),
  label: z.string().min(1).max(60).optional(),
  isActive: z.boolean().optional(),
});

export const UpdateBrowserLockSchema = z.object({
  browserLockEnabled: z.boolean(),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest          = z.infer<typeof LoginRequestSchema>;
export type VerifyPasswordRequest = z.infer<typeof VerifyPasswordRequestSchema>;
export type CreateLockedTab       = z.infer<typeof CreateLockedTabSchema>;
export type UpdateLockedTab       = z.infer<typeof UpdateLockedTabSchema>;
export type UpdateBrowserLock     = z.infer<typeof UpdateBrowserLockSchema>;