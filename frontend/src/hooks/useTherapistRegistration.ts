import { useState } from 'react';

// Types for therapist registration
interface TherapistInfo {
  id: string;
  name: string;
  email: string;
  clinicName: string;
}

interface TokenValidationResponse {
  valid: boolean;
  therapist?: TherapistInfo;
  error?: string;
}

interface RegistrationCompletionData {
  token: string;
  password: string;
}

interface RegistrationCompletionResponse {
  success: boolean;
  therapist_id?: string;
  account_activated?: boolean;
  message?: string;
}

export const useTherapistRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateToken = async (token: string): Promise<TokenValidationResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.warn('Token validation attempt:', { token: token.substring(0, 10) + '...' });

      // Mock token validation logic
      if (!token || token.length < 10) {
        return { 
          valid: false, 
          error: 'Invalid token format' 
        };
      }

      // Mock expired token check
      if (token.includes('expired')) {
        return { 
          valid: false, 
          error: 'Token has expired' 
        };
      }

      // Mock valid token response
      if (token.startsWith('token-')) {
        const therapistInfo: TherapistInfo = {
          id: 'th-' + token.split('-')[1],
          name: 'Dr. Budi Santoso',
          email: 'budi.santoso@example.com',
          clinicName: 'Klinik Sehat Jiwa Jakarta'
        };

        console.warn('Token validated successfully:', {
          token: token.substring(0, 10) + '...',
          therapistId: therapistInfo.id
        });

        return {
          valid: true,
          therapist: therapistInfo
        };
      }

      // Default invalid response
      return { 
        valid: false, 
        error: 'Invalid or unrecognized token' 
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token validation failed';
      setError(errorMessage);
      console.error('Token validation error:', err);
      
      return { 
        valid: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (data: RegistrationCompletionData): Promise<RegistrationCompletionResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Validate input data
      if (!data.token || !data.password) {
        throw new Error('Token and password are required');
      }

      if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      console.warn('Completing therapist registration:', {
        token: data.token.substring(0, 10) + '...',
        passwordLength: data.password.length,
        timestamp: new Date().toISOString()
      });

      // Mock registration completion
      const therapistId = 'th-' + Date.now();
      
      // Mock updating therapist status from 'pending_setup' to 'active'
      const updatedTherapist = {
        id: therapistId,
        status: 'active' as const,
        password_set: true,
        activated_at: new Date().toISOString(),
        registration_completed: true
      };

      console.warn('Therapist registration completed:', {
        therapistId,
        status: updatedTherapist.status,
        activatedAt: updatedTherapist.activated_at
      });

      // Mock sending confirmation email to therapist
      console.warn('Sending account activation confirmation email:', {
        therapistId,
        email: 'therapist@example.com', // Would come from token validation
        subject: 'Account Activated - TeraPin.tar'
      });

      // Mock notifying clinic admin
      console.warn('Notifying clinic admin of therapist activation:', {
        therapistId,
        therapistName: 'Dr. Budi Santoso', // Would come from token validation
        clinicAdminId: 'admin-123' // Would come from token validation
      });

      return {
        success: true,
        therapist_id: therapistId,
        account_activated: true,
        message: 'Registration completed successfully! You can now login.'
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration completion failed';
      setError(errorMessage);
      console.error('Registration completion error:', err);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

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