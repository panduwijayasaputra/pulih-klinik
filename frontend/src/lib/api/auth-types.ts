import { User } from '@/types/auth';

// Base API response structure
export interface BaseApiResponse {
  success: boolean;
  message?: string;
}

// Login API response
export interface LoginApiResponse extends BaseApiResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// Refresh token API response
export interface RefreshTokenApiResponse extends BaseApiResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// Current user API response
export interface CurrentUserApiResponse extends BaseApiResponse {
  data: User;
}

// Change password API response
export interface ChangePasswordApiResponse extends BaseApiResponse {
  data?: {
    message: string;
  };
}

// Forgot password API response
export interface ForgotPasswordApiResponse extends BaseApiResponse {
  data?: {
    message: string;
  };
}

// Reset password API response
export interface ResetPasswordApiResponse extends BaseApiResponse {
  data?: {
    message: string;
  };
}
