import { z } from 'zod';

// Common enums based on existing Client types
export const genderEnum = z.enum(['male', 'female', 'other']);
export const educationEnum = z.enum([
  'Elementary',
  'Middle',
  'High School',
  'Associate',
  'Bachelor',
  'Master',
  'Doctorate',
]);
export const religionEnum = z.enum([
  'Islam',
  'Christianity',
  'Catholicism',
  'Hinduism',
  'Buddhism',
  'Other',
]);
export const clientStatusEnum = z.enum(['active', 'inactive', 'completed', 'pending']);

// Reusable patterns
const phoneIdPattern = /^(\+62|0)[0-9]{9,13}$/; // e.g., +62812..., 0812...

export const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Nama kontak darurat minimal 2 karakter'),
  phone: z
    .string()
    .regex(phoneIdPattern, 'Format nomor telepon tidak valid (gunakan +62 atau 0)')
    .min(10),
  relationship: z.string().min(2, 'Hubungan minimal 2 karakter'),
});

// Base schema for client form
export const clientBaseSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  age: z.number().int('Umur harus bilangan bulat').min(0, 'Umur tidak boleh negatif').max(120, 'Umur maksimal 120'),
  gender: genderEnum,
  phone: z
    .string()
    .regex(phoneIdPattern, 'Format nomor telepon tidak valid (gunakan +62 atau 0)'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')).transform(v => (v === '' ? undefined : v)),
  occupation: z.string().min(2, 'Pekerjaan minimal 2 karakter').optional(),
  education: educationEnum,
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
  primaryIssue: z.string().min(2, 'Masalah utama minimal 2 karakter'),
  religion: religionEnum.optional(),
  province: z.string().optional(),
  emergencyContact: emergencyContactSchema.optional(),
  notes: z.string().max(1000, 'Catatan maksimal 1000 karakter').optional(),
});

export const createClientSchema = clientBaseSchema.extend({
  status: clientStatusEnum.default('active'),
});

export const updateClientSchema = clientBaseSchema.partial().extend({
  status: clientStatusEnum.optional(),
});

// Filters for list/search
export const clientFiltersSchema = z.object({
  search: z.string().max(100).optional(),
  status: clientStatusEnum.optional(),
  therapist: z.string().optional(),
  dateRange: z
    .object({
      from: z.string(), // ISO date string
      to: z.string(),
    })
    .refine(v => !v || new Date(v.from) <= new Date(v.to), {
      message: 'Rentang tanggal tidak valid',
      path: ['to'],
    })
    .optional(),
  primaryIssue: z.string().optional(),
  province: z.string().optional(),
});

// Assignment
export const assignTherapistSchema = z.object({
  clientId: z.string().min(1),
  therapistId: z.string().min(1),
});

// Inferred Types
export type ClientCreateData = z.infer<typeof createClientSchema>;
export type ClientUpdateData = z.infer<typeof updateClientSchema>;
export type ClientFilters = z.infer<typeof clientFiltersSchema>;
export type AssignTherapistData = z.infer<typeof assignTherapistSchema>;


