import { RegistrationData, EmailVerificationData } from '@/types/auth';
import { EmailStatus } from '@/types/registration';
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
  static async checkEmailStatus(email: string): Promise<EmailStatus> {
    try {
      const response = await httpClient.post('/registration/check-email', {
        email,
      });
      const result = handleApiResponse(response) as { data: EmailStatus };
      
      return result.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async register(data: RegistrationData): Promise<RegistrationResponse> {
    try {
      const response = await httpClient.post('/registration/start', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      const result = handleApiResponse(response) as { data: any; message?: string };
      
      return {
        success: true,
        data: result.data,
        message: result.message || 'Registrasi berhasil dimulai'
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async verifyEmail(data: EmailVerificationData): Promise<EmailVerificationResponse> {
    try {
      const response = await httpClient.post('/registration/verify-email', {
        email: data.email,
        code: data.code,
      });
      const result = handleApiResponse(response) as { data: any; message?: string };
      
      return {
        success: true,
        data: result.data,
        message: result.message || 'Email berhasil diverifikasi'
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async resendCode(email: string): Promise<ResendCodeResponse> {
    try {
      const response = await httpClient.post('/registration/resend-code', {
        email,
      });
      const result = handleApiResponse(response) as { data: any; message?: string };
      
      return {
        success: true,
        data: result.data,
        message: result.message || 'Kode verifikasi berhasil dikirim'
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async adminVerify(email: string): Promise<EmailVerificationResponse> {
    try {
      const response = await httpClient.post('/registration/admin-verify', {
        email,
      });
      const result = handleApiResponse(response) as { data: any; message?: string };
      
      return {
        success: true,
        data: result.data,
        message: result.message || 'Email berhasil diverifikasi oleh admin'
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}