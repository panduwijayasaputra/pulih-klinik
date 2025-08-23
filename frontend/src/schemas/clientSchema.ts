import { z } from 'zod';
import {
  ClientEducationValues,
  ClientGenderValues,
  ClientGuardianMaritalStatusValues,
  ClientGuardianRelationshipValues,
  ClientMaritalStatusValues,
  ClientRelationshipWithSpouseValues,
  ClientReligionValues,
  ClientStatusValues
} from '@/types/enums';

// Common enums using values from types
export const genderEnum = z.enum(ClientGenderValues);
export const educationEnum = z.enum(ClientEducationValues);
export const religionEnum = z.enum(ClientReligionValues);
export const maritalStatusEnum = z.enum(ClientMaritalStatusValues);
export const relationshipWithSpouseEnum = z.enum(ClientRelationshipWithSpouseValues);
export const clientStatusEnum = z.enum(ClientStatusValues);

// Minor-specific enums
export const guardianRelationshipEnum = z.enum(ClientGuardianRelationshipValues);
export const guardianMaritalStatusEnum = z.enum(ClientGuardianMaritalStatusValues);

// Reusable patterns
const phoneIdPattern = /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/; // e.g., +62812..., 0812...

// Phone validation that allows empty strings for optional fields
const optionalPhoneValidation = z.string().optional().or(z.literal('')).transform(v => (v === '' ? undefined : v));

// Required phone validation for main phone field
const requiredPhoneValidation = z
  .string()
  .regex(phoneIdPattern, 'Format nomor telepon tidak valid (gunakan +62 atau 0)')
  .min(10, 'Nomor telepon minimal 10 digit');

// Optional phone validation for emergency contact details
const optionalEmergencyPhoneValidation = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine(
    (val) => {
      if (!val || val === '') return true; // Allow empty
      return phoneIdPattern.test(val) && val.length >= 10;
    },
    { message: 'Format nomor telepon tidak valid (gunakan +62 atau 0)' }
  )
  .transform(v => (v === '' ? undefined : v));

// Individual emergency contact field validations
const emergencyContactNameValidation = z.string().min(2, 'Nama kontak darurat minimal 2 karakter').optional();
const emergencyContactRelationshipValidation = z.string().min(2, 'Hubungan minimal 2 karakter').optional();
const emergencyContactAddressValidation = z.string().min(5, 'Alamat kontak darurat minimal 5 karakter').optional();

// Base schema for client form
export const clientBaseSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  gender: genderEnum,
  birthPlace: z.string().min(1, 'Tempat lahir harus diisi'),
  birthDate: z.string().min(1, 'Tanggal lahir harus diisi'),
  religion: religionEnum,
  occupation: z.string().min(2, 'Pekerjaan minimal 2 karakter'),
  education: educationEnum,
  educationMajor: z.string().optional(),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
  phone: requiredPhoneValidation,
  email: z.string().email('Email tidak valid').optional().or(z.literal('')).transform(v => (v === '' ? '' : v)),
  hobbies: z.string().optional(),
  maritalStatus: maritalStatusEnum,
  spouseName: z.string().optional(),
  relationshipWithSpouse: relationshipWithSpouseEnum.optional(),

  firstVisit: z.boolean(),
  previousVisitDetails: z.string().optional(),
  province: z.string().optional(),
  emergencyContactName: emergencyContactNameValidation,
  emergencyContactPhone: optionalEmergencyPhoneValidation,
  emergencyContactRelationship: emergencyContactRelationshipValidation,
  emergencyContactAddress: emergencyContactAddressValidation,
  notes: z.string().max(1000, 'Catatan maksimal 1000 karakter').optional(),
  // Minor-specific fields
  isMinor: z.boolean().default(false),
  school: z.string().optional(),
  grade: z.string().optional(),
  // Guardian information
  guardianFullName: z.string().optional(),
  guardianRelationship: guardianRelationshipEnum.optional(),
  guardianPhone: optionalPhoneValidation,
  guardianAddress: z.string().optional(),
  guardianOccupation: z.string().optional(),
  guardianMaritalStatus: guardianMaritalStatusEnum.optional(),
  guardianLegalCustody: z.boolean().optional(),
  guardianCustodyDocsAttached: z.boolean().optional(),
});

export const createClientSchema = clientBaseSchema.extend({
  status: clientStatusEnum.default('new'),
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


