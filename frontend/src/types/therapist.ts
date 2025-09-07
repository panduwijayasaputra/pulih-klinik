import { EmploymentTypeEnum, TherapistAssignmentStatusEnum, TherapistLicenseTypeEnum, TherapistStatusEnum } from './enums';

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
  fullName: string; // Changed from 'name' to match API usage
  email: string;
  phone: string;
  avatar?: string;
  
  // Professional Info
  licenseNumber: string;
  licenseType: EnumValue<typeof TherapistLicenseTypeEnum>;
  specializations: string[];
  education: TherapistEducation[];
  certifications: TherapistCertification[];
  yearsOfExperience: number;
  
  // Status & Availability
  status: EnumValue<typeof TherapistStatusEnum>;
  employmentType: EnumValue<typeof EmploymentTypeEnum>;
  joinDate: string;
  
  // Assignment Info
  assignedClients: string[]; // Client IDs
  maxClients: number;
  currentLoad: number; // Current number of active clients
  
  // Schedule
  schedule: TherapistSchedule[];
  timezone: string;
  
  // Settings
  preferences: {
    sessionDuration: number; // in minutes
    breakBetweenSessions: number; // in minutes
    maxSessionsPerDay: number;
    languages: string[];
    workingDays: number[]; // 0-6 (Sunday-Saturday)
  };
    
  // Admin Notes
  adminNotes?: string; // Internal notes by clinic admins
  
  // Audit
  createdAt: string;
  updatedAt: string;

}

export interface TherapistFormData {
  fullName: string; // Changed from 'name' to match Therapist interface
  email: string;
  phone: string;
  licenseNumber: string;
  licenseType: Therapist['licenseType'];
  specializations: string[];
  yearsOfExperience: number;
  employmentType: Therapist['employmentType'];
  maxClients: number;
  timezone?: string;
  adminNotes?: string;
  education?: TherapistEducation[];
  certifications?: Omit<TherapistCertification, 'id' | 'status'>[];
  preferences: Therapist['preferences'];
}

export interface TherapistFilters {
  status?: Therapist['status'];
  specializations?: string[];
  employmentType?: Therapist['employmentType'];
  licenseType?: Therapist['licenseType'];
  search?: string; // Added 'search' field that API expects
  searchQuery?: string; // Keep for backward compatibility
  maxLoad?: number;
  minExperience?: number;
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

export const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Penuh Waktu' },
  { value: 'part_time', label: 'Paruh Waktu' },
  { value: 'contract', label: 'Kontrak' },
  { value: 'freelance', label: 'Freelance' }
] as const;

export const THERAPIST_STATUS = [
  { value: 'active', label: 'Aktif', color: 'green' },
  { value: 'inactive', label: 'Tidak Aktif', color: 'gray' },
  { value: 'on_leave', label: 'Cuti', color: 'yellow' },
  { value: 'suspended', label: 'Suspended', color: 'red' }
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