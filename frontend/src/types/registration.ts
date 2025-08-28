import { 
  PaymentMethodEnum, 
  RegistrationStepEnum, 
  BillingCycleEnum, 
  SubscriptionTierEnum 
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

// Clinic form data interface
export interface ClinicFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string | undefined;
  description?: string | undefined;
  workingHours?: string | undefined;
  province?: string | undefined;
}

// Subscription data interface
export interface SubscriptionData {
  tierCode: SubscriptionTierEnum;
  billingCycle: BillingCycleEnum;
  amount: number;
  currency?: string | undefined;
}

// Payment data interface
export interface PaymentData {
  paymentMethod: PaymentMethodEnum;
  amount: number;
  currency?: string | undefined;
  transactionId?: string | undefined;
  paymentId?: string | undefined;
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
  clinic: ClinicFormData;
  subscription: SubscriptionData;
  payment: PaymentData;
  verification: VerificationData;
}

// Registration state
export interface RegistrationState {
  currentStep: RegistrationStep;
  data: Partial<RegistrationData>;
  verificationData: VerificationData;
  registrationId?: string;
  isLoading: boolean;
  error: string | null;
  verifiedEmails: string[];
}

// Subscription tier information
export interface SubscriptionTier {
  code: SubscriptionTierEnum;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  therapistLimit: number;
  newClientsPerDayLimit: number;
  isRecommended: boolean;
  features: string[];
}

// Subscription tiers data
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    code: SubscriptionTierEnum.Beta,
    name: 'Beta',
    description: 'Paket dasar untuk klinik yang baru memulai dengan fitur terbaik',
    monthlyPrice: 50000,
    yearlyPrice: 550000,
    therapistLimit: 1,
    newClientsPerDayLimit: 1,
    isRecommended: false,
    features: [
      '1 Therapist',
      '1 Klien baru per hari',
      'Fitur dasar hipnoterapi',
      'Support email'
    ]
  },
  {
    code: SubscriptionTierEnum.Alpha,
    name: 'Alpha',
    description: 'Paket terbaik untuk klinik yang ingin memiliki fitur lengkap',
    monthlyPrice: 100000,
    yearlyPrice: 1000000,
    therapistLimit: 3,
    newClientsPerDayLimit: 3,
    isRecommended: true,
    features: [
      '3 Therapists',
      '3 Klien baru per hari',
      'Fitur lengkap hipnoterapi',
      'AI Assistant',
      'Support prioritas'
    ]
  },
  {
    code: SubscriptionTierEnum.Theta,
    name: 'Theta',
    description: 'Paket untuk klinik yang ingin memiliki kapasitas maksimal',
    monthlyPrice: 150000,
    yearlyPrice: 1500000,
    therapistLimit: 5,
    newClientsPerDayLimit: 5,
    isRecommended: false,
    features: [
      '5 Therapists',
      '5 Klien baru per hari',
      'Semua fitur hipnoterapi',
      'AI Assistant Pro',
      'Support 24/7',
      'Custom branding'
    ]
  }
];

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