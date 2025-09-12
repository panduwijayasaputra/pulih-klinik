import { SubscriptionTierEnum, UserRoleEnum } from './enums';
import { UserStatusEnum, ClinicStatusEnum } from './status';

type EnumValue<T> = T[keyof T];

// User roles - simplified to string array for consistency with backend
export type UserRole = string;

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
  status: UserStatusEnum; // Unified status (replaces isActive)
  roles: string[]; // Simplified to string array
  clinicId?: string;
  clinicName?: string;
  subscriptionTier?: string;
}

// Simplified Clinic interface
export interface Clinic {
  id: string;
  name: string;
  status: ClinicStatusEnum; // Unified status (replaces isActive)
  subscriptionTier?: string;
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

