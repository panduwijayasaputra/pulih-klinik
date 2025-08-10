import { z } from 'zod';
import { AuthSubscriptionTierEnum, UserRoleEnum } from './enums';

type EnumValue<T> = T[keyof T];

// User roles
export type UserRole = EnumValue<typeof UserRoleEnum>;

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  clinicId?: string;
  subscriptionTier?: EnumValue<typeof AuthSubscriptionTierEnum>;
}

// Authentication state
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// API response types
export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

// Mock users data
export const mockUsers: Record<string, User & { password: string }> = {
  'admin@terapintar.com': {
    id: 'admin-001',
    email: 'admin@terapintar.com',
    password: 'admin123',
    roles: [UserRoleEnum.Administrator],
    name: 'System Administrator'
  },
  'admin@kliniksehat.com': {
    id: 'clinic-001',
    email: 'admin@kliniksehat.com',
    password: 'clinic123',
    roles: [UserRoleEnum.ClinicAdmin],
    name: 'Dr. Sari Wulandari',
    clinicId: 'clinic-001',
    subscriptionTier: AuthSubscriptionTierEnum.Beta
  },
  'therapist@kliniksehat.com': {
    id: 'therapist-001',
    email: 'therapist@kliniksehat.com',
    password: 'therapist123',
    roles: [UserRoleEnum.Therapist],
    name: 'Ahmad Pratama',
    clinicId: 'clinic-001'
  },
  'dr.ahmad@kliniksehat.com': {
    id: 'multi-001',
    email: 'dr.ahmad@kliniksehat.com',
    password: 'multi123',
    roles: [UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist],
    name: 'Dr. Ahmad Pratama',
    clinicId: 'clinic-001',
    subscriptionTier: AuthSubscriptionTierEnum.Beta
  }
};