import { useState } from 'react';

interface VerificationResponse {
  success: boolean;
  message: string;
}

interface EmailVerificationResponse {
  success: boolean;
  message: string;
  code?: string;
}

export const useRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendVerificationEmail = async (email: string): Promise<EmailVerificationResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Mock rate limiting check
      const lastSentTime = localStorage.getItem(`email_sent_${email}`);
      if (lastSentTime) {
        const timeDiff = Date.now() - parseInt(lastSentTime);
        if (timeDiff < 60000) { // 60 seconds
          throw new Error('Too many attempts, try again later');
        }
      }

      // Store sent time for rate limiting
      localStorage.setItem(`email_sent_${email}`, Date.now().toString());

      return {
        success: true,
        message: 'Verification email sent successfully',
        code: '123456' // Mock verification code
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification email';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string, email: string): Promise<VerificationResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock validation
      if (code.length !== 6) {
        throw new Error('Invalid code format');
      }

      // Mock verification attempts tracking
      const attemptsKey = `verification_attempts_${email}`;
      const attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
      
      if (attempts >= 3) {
        throw new Error('Maximum attempts reached. Please request a new code.');
      }

      // Mock code validation - '123456' is considered valid
      const isValid = code === '123456';
      
      if (!isValid) {
        // Increment attempts
        localStorage.setItem(attemptsKey, (attempts + 1).toString());
        throw new Error('Invalid verification code');
      }

      // Clear attempts on successful verification
      localStorage.removeItem(attemptsKey);

      return {
        success: true,
        message: 'Code verified successfully'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const clearVerificationAttempts = (email: string) => {
    localStorage.removeItem(`verification_attempts_${email}`);
    localStorage.removeItem(`email_sent_${email}`);
  };

  return {
    sendVerificationEmail,
    verifyCode,
    clearVerificationAttempts,
    loading,
    error,
    clearError: () => setError(null)
  };
};
