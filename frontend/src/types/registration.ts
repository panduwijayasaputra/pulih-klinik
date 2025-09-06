import { 
  RegistrationStepEnum, 
  BillingCycleEnum, 
} from './enums';

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

// User form data interface
export interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Email status from backend
export interface EmailStatus {
  status: 'available' | 'exists' | 'needs_verification';
  message: string;
  email: string;
}

// Registration status from backend
export interface RegistrationStatus {
  id: string;
  email: string;
  status: string;
  currentStep: RegistrationStep;
  completedSteps: RegistrationStep[];
  createdAt: Date;
  expiresAt?: Date;
  userData?: any;
  clinicData?: any;
  subscriptionData?: any;
  paymentData?: any;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  paymentStatus: string;
}

// Complete registration data
export interface RegistrationData {
  user: UserFormData;
  verification: VerificationData;
}

// Registration state
export interface RegistrationState {
  currentStep: RegistrationStep;
  data: Partial<RegistrationData>;
  verificationData: VerificationData;
  emailStatus: EmailStatus | null;
  isLoading: boolean;
  error: string | null;
  verifiedEmails: string[];
}

// Subscription tier information


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