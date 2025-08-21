import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  rememberMe: z.boolean().optional(),
});

// Inferred types from schemas
export type LoginFormData = z.infer<typeof loginSchema>;