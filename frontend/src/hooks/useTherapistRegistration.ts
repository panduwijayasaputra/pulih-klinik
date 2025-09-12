import { useState, useCallback } from 'react';
import { TherapistSetupAPI, TherapistInfo, TokenValidationResponse, SetupCompletionResponse, SetupCompletionData } from '@/lib/api/therapistSetup';

// Types for therapist registration
interface RegistrationCompletionData {
  token: string;
  password: string;
}

export const useTherapistRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateToken = useCallback(async (token: string): Promise<TokenValidationResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await TherapistSetupAPI.verifyToken(token);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token validation failed';
      setError(errorMessage);
      
      return { 
        valid: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const completeRegistration = useCallback(async (data: RegistrationCompletionData): Promise<SetupCompletionResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await TherapistSetupAPI.completeSetup({
        token: data.token,
        password: data.password,
        confirmPassword: data.password, // The form validation ensures they match
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Setup completion failed';
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendRegistrationEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      console.warn('Resending registration email:', {
        email,
        timestamp: new Date().toISOString()
      });

      // Mock checking if therapist exists and is pending
      const therapistExists = email !== 'nonexistent@example.com';
      if (!therapistExists) {
        throw new Error('No pending registration found for this email');
      }

      // Mock sending new registration email
      const newToken = 'token-' + Date.now() + '-resent';
      console.warn('New registration email sent:', {
        email,
        newToken: newToken.substring(0, 15) + '...'
      });

      return {
        success: true,
        message: 'New registration email sent successfully'
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend registration email';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async (email: string): Promise<{
    success: boolean;
    status: 'not_found' | 'pending_setup' | 'active' | 'inactive';
    message?: string;
  }> => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      console.warn('Checking registration status for:', email);

      // Mock status check
      if (email === 'active@example.com') {
        return {
          success: true,
          status: 'active',
          message: 'Account is already active'
        };
      }

      if (email === 'pending@example.com') {
        return {
          success: true,
          status: 'pending_setup',
          message: 'Registration is pending - check your email for setup link'
        };
      }

      return {
        success: true,
        status: 'not_found',
        message: 'No registration found for this email'
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Status check failed';
      setError(errorMessage);
      return {
        success: false,
        status: 'not_found',
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    validateToken,
    completeRegistration,
    resendRegistrationEmail,
    checkRegistrationStatus,
    loading,
    error,
    clearError: () => setError(null)
  };
};