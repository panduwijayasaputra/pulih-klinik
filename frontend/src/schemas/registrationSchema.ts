import { z } from 'zod';
import { PaymentMethodEnum } from '@/types/enums';

// Clinic data validation schema
export const clinicDataSchema = z.object({
  // Clinic Information
  name: z.string().min(3, 'Nama klinik minimal 3 karakter'),
  province: z.string().min(1, 'Provinsi harus dipilih'),
  city: z.string().min(1, 'Kota harus dipilih'),
  address: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  phone: z.string()
    .min(10, 'Nomor telepon minimal 10 karakter')
    .regex(
      /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/,
      'Format telepon tidak valid (contoh: 0812xxxxxxx, +62812xxxxxxx, atau 62812xxxxxxx)'
    ),
  email: z.string().email('Format email tidak valid'),
  website: z.string().url({ message: 'Format website tidak valid' }).optional().or(z.literal('')),
  officeHours: z.string().min(5, 'Jam operasional harus diisi'),
  
  // Admin Information
  adminName: z.string().min(3, 'Nama admin minimal 3 karakter'),
  adminEmail: z.string().email('Format email admin tidak valid'),
  adminWhatsapp: z.string()
    .min(10, 'Nomor WhatsApp minimal 10 karakter')
    .regex(
      /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/,
      'Format WhatsApp tidak valid (contoh: 0812xxxxxxx, +62812xxxxxxx, atau 62812xxxxxxx)'
    ),
  adminPosition: z.string().min(3, 'Posisi admin minimal 3 karakter'),
  
  // Admin Password
  adminPassword: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, huruf kecil, dan angka'),
  confirmPassword: z.string(),
}).refine((data) => data.adminPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

// Payment form validation schema
export const paymentSchema = z.object({
  method: z.enum([PaymentMethodEnum.BankTransfer, PaymentMethodEnum.CreditCard, PaymentMethodEnum.Ewallet], {
    message: 'Pilih metode pembayaran'
  }),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'Anda harus menyetujui syarat dan ketentuan'
  }),
});

// Inferred types from schemas
export type ClinicDataFormData = z.infer<typeof clinicDataSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;