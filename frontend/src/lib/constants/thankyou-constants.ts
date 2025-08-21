// Thank You Page Constants
// This file contains constants used in the thank you page

import { 
  ClockIcon,
  DocumentTextIcon,
  PlayIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

export const NEXT_STEPS = [
  {
    id: 1,
    icon: ClockIcon,
    title: 'Konfirmasi Pembayaran',
    description: 'Selesaikan pembayaran dalam 24 jam untuk mengaktifkan akun',
    status: 'pending' as const,
    timeframe: '24 jam'
  },
  {
    id: 2,
    icon: UserPlusIcon,
    title: 'Setup Akun Therapist',
    description: 'Tambahkan therapist pertama dan atur profil klinik',
    status: 'upcoming' as const,
    timeframe: 'Setelah aktivasi'
  },
  {
    id: 3,
    icon: DocumentTextIcon,
    title: 'Import Data Klien',
    description: 'Upload data klien yang sudah ada (opsional)',
    status: 'upcoming' as const,
    timeframe: 'Kapan saja'
  },
  {
    id: 4,
    icon: PlayIcon,
    title: 'Sesi Hipnoterapi Pertama',
    description: 'Mulai menggunakan AI untuk sesi hipnoterapi',
    status: 'upcoming' as const,
    timeframe: 'Setelah setup'
  },
] as const;

export const CONTACT_INFO = {
  email: 'support@terapintar.com',
  phone: '+62-21-1234-5678',
  whatsapp: 'WhatsApp Support'
} as const;

export const REGISTRATION_SUMMARY = {
  clinicId: 'CLINIC-001',
  status: 'Pending Aktivasi',
  package: 'Beta (Standard)',
  total: 'Rp 166.500/bulan',
  paymentMethod: 'Transfer Bank',
  paymentStatus: 'Menunggu Pembayaran'
} as const;
