import { z } from 'zod';
import { ClinicDocumentStatusEnum, ClinicDocumentTypeEnum, ClinicSubscriptionTierEnum, ClinicLanguageEnum } from './enums';

type EnumValue<T> = T[keyof T];

export interface ClinicBranding {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface ClinicNotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface ClinicSettings {
  timezone: string;
  language: string;
  notifications: ClinicNotificationSettings;
}

export interface ClinicDocument {
  id: string;
  name: string;
  type: EnumValue<typeof ClinicDocumentTypeEnum>;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: EnumValue<typeof ClinicDocumentStatusEnum>;
  url: string;
  description?: string;
}

export interface ClinicProfile {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  description?: string;
  workingHours?: string;
  branding: ClinicBranding;
  settings: ClinicSettings;
  documents?: ClinicDocument[];
  subscriptionTier: EnumValue<typeof ClinicSubscriptionTierEnum>;
  createdAt: string;
  updatedAt: string;
}

// Keep legacy Clinic interface for backward compatibility
export interface Clinic extends ClinicProfile {}

export interface ClinicProfileFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  workingHours: string;
  logo?: File;
}

// Keep legacy ClinicFormData interface for backward compatibility
export interface ClinicFormData extends ClinicProfileFormData {}

// Zod validation schemas
export const clinicProfileFormSchema = z.object({
  name: z.string()
    .min(3, 'Nama klinik harus minimal 3 karakter')
    .max(100, 'Nama klinik maksimal 100 karakter'),
  address: z.string()
    .min(10, 'Alamat harus minimal 10 karakter')
    .max(500, 'Alamat maksimal 500 karakter'),
  phone: z.string()
    .regex(/^\+62[0-9]{8,13}$/, 'Format nomor telepon tidak valid (contoh: +628123456789)'),
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

export const documentUploadSchema = z.object({
  name: z.string()
    .min(1, 'Nama dokumen wajib diisi')
    .max(100, 'Nama dokumen maksimal 100 karakter'),
  type: z.enum(['license', 'certificate', 'insurance', 'tax', 'other'], {
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

export const clinicBrandingSchema = z.object({
  primaryColor: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Format warna tidak valid (contoh: #3B82F6)'),
  secondaryColor: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Format warna tidak valid (contoh: #1E40AF)'),
  fontFamily: z.string()
    .min(1, 'Jenis font wajib dipilih')
});

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