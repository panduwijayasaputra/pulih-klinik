import { z } from 'zod';
import { 
  PaymentMethodEnum, 
  BillingCycleEnum, 
  SubscriptionTierEnum 
} from '@/types/enums';

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

// Clinic form validation schema
export const clinicFormSchema = z.object({
  name: z.string()
    .min(3, 'Nama klinik minimal 3 karakter')
    .max(100, 'Nama klinik maksimal 100 karakter'),
  address: z.string()
    .min(10, 'Alamat lengkap minimal 10 karakter')
    .max(500, 'Alamat maksimal 500 karakter'),
  phone: z.string()
    .min(10, 'Nomor telepon minimal 10 karakter')
    .max(20, 'Nomor telepon maksimal 20 karakter')
    .regex(
      /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/,
      'Format telepon tidak valid (contoh: 0812xxxxxxx, +62812xxxxxxx, atau 62812xxxxxxx)'
    ),
  email: z.string()
    .email('Format email tidak valid')
    .max(255, 'Email maksimal 255 karakter'),
  website: z.string().optional(),
  description: z.string().optional(),
  workingHours: z.string().optional(),
  province: z.string().optional(),
});

// Subscription form validation schema
export const subscriptionFormSchema = z.object({
  tierCode: z.nativeEnum(SubscriptionTierEnum, {
    message: 'Pilih paket berlangganan'
  }),
  billingCycle: z.nativeEnum(BillingCycleEnum, {
    message: 'Pilih siklus penagihan'
  }),
  amount: z.number()
    .min(0, 'Jumlah tidak boleh negatif'),
  currency: z.string()
    .default('IDR'),
});

// Payment form validation schema
export const paymentFormSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethodEnum, {
    message: 'Pilih metode pembayaran'
  }),
  amount: z.number()
    .min(0, 'Jumlah tidak boleh negatif'),
  currency: z.string()
    .default('IDR'),
  transactionId: z.string()
    .optional(),
  paymentId: z.string()
    .optional(),
});

// Email verification schema
export const emailVerificationSchema = z.object({
  code: z.string()
    .length(6, 'Kode verifikasi harus 6 digit')
    .regex(/^\d{6}$/, 'Kode verifikasi harus berupa 6 digit angka'),
});

// Inferred types from schemas
export type UserFormData = z.infer<typeof userFormSchema>;
export type ClinicFormData = z.infer<typeof clinicFormSchema>;
export type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;
export type PaymentFormData = z.infer<typeof paymentFormSchema>;
export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;