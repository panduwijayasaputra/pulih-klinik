import { TherapistAssignmentStatusEnum, TherapistLicenseTypeEnum } from './enums';
import { UserStatusEnum } from './status';

export interface TherapistSpecialization {
  id: string;
  name: string;
  description: string;
}

export interface TherapistEducation {
  degree: string;
  institution: string;
  year: number;
  field: string;
}

type EnumValue<T> = T[keyof T];

export interface TherapistCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber: string;
  status: 'active' | 'expired' | 'pending';
}



export interface TherapistSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export interface TherapistContact {
  phone: string;
  email: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Therapist {
  id: string;
  clinicId: string;
  clinicName: string;
  userId: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  
  // Professional Info
  licenseNumber: string;
  licenseType: EnumValue<typeof TherapistLicenseTypeEnum>;
  education?: string;
  certifications?: string;
  
  // Status & Availability
  status: UserStatusEnum; // Unified user status (replaces both therapist.status and user.isActive)
  joinDate: string;
  
  // Assignment Info
  assignedClients: string[]; // Client IDs
  currentLoad: number; // Current number of active clients
  
  // Schedule
  schedule: TherapistSchedule[];
  timezone: string;
  
  // Settings
  preferences: {
    languages: string[];
  };
    
  // Admin Notes
  adminNotes?: string; // Internal notes by clinic admins
  
  // Audit
  createdAt: string;
  updatedAt: string;

}

export interface TherapistFormData {
  fullName: string; // This will map to profile.name
  email: string;
  phone: string;
  avatarUrl?: string;
  licenseNumber: string;
  licenseType: Therapist['licenseType'];
  timezone?: string;
  adminNotes?: string;
  education?: string;
  certifications?: string;
  preferences: Therapist['preferences'];
}

export interface TherapistFilters {
  status?: Therapist['status'];
  licenseType?: Therapist['licenseType'];
  search?: string; // Added 'search' field that API expects
  searchQuery?: string; // Keep for backward compatibility
  maxLoad?: number;
  hasAvailableCapacity?: boolean;
  sortBy?: 'name' | 'joinDate' | 'clientCount';
  sortOrder?: 'asc' | 'desc';
}

export interface TherapistAssignment {
  id: string;
  therapistId: string;
  clientId: string;
  assignedDate: string;
  assignedBy: string; // Admin/clinic owner ID
  status: EnumValue<typeof TherapistAssignmentStatusEnum>;
  notes?: string;
  endDate?: string;
  transferReason?: string;
}

// Available specializations in the system
export const THERAPIST_SPECIALIZATIONS: TherapistSpecialization[] = [
  {
    id: 'anxiety-depression',
    name: 'Kecemasan & Depresi',
    description: 'Penanganan gangguan kecemasan, depresi, dan mood disorders'
  },
  {
    id: 'addiction-therapy',
    name: 'Terapi Adiksi',
    description: 'Rehabilitasi dan pemulihan dari berbagai jenis kecanduan'
  },
  {
    id: 'trauma-ptsd',
    name: 'Trauma & PTSD',
    description: 'Terapi untuk trauma psikologis dan gangguan stres pasca-trauma'
  },
  {
    id: 'child-adolescent',
    name: 'Anak & Remaja',
    description: 'Terapi khusus untuk anak-anak dan remaja'
  },
  {
    id: 'couples-family',
    name: 'Pasangan & Keluarga',
    description: 'Terapi untuk hubungan pasangan dan konseling keluarga'
  },
  {
    id: 'eating-disorders',
    name: 'Gangguan Makan',
    description: 'Penanganan anoreksia, bulimia, dan gangguan makan lainnya'
  },
  {
    id: 'sleep-disorders',
    name: 'Gangguan Tidur',
    description: 'Terapi untuk insomnia dan gangguan tidur lainnya'
  },
  {
    id: 'phobias',
    name: 'Fobia',
    description: 'Penanganan berbagai jenis fobia dan ketakutan berlebihan'
  },
  {
    id: 'stress-management',
    name: 'Manajemen Stres',
    description: 'Teknik mengelola stres dan tekanan hidup'
  },
  {
    id: 'self-esteem',
    name: 'Harga Diri',
    description: 'Meningkatkan kepercayaan diri dan harga diri'
  }
];

export const LICENSE_TYPES = [
  { value: 'psychologist', label: 'Psikolog' },
  { value: 'psychiatrist', label: 'Psikiater' },
  { value: 'counselor', label: 'Konselor' },
  { value: 'hypnotherapist', label: 'Hipnoterapis' }
] as const;

export const THERAPIST_STATUS = [
  { value: UserStatusEnum.ACTIVE, label: 'Aktif', color: 'green' },
  { value: UserStatusEnum.INACTIVE, label: 'Tidak Aktif', color: 'gray' },
  { value: UserStatusEnum.ON_LEAVE, label: 'Cuti', color: 'blue' },
  { value: UserStatusEnum.SUSPENDED, label: 'Ditahan', color: 'red' },
  { value: UserStatusEnum.PENDING_SETUP, label: 'Menunggu Setup', color: 'yellow' },
  { value: UserStatusEnum.PENDING_VERIFICATION, label: 'Menunggu Verifikasi', color: 'yellow' },
  { value: UserStatusEnum.DISABLED, label: 'Dinonaktifkan', color: 'red' },
] as const;

// Therapist Registration Types
export interface TherapistRegistration {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  yearsExperience: number;
  education: string;
  certifications: string[];
  bio?: string;
  password: string;
  passwordConfirmation: string;
}

// Therapist Performance Types
export interface TherapistPerformance {
  therapistId: string;
  sessionsCompleted: number;
  clientSatisfaction: number;
  tokensUsed: number;
  activeClients: number;
  completionRate: number;
  averageSessionDuration: number;
  periodStart: string;
  periodEnd: string;
}