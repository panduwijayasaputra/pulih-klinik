import { PaymentMethodEnum, RegistrationStepEnum } from './enums';

type EnumValue<T> = T[keyof T];

// Registration step enum
export type RegistrationStep = EnumValue<typeof RegistrationStepEnum>;

// Verification data interface
export interface VerificationData {
  code: string;
  emailSent: boolean;
  attempts: number;
  lastSentAt?: Date;
  verified: boolean;
}

// Form data types (schemas are now in /schemas/registrationSchema.ts)
export type { ClinicDataFormData, PaymentFormData } from '@/schemas/registrationSchema';

// Token package type
export interface TokenPackage {
  registrationFee: number;
  includedTokens: number;
  tokenPrice: number;
  totalValue: number;
  description: string;
}

// Business rules type
export interface BusinessRules {
  maxTherapists: number;
  maxDailyClients: number;
  tokenPerSession: number;
  tokenExpirationDays: number;
  description: string;
}

// Payment method type
export type PaymentMethod = EnumValue<typeof PaymentMethodEnum>;

// Complete registration data
export interface RegistrationData {
  clinic: ClinicDataFormData;
  verification: VerificationData;
  payment: PaymentFormData;
  tokenPackage: TokenPackage;
  businessRules: BusinessRules;
}

// Registration state
export interface RegistrationState {
  currentStep: RegistrationStep;
  data: Partial<RegistrationData>;
  verificationData: VerificationData;
  isLoading: boolean;
  error: string | null;
}

// Token package constants
export const TOKEN_PACKAGE: TokenPackage = {
  registrationFee: 100000,
  includedTokens: 3,
  tokenPrice: 20000,
  totalValue: 160000,
  description: 'Paket registrasi termasuk 3 token sesi terapi'
};

// Business rules constants
export const BUSINESS_RULES: BusinessRules = {
  maxTherapists: 3,
  maxDailyClients: 5,
  tokenPerSession: 1,
  tokenExpirationDays: 365,
  description: 'Batas maksimal 3 therapist dan 5 klien baru per hari'
};

// Mock registration completion data
export const mockRegistrationResult = {
  success: true,
  clinicId: 'clinic-new-001',
  userId: 'user-new-001',
  subscriptionId: 'sub-new-001',
  paymentStatus: 'pending',
  nextSteps: [
    'Konfirmasi pembayaran dalam 24 jam',
    'Setup akun therapist pertama',
    'Import data klien (opsional)',
    'Mulai sesi hipnoterapi pertama'
  ]
};

// Indonesian provinces list
export const indonesianProvinces = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 
  'Jambi', 'Sumatera Selatan', 'Bangka Belitung', 'Bengkulu', 'Lampung',
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur',
  'Banten', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat'
];