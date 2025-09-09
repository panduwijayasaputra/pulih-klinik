import { EmploymentTypeEnum, TherapistLicenseTypeEnum, TherapistStatusEnum } from '@/types/enums';
import { 
  Therapist, 
  TherapistCertification, 
  TherapistEducation,
  THERAPIST_SPECIALIZATIONS
} from '@/types/therapist';

// Mock therapist certifications
const mockCertifications: TherapistCertification[] = [
  {
    id: 'cert-001',
    name: 'Certified Clinical Hypnotherapist',
    issuingOrganization: 'Asosiasi Hipnoterapi Indonesia',
    issueDate: '2020-03-15',
    expiryDate: '2025-03-15',
    certificateNumber: 'CCH-2020-001',
    status: 'active'
  },
  {
    id: 'cert-002',
    name: 'Advanced Trauma Therapy',
    issuingOrganization: 'International Trauma Institute',
    issueDate: '2021-08-10',
    expiryDate: '2026-08-10',
    certificateNumber: 'ATT-2021-002',
    status: 'active'
  },
  {
    id: 'cert-003', 
    name: 'Child Psychology Specialist',
    issuingOrganization: 'Indonesian Psychology Association',
    issueDate: '2019-11-20',
    expiryDate: '2024-11-20',
    certificateNumber: 'CPS-2019-003',
    status: 'active'
  },
  {
    id: 'cert-004',
    name: 'Addiction Recovery Therapy',
    issuingOrganization: 'Rehabilitation Therapy Board',
    issueDate: '2020-06-12',
    expiryDate: '2025-06-12',
    certificateNumber: 'ART-2020-004',
    status: 'active'
  }
];

// Mock therapist education
const mockEducation: TherapistEducation[] = [
  {
    degree: 'S1 Psikologi',
    institution: 'Universitas Indonesia',
    year: 2015,
    field: 'Psikologi Klinis'
  },
  {
    degree: 'S2 Psikologi',
    institution: 'Universitas Gadjah Mada',
    year: 2017,
    field: 'Psikologi Profesi'
  },
  {
    degree: 'S1 Psikologi',
    institution: 'Universitas Padjadjaran',
    year: 2018,
    field: 'Psikologi Anak'
  },
  {
    degree: 'S2 Psikologi',
    institution: 'Universitas Airlangga',
    year: 2016,
    field: 'Psikologi Kesehatan'
  }
];

// Mock therapist data using proper types
export const mockTherapists: Therapist[] = [
  {
    id: 'th-001',
    clinicId: 'clinic-001',
    fullName: 'Dr. Ahmad Rahman',
    email: 'dr.ahmad@kliniksehat.com',
    phone: '+628123456789',
    avatar: '/avatars/ahmad-rahman.jpg',
    
    // Professional Info
    licenseNumber: 'SIP-001-2020',
    licenseType: TherapistLicenseTypeEnum.Psychologist,
    specializations: ['anxiety-depression', 'trauma-ptsd'],
    education: [mockEducation[0]!, mockEducation[1]!],
    certifications: [mockCertifications[0]!, mockCertifications[1]!],
    yearsOfExperience: 8,
    
    // Status & Availability
    status: TherapistStatusEnum.Active,
    joinDate: '2020-01-15',
    
    // Assignment Info
    assignedClients: ['client-001', 'client-002', 'client-003'],
    maxClients: 15,
    currentLoad: 12,
    
    // Schedule
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '09:00', endTime: '15:00', isAvailable: true }
    ],
    timezone: 'Asia/Jakarta',
    
    // Settings
    preferences: {
      sessionDuration: 60,
      maxSessionsPerDay: 8,
      languages: ['Indonesian', 'English'],
      workingDays: [1, 2, 3, 4, 5]
    },
    
    // Admin Notes
    adminNotes: 'Therapist senior dengan track record yang sangat baik. Spesialisasi dalam menangani kasus trauma.',
    
    // Audit
    createdAt: '2020-01-15T08:00:00Z',
    updatedAt: '2024-08-20T10:30:00Z'
  },
  {
    id: 'th-002',
    clinicId: 'clinic-001',
    fullName: 'Dr. Sarah Wijaya',
    email: 'therapist@kliniksehat.com',
    phone: '+628234567890',
    avatar: '/avatars/sarah-wijaya.jpg',
    
    // Professional Info
    licenseNumber: 'SIP-002-2021',
    licenseType: TherapistLicenseTypeEnum.Counselor,
    specializations: ['child-adolescent', 'couples-family'],
    education: [mockEducation[2]!],
    certifications: [mockCertifications[2]!],
    yearsOfExperience: 6,
    
    // Status & Availability
    status: TherapistStatusEnum.Active,
    joinDate: '2021-03-20',
    
    // Assignment Info
    assignedClients: ['client-004', 'client-005'],
    maxClients: 10,
    currentLoad: 8,
    
    // Schedule
    schedule: [
      { dayOfWeek: 1, startTime: '13:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '13:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '13:00', endTime: '18:00', isAvailable: true }
    ],
    timezone: 'Asia/Jakarta',
    
    // Settings
    preferences: {
      sessionDuration: 45,
      maxSessionsPerDay: 6,
      languages: ['Indonesian'],
      workingDays: [1, 3, 5]
    },
    
    // Admin Notes
    adminNotes: 'Bagus dalam menangani anak dan remaja. Komunikasi yang baik dengan orang tua.',
    
    // Audit
    createdAt: '2021-03-20T09:00:00Z',
    updatedAt: '2024-08-19T14:20:00Z'
  },
  {
    id: 'th-003',
    clinicId: 'clinic-001',
    fullName: 'Dr. Maya Sari, M.Psi, Psikolog',
    email: 'maya.sari@pulihklinik.id',
    phone: '+628345678901',
    avatar: '/avatars/maya-sari.jpg',
    
    // Professional Info
    licenseNumber: 'SIP-003-2019',
    licenseType: TherapistLicenseTypeEnum.Psychologist,
    specializations: ['addiction-therapy', 'stress-management'],
    education: [mockEducation[0]!, mockEducation[3]!],
    certifications: [mockCertifications[3]!],
    yearsOfExperience: 10,
    
    // Status & Availability
    status: TherapistStatusEnum.PendingSetup,
    joinDate: '2024-08-15',
    
    // Assignment Info
    assignedClients: [],
    maxClients: 12,
    currentLoad: 0,
    
    // Schedule
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '16:00', isAvailable: true }
    ],
    timezone: 'Asia/Jakarta',
    
    // Settings
    preferences: {
      sessionDuration: 60,
      maxSessionsPerDay: 7,
      languages: ['Indonesian', 'English', 'Mandarin'],
      workingDays: [1, 2, 3, 4]
    },
    
    // Admin Notes
    adminNotes: 'Therapist baru yang menunjukkan potensi tinggi. Perlu dimonitor selama periode probation.',
    
    // Audit
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2024-08-15T10:00:00Z'
  },
  {
    id: 'th-004',
    clinicId: 'clinic-001',
    fullName: 'Rina Kartika, S.Psi',
    email: 'rina.kartika@pulihklinik.id',
    phone: '+628456789012',
    avatar: '/avatars/rina-kartika.jpg',
    
    // Professional Info
    licenseNumber: 'SIP-004-2022',
    licenseType: TherapistLicenseTypeEnum.Hypnotherapist,
    specializations: ['eating-disorders', 'self-esteem'],
    education: [mockEducation[2]!],
    certifications: [mockCertifications[0]!],
    yearsOfExperience: 4,
    
    // Status & Availability
    status: TherapistStatusEnum.Inactive,
    joinDate: '2022-06-10',
    
    // Assignment Info
    assignedClients: ['client-006'],
    maxClients: 8,
    currentLoad: 1,
    
    // Schedule
    schedule: [
      { dayOfWeek: 2, startTime: '14:00', endTime: '19:00', isAvailable: false },
      { dayOfWeek: 4, startTime: '14:00', endTime: '19:00', isAvailable: false },
      { dayOfWeek: 6, startTime: '09:00', endTime: '14:00', isAvailable: false }
    ],
    timezone: 'Asia/Jakarta',
    
    // Settings
    preferences: {
      sessionDuration: 90,
      maxSessionsPerDay: 4,
      languages: ['Indonesian'],
      workingDays: [2, 4, 6]
    },
    
    // Audit
    createdAt: '2022-06-10T11:00:00Z',
    updatedAt: '2024-07-30T16:45:00Z'
  },
  {
    id: 'th-005',
    clinicId: 'clinic-001',
    fullName: 'Dr. Budi Santoso, M.Psi, Psikolog',
    email: 'budi.santoso@pulihklinik.id',
    phone: '+628567890123',
    avatar: '/avatars/budi-santoso.jpg',
    
    // Professional Info
    licenseNumber: 'SIP-005-2020',
    licenseType: TherapistLicenseTypeEnum.Psychologist,
    specializations: ['sleep-disorders', 'phobias'],
    education: [mockEducation[1]!, mockEducation[3]!],
    certifications: [mockCertifications[1]!, mockCertifications[2]!],
    yearsOfExperience: 12,
    
    // Status & Availability
    status: TherapistStatusEnum.Active,
    joinDate: '2020-09-01',
    
    // Assignment Info
    assignedClients: ['client-007', 'client-008', 'client-009', 'client-010'],
    maxClients: 18,
    currentLoad: 15,
    
    // Schedule
    schedule: [
      { dayOfWeek: 1, startTime: '07:00', endTime: '15:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '07:00', endTime: '15:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '07:00', endTime: '15:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '07:00', endTime: '15:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '07:00', endTime: '12:00', isAvailable: true }
    ],
    timezone: 'Asia/Jakarta',
    
    // Settings
    preferences: {
      sessionDuration: 50,
      maxSessionsPerDay: 10,
      languages: ['Indonesian', 'English', 'Javanese'],
      workingDays: [1, 2, 3, 4, 5]
    },
    
    // Audit
    createdAt: '2020-09-01T08:30:00Z',
    updatedAt: '2024-08-21T09:15:00Z'
  }
];

// Convenience function to get mock therapists
export const getMockTherapists = () => mockTherapists;

// Function to get therapist by ID
export const getMockTherapistById = (id: string): Therapist | null => {
  return mockTherapists.find(therapist => therapist.id === id) || null;
};

// Function to get therapists by clinic ID
export const getMockTherapistsByClinicId = (clinicId: string): Therapist[] => {
  return mockTherapists.filter(therapist => therapist.clinicId === clinicId);
};

// Function to get therapists by status
export const getMockTherapistsByStatus = (status: TherapistStatusEnum): Therapist[] => {
  return mockTherapists.filter(therapist => therapist.status === status);
};