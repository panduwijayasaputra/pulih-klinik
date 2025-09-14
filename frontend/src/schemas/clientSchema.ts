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
import { phoneValidation, optionalPhoneValidation, emergencyPhoneValidation } from '@/lib/validation/phone';

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

// Phone validation patterns are now imported from @/lib/validation/phone

// Individual emergency contact field validations
const emergencyContactNameValidation = z.string().min(2, 'Nama kontak darurat minimal 2 karakter').optional();
const emergencyContactRelationshipValidation = z.string().min(2, 'Hubungan minimal 2 karakter').optional();
const emergencyContactAddressValidation = z.string().min(5, 'Alamat kontak darurat minimal 5 karakter').optional();

// Base schema without refinements for better form compatibility
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
  phone: phoneValidation,
  email: z.string().email({ message: 'Email tidak valid' }).optional().or(z.literal('')).transform(v => (v === '' ? '' : v)),
  hobbies: z.string().optional(),
  maritalStatus: maritalStatusEnum,
  spouseName: z.string().optional(),
  relationshipWithSpouse: relationshipWithSpouseEnum.nullable().optional(),

  firstVisit: z.boolean(),
  previousVisitDetails: z.string().optional(),
  emergencyContactName: emergencyContactNameValidation,
  emergencyContactPhone: emergencyPhoneValidation,
  emergencyContactRelationship: emergencyContactRelationshipValidation,
  emergencyContactAddress: emergencyContactAddressValidation,
  notes: z.string().max(1000, 'Catatan maksimal 1000 karakter').optional(),
  primaryIssue: z.string().min(1, 'Isu utama harus diisi').max(500, 'Isu utama maksimal 500 karakter'),
  // Minor-specific fields
  isMinor: z.boolean().default(false),
  school: z.string().optional(),
  grade: z.string().optional(),
  // Guardian information
  guardianFullName: z.string().optional(),
  guardianRelationship: guardianRelationshipEnum.nullable().optional(),
  guardianPhone: optionalPhoneValidation,
  guardianAddress: z.string().optional(),
  guardianOccupation: z.string().optional(),
  guardianMaritalStatus: guardianMaritalStatusEnum.nullable().optional(),
  guardianLegalCustody: z.boolean().optional(),
  guardianCustodyDocsAttached: z.boolean().optional(),
});

// Schema with refinements for submission validation
export const clientSchemaWithRefinements = clientBaseSchema.refine(
  (data) => {
    if (data.isMinor) {
      // If isMinor is true, school and grade are required
      return data.school && data.school.trim().length >= 2 && 
             data.grade && data.grade.trim().length >= 1;
    }
    return true;
  },
  {
    message: 'Nama sekolah dan kelas harus diisi untuk klien di bawah umur',
    path: ['school'], // This will show the error on the school field
  }
).refine(
  (data) => {
    if (data.isMinor) {
      // If isMinor is true, guardian name, relationship, phone, occupation, and address are required
      return data.guardianFullName && data.guardianFullName.trim().length >= 2 &&
             data.guardianRelationship &&
             data.guardianPhone && data.guardianPhone.trim().length >= 10 &&
             data.guardianOccupation && data.guardianOccupation.trim().length >= 2 &&
             data.guardianAddress && data.guardianAddress.trim().length >= 5;
    }
    return true;
  },
  {
    message: 'Informasi wali lengkap harus diisi untuk klien di bawah umur',
    path: ['guardianFullName'], // This will show the error on the guardian name field
  }
).refine(
  (data) => {
    if (data.isMinor) {
      // If isMinor is true, emergency contact phone and address are required
      return data.emergencyContactPhone && data.emergencyContactPhone.trim().length >= 10 &&
             data.emergencyContactAddress && data.emergencyContactAddress.trim().length >= 5;
    }
    return true;
  },
  {
    message: 'Nomor telepon dan alamat kontak darurat harus diisi untuk klien di bawah umur',
    path: ['emergencyContactPhone'], // This will show the error on the emergency contact phone field
  }
).refine(
  (data) => {
    if (data.maritalStatus === 'Married') {
      // If married, spouse name and relationship are required
      return data.spouseName && data.spouseName.trim().length >= 2 &&
             data.relationshipWithSpouse;
    }
    return true;
  },
  {
    message: 'Nama pasangan dan hubungan dengan pasangan harus diisi untuk status menikah',
    path: ['spouseName'], // This will show the error on the spouse name field
  }
).refine(
  (data) => {
    if (!data.firstVisit) {
      // If not first visit, previous visit details are required
      return data.previousVisitDetails && data.previousVisitDetails.trim().length >= 5;
    }
    return true;
  },
  {
    message: 'Detail kunjungan sebelumnya harus diisi jika bukan kunjungan pertama',
    path: ['previousVisitDetails'], // This will show the error on the previous visit details field
  }
);

export const createClientSchema = clientBaseSchema.and(z.object({
  status: clientStatusEnum.default('new'),
}));

export const updateClientSchema = clientBaseSchema.partial().and(z.object({
  status: clientStatusEnum.optional(),
}));

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


