import { AuthSubscriptionTierEnum, UserRoleEnum } from './enums';

type EnumValue<T> = T[keyof T];

// User roles
export type UserRole = EnumValue<typeof UserRoleEnum>;

// Login form data type (schema is now in /schemas/authSchema.ts)
export type { LoginFormData } from '@/schemas/authSchema';

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

