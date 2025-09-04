import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  rememberMe: z.boolean().optional(),
});

// Registration form validation schema
export const registrationSchema = z.object({
  name: z.string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s\u00C0-\u017F]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  email: z.string().email('Email tidak valid'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, 
      'Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Konfirmasi password tidak cocok',
  path: ['passwordConfirm'],
});

// Email verification schema
export const emailVerificationSchema = z.object({
  email: z.string().email('Email tidak valid'),
  code: z.string()
    .length(6, 'Kode verifikasi harus 6 digit')
    .regex(/^\d{6}$/, 'Kode verifikasi harus berupa 6 digit angka'),
});

// Inferred types from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;