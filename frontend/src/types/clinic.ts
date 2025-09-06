import { ClinicDocumentStatusEnum, ClinicDocumentTypeEnum, ClinicLanguageEnum, ClinicStatusEnum, ClinicSubscriptionTierEnum } from './enums';
import { Client } from './client';
import { Therapist } from './therapist';

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
export interface Clinic extends ClinicProfile {
  status: ClinicStatusEnum;
  clients: Client[];
  therapists: Therapist[];
}

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


// Form validation types (schemas are now in /schemas/clinicSchema.ts)
export type { 
  ClinicProfileFormValidation, 
  DocumentUploadFormData, 
  ClinicBrandingValidation, 
  ClinicSettingsValidation 
} from '@/schemas/clinicSchema';