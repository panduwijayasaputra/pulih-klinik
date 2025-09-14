import { httpClient, handleApiResponse, handleApiError } from '@/lib/http-client';

// Types for therapist setup
export interface TherapistInfo {
  id: string;
  name: string;
  email: string;
  clinicName: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  therapist?: TherapistInfo;
  error?: string;
}

export interface SetupCompletionResponse {
  success: boolean;
  message: string;
  therapistId?: string;
}

export interface SetupCompletionData {
  token: string;
  password: string;
  confirmPassword: string;
}

export class TherapistSetupAPI {
  /**
   * Verify therapist setup token
   */
  static async verifyToken(token: string): Promise<TokenValidationResponse> {
    try {
      const response = await httpClient.post('/therapists/verify-setup-token', {
        token,
      });
      
      // Extract the data from the response
      const responseData = response.data;
      const data = responseData.data; // The actual data is nested in response.data.data
      
      if (data.valid && data.therapist) {
        return {
          valid: true,
          therapist: data.therapist,
        };
      }
      
      return {
        valid: false,
        error: data.error || 'Invalid or expired token',
      };
    } catch (error) {
      const errorData = handleApiError(error);
      
      return {
        valid: false,
        error: errorData.message || 'Token verification failed',
      };
    }
  }

  /**
   * Complete therapist setup with password
   */
  static async completeSetup(data: SetupCompletionData): Promise<SetupCompletionResponse> {
    try {
      console.log('API: Sending complete setup request:', {
        token: data.token.substring(0, 10) + '...',
        passwordLength: data.password.length,
        confirmPasswordLength: data.confirmPassword.length
      });
      
      const response = await httpClient.post('/therapists/complete-setup', {
        token: data.token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      
      console.log('API: Complete setup response:', response);
      
      // Extract the data from the response
      const responseData = response.data;
      const result = responseData.data; // The actual data is nested in response.data.data
      
      console.log('API: Extracted result:', result);
      
      return {
        success: true,
        message: result.message,
        therapistId: result.therapistId,
      };
    } catch (error) {
      console.error('API: Complete setup error:', error);
      const errorData = handleApiError(error);
      
      return {
        success: false,
        message: errorData.message || 'Setup completion failed',
      };
    }
  }
}
