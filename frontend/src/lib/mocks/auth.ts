import { User } from '@/types/auth';
import { AuthSubscriptionTierEnum, UserRoleEnum } from '@/types/enums';

// Mock user data for demo purposes
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@terapintar.com',
    name: 'Administrator Sistem',
    roles: [UserRoleEnum.Administrator],
    subscriptionTier: AuthSubscriptionTierEnum.Alpha,
  },
  {
    id: '2',
    email: 'admin@kliniksehat.com',
    name: 'Admin Klinik Sehat',
    roles: [UserRoleEnum.ClinicAdmin],
    clinicId: 'clinic-1',
    subscriptionTier: AuthSubscriptionTierEnum.Beta,
  },
  {
    id: '3',
    email: 'therapist@kliniksehat.com',
    name: 'Dr. Sarah Wijaya',
    roles: [UserRoleEnum.Therapist],
    clinicId: 'clinic-1',
    subscriptionTier: AuthSubscriptionTierEnum.Beta,
  },
  {
    id: '4',
    email: 'dr.ahmad@kliniksehat.com',
    name: 'Dr. Ahmad Rahman',
    roles: [UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist],
    clinicId: 'clinic-1',
    subscriptionTier: AuthSubscriptionTierEnum.Beta,
  },
  {
    id: '5',
    email: 'newadmin@klinikbaru.com',
    name: 'Admin Klinik Baru',
    roles: [UserRoleEnum.ClinicAdmin],
  },
];

// Mock credentials mapping
export const mockCredentials = {
  'admin@terapintar.com': 'admin123',
  'admin@kliniksehat.com': 'clinic123',
  'therapist@kliniksehat.com': 'therapist123',
  'dr.ahmad@kliniksehat.com': 'multi123',
  'newadmin@klinikbaru.com': 'onboard123',
};

// Demo credentials for login form dropdown
export const demoCredentials = [
  {
    label: 'Administrator',
    email: 'admin@terapintar.com',
    password: 'admin123'
  },
  {
    label: 'Admin Klinik',
    email: 'admin@kliniksehat.com',
    password: 'clinic123'
  },
  {
    label: 'Therapist',
    email: 'therapist@kliniksehat.com',
    password: 'therapist123'
  },
  {
    label: 'Multi Role (Admin + Therapist)',
    email: 'dr.ahmad@kliniksehat.com',
    password: 'multi123'
  },
  {
    label: 'Admin Baru (Perlu Onboarding)',
    email: 'newadmin@klinikbaru.com',
    password: 'onboard123'
  }
];