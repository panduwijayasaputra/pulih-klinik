import { 
  ClinicDocument, 
  ClinicProfile
} from '@/types/clinic';
import { 
  ClinicDocumentTypeEnum, 
  ClinicSubscriptionTierEnum 
} from '@/types/enums';

// Mock data for clinic related to dr.ahmad@kliniksehat.com
export const mockClinicProfile: ClinicProfile = {
  id: 'clinic-001',
  name: 'Klinik Sehat Jiwa Jakarta',
  address: 'Jl. Sudirman No. 123, Blok A, Lantai 2, Tanah Abang, Jakarta Pusat, DKI Jakarta 10270',
  phone: '+62812345678',
  email: 'info@kliniksehat.com',
  website: 'https://kliniksehat.com',
  logo: '/placeholder-logo.png',
  description: 'Klinik Sehat Jiwa Jakarta adalah pusat terapi hipnoterapi profesional yang melayani berbagai kebutuhan kesehatan mental dan emosional. Dengan tim therapist berpengalaman dan metode terapi modern, kami berkomitmen membantu klien mencapai kesejahteraan mental yang optimal.',
  workingHours: 'Senin - Jumat: 08:00 - 17:00, Sabtu: 08:00 - 14:00',
  branding: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    fontFamily: 'Inter'
  },
  settings: {
    timezone: 'Asia/Jakarta',
    language: 'id',
    notifications: {
      email: true,
      sms: true,
      push: false
    }
  },
  documents: [
    {
      id: 'doc-001',
      name: 'Izin Praktik Klinik',
      type: ClinicDocumentTypeEnum.License,
      fileName: 'izin-praktik-klinik.pdf',
      fileSize: 2048000,
      uploadedAt: '2024-01-15T09:00:00Z',
      url: '/documents/izin-praktik-klinik.pdf',
      description: 'Izin praktik klinik yang dikeluarkan oleh Dinas Kesehatan DKI Jakarta'
    },
    {
      id: 'doc-002',
      name: 'Sertifikat Akreditasi',
      type: ClinicDocumentTypeEnum.Certificate,
      fileName: 'sertifikat-akreditasi.pdf',
      fileSize: 1536000,
      uploadedAt: '2024-02-01T10:30:00Z',
      url: '/documents/sertifikat-akreditasi.pdf',
      description: 'Sertifikat akreditasi klinik dari Komisi Akreditasi Rumah Sakit'
    }
  ],
  subscriptionTier: ClinicSubscriptionTierEnum.Beta,
  createdAt: '2024-01-01T08:00:00Z',
  updatedAt: '2024-08-15T14:30:00Z'
};

// Mock statistics data
export const mockClinicStats = {
  therapists: 3,
  clients: 25,
  sessions: 147,
  documents: 2
};

// Mock documents data
export const mockClinicDocuments: ClinicDocument[] = mockClinicProfile.documents || [];