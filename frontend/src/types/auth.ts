import { AuthSubscriptionTierEnum, UserRoleEnum } from './enums';

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

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  roleDetails?: Array<{
    id: string;
    role: string;
  }>;
  clinicId?: string;
  clinicName?: string;
  subscriptionTier?: EnumValue<typeof AuthSubscriptionTierEnum>;
}

// Authentication state
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
}

// API response types
export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
}

