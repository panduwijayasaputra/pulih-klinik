import { z } from 'zod';

// Registration step enum
export type RegistrationStep = 'clinic' | 'subscription' | 'payment' | 'complete';

// Clinic data validation schema
export const clinicDataSchema = z.object({
  // Clinic Information
  name: z.string().min(3, 'Nama klinik minimal 3 karakter'),
  province: z.string().min(1, 'Provinsi harus dipilih'),
  city: z.string().min(1, 'Kota harus dipilih'),
  address: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 karakter')
    .regex(/^(\+62|0)[0-9]{9,12}$/, 'Format telepon tidak valid (contoh: 021-1234567 atau +62-812-3456-7890)'),
  email: z.string().email('Format email tidak valid'),
  website: z.string().url('Format website tidak valid').optional().or(z.literal('')),
  officeHours: z.string().min(5, 'Jam operasional harus diisi'),
  
  // Admin Information
  adminName: z.string().min(3, 'Nama admin minimal 3 karakter'),
  adminEmail: z.string().email('Format email admin tidak valid'),
  adminWhatsapp: z.string().min(10, 'Nomor WhatsApp minimal 10 karakter')
    .regex(/^(\+62|0)[0-9]{9,12}$/, 'Format WhatsApp tidak valid'),
  adminPosition: z.string().min(3, 'Posisi admin minimal 3 karakter'),
});

export type ClinicDataFormData = z.infer<typeof clinicDataSchema>;

// Subscription tier type
export interface SubscriptionTier {
  id: 'alpha' | 'beta' | 'gamma';
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
  description: string;
}

// Subscription selection schema
export const subscriptionSchema = z.object({
  tier: z.enum(['alpha', 'beta', 'gamma'], {
    message: 'Pilih paket berlangganan'
  }),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

// Payment method type
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'ewallet';

// Payment form validation schema
export const paymentSchema = z.object({
  method: z.enum(['bank_transfer', 'credit_card', 'ewallet'], {
    message: 'Pilih metode pembayaran'
  }),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'Anda harus menyetujui syarat dan ketentuan'
  }),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

// Complete registration data
export interface RegistrationData {
  clinic: ClinicDataFormData;
  subscription: SubscriptionFormData;
  payment: PaymentFormData;
}

// Registration state
export interface RegistrationState {
  currentStep: RegistrationStep;
  data: Partial<RegistrationData>;
  isLoading: boolean;
  error: string | null;
}

// Mock subscription tiers data
export const mockSubscriptionTiers: SubscriptionTier[] = [
  {
    id: 'alpha',
    name: 'Alpha (Beta Tester)',
    price: 50000,
    period: 'per bulan',
    description: 'Paket untuk beta tester dengan fitur terbatas',
    features: [
      '2 Therapists',
      '4 Clients/day',
      '2 Scripts/client/session',
      '25 Techniques',
      'Basic Support'
    ],
  },
  {
    id: 'beta',
    name: 'Beta (Standard)',
    price: 150000,
    period: 'per bulan',
    description: 'Paket standar untuk klinik kecil hingga menengah',
    recommended: true,
    features: [
      '5 Therapists',
      '10 Clients/day',
      '5 Scripts/client/session',
      '50 Techniques',
      'Priority Support',
      'Advanced Analytics'
    ],
  },
  {
    id: 'gamma',
    name: 'Gamma (Premium)',
    price: 300000,
    period: 'per bulan',
    description: 'Paket premium untuk klinik besar dengan fitur lengkap',
    features: [
      'Unlimited Therapists',
      '25 Clients/day',
      'Unlimited Scripts',
      '100+ Techniques',
      '24/7 Premium Support',
      'Advanced Analytics',
      'Custom Integration',
      'White-label Option'
    ],
  },
];

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