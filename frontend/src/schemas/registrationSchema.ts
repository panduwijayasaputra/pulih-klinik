import { z } from 'zod';

// User form validation schema
export const userFormSchema = z.object({
  name: z.string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z.string()
    .email('Format email tidak valid')
    .max(255, 'Email maksimal 255 karakter'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .max(255, 'Password maksimal 255 karakter')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, huruf kecil, dan angka'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});




// Email verification schema
export const emailVerificationSchema = z.object({
  code: z.string()
    .length(6, 'Kode verifikasi harus 6 digit')
    .regex(/^\d{6}$/, 'Kode verifikasi harus berupa 6 digit angka'),
});

// Inferred types from schemas
export type UserFormData = z.infer<typeof userFormSchema>;
export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;