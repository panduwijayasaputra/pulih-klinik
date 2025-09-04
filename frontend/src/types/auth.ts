import { SubscriptionTierEnum, UserRoleEnum } from './enums';

type EnumValue<T> = T[keyof T];

// User roles
export type UserRole = EnumValue<typeof UserRoleEnum>;

// Login form data type (schema is now in /schemas/authSchema.ts)
export type { LoginFormData } from '@/schemas/authSchema';

// Login API data type (without rememberMe for backend)
export interface LoginApiData {
  email: string;
  password: string;
}

// Simplified User interface - matches backend response structure exactly
export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  roles: UserRole[];
  clinicId?: string;
  clinicName?: string;
  subscriptionTier?: EnumValue<typeof SubscriptionTierEnum>;
}

// Simplified Clinic interface
export interface Clinic {
  id: string;
  name: string;
  isActive: boolean;
  subscription?: EnumValue<typeof SubscriptionTierEnum>;
}

// Simplified Authentication state - only essential fields
export interface AuthState {
  user: User | null;
  clinic: Clinic | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  lastValidated?: Date; // For cache management
}

// API response types
export interface LoginResponse {
  success: boolean;
  user?: User;
  clinic?: Clinic;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

// Registration types
export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface EmailVerificationData {
  email: string;
  code: string;
}

