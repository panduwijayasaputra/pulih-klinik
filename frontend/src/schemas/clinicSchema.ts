import { z } from 'zod';
import { ClinicLanguageEnum } from '@/types/enums';
import { ClinicDocumentTypeValues } from '@/types/enums';
import { phoneValidation } from '@/lib/validation/phone';

// Clinic profile form validation schema
export const clinicProfileFormSchema = z.object({
  name: z.string()
    .min(3, 'Nama klinik harus minimal 3 karakter')
    .max(100, 'Nama klinik maksimal 100 karakter'),
  address: z.string()
    .min(10, 'Alamat harus minimal 10 karakter')
    .max(500, 'Alamat maksimal 500 karakter'),
  phone: phoneValidation,
  email: z.string()
    .email('Format email tidak valid')
    .max(100, 'Email maksimal 100 karakter'),
  website: z.string()
    .url('Format website tidak valid (harus diawali http:// atau https://)')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(1000, 'Deskripsi maksimal 1000 karakter')
    .optional(),
  workingHours: z.string()
    .max(200, 'Jam operasional maksimal 200 karakter')
    .optional()
});

// Document upload validation schema
export const documentUploadSchema = z.object({
  name: z.string()
    .min(1, 'Nama dokumen wajib diisi')
    .max(100, 'Nama dokumen maksimal 100 karakter'),
  type: z.enum(ClinicDocumentTypeValues, {
    message: 'Pilih jenis dokumen yang valid'
  }),
  description: z.string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional(),
  file: z.instanceof(File, { message: 'File wajib dipilih' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Ukuran file maksimal 5MB')
    .refine((file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type), 
      'Format file harus PDF, JPG, atau PNG')
});

// Clinic branding validation schema
export const clinicBrandingSchema = z.object({
  primaryColor: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Format warna tidak valid (contoh: #3B82F6)'),
  secondaryColor: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Format warna tidak valid (contoh: #1E40AF)'),
  fontFamily: z.string()
    .min(1, 'Jenis font wajib dipilih')
});

// Clinic settings validation schema
export const clinicSettingsSchema = z.object({
  timezone: z.string()
    .min(1, 'Zona waktu wajib dipilih'),
  language: z.enum([ClinicLanguageEnum.Indonesian, ClinicLanguageEnum.English], {
    message: 'Pilih bahasa yang valid'
  }),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean()
  })
});

// Type inference from schemas
export type ClinicProfileFormValidation = z.infer<typeof clinicProfileFormSchema>;
export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;
export type ClinicBrandingValidation = z.infer<typeof clinicBrandingSchema>;
export type ClinicSettingsValidation = z.infer<typeof clinicSettingsSchema>;