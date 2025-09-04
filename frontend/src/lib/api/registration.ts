import { RegistrationData, EmailVerificationData } from '@/types/auth';
import { ItemResponse } from './types';
import { httpClient, handleApiResponse, handleApiError } from '@/lib/http-client';

export interface RegistrationResponse {
  success: boolean;
  data?: {
    registrationId: string;
    email: string;
    name: string;
    message: string;
  };
  message?: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  data?: {
    verified: boolean;
    message: string;
  };
  message?: string;
}

export interface ResendCodeResponse {
  success: boolean;
  data?: {
    message: string;
  };
  message?: string;
}

export class RegistrationAPI {
  static async register(data: RegistrationData): Promise<RegistrationResponse> {
    try {
      const response = await httpClient.post('/registration/start', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      const result = handleApiResponse(response);
      
      return {
        success: true,
        data: result.data,
        message: result.message || 'Registration started successfully'
      };
    } catch (error) {
      handleApiError(error);
    }
  }

  static async verifyEmail(data: EmailVerificationData): Promise<EmailVerificationResponse> {
    try {
      const response = await httpClient.post('/registration/verify-email', {
        email: data.email,
        code: data.code,
      });
      const result = handleApiResponse(response);
      
      return {
        success: true,
        data: result.data,
        message: result.message || 'Email verified successfully'
      };
    } catch (error) {
      handleApiError(error);
    }
  }

  static async resendCode(email: string): Promise<ResendCodeResponse> {
    try {
      const response = await httpClient.post('/registration/resend-code', {
        email,
      });
      const result = handleApiResponse(response);
      
      return {
        success: true,
        data: result.data,
        message: result.message || 'Verification code sent successfully'
      };
    } catch (error) {
      handleApiError(error);
    }
  }

  static async adminVerify(email: string): Promise<EmailVerificationResponse> {
    try {
      const response = await httpClient.post('/registration/admin-verify', {
        email,
      });
      const result = handleApiResponse(response);
      
      return {
        success: true,
        data: result.data,
        message: result.message || 'Email verified by admin successfully'
      };
    } catch (error) {
      handleApiError(error);
    }
  }
}