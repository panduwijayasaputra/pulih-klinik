import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { RegisterFlow } from '@/components/auth/RegisterFlow';
import { useRegistrationStore } from '@/store/registration';
import { useRegistration } from '@/hooks/useRegistration';

// Mock the registration store
jest.mock('@/store/registration', () => ({
  useRegistrationStore: jest.fn()
}));

// Mock the registration hook
jest.mock('@/hooks/useRegistration', () => ({
  useRegistration: jest.fn()
}));

describe('User Registration Flow Acceptance Tests', () => {
  const mockStore = {
    currentStep: 'clinic',
    data: {
      clinic: null,
      verification: { code: '', emailSent: false, attempts: 0, verified: false },
      payment: null
    },
    isLoading: false,
    error: null,
    setStep: jest.fn(),
    nextStep: jest.fn(),
    updateClinicData: jest.fn(),
    updateVerificationData: jest.fn(),
    updatePaymentData: jest.fn(),
    clearError: jest.fn(),
    resetRegistration: jest.fn()
  };

  const mockRegistrationHook = {
    sendVerificationEmail: jest.fn(),
    verifyCode: jest.fn(),
    loading: false,
    error: null,
    clearError: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRegistrationStore as jest.Mock).mockReturnValue(mockStore);
    (useRegistration as jest.Mock).mockReturnValue(mockRegistrationHook);
  });

  describe('User Journey Through Registration Flow', () => {
    it('should allow user to complete full registration journey', async () => {
      // Setup successful API responses
      mockRegistrationHook.sendVerificationEmail.mockResolvedValue({
        success: true,
        message: 'Verification email sent'
      });

      mockRegistrationHook.verifyCode.mockResolvedValue({
        success: true,
        message: 'Code verified'
      });

      render(<RegisterFlow />);

      // Step 1: User fills clinic information
      await userFillsClinicForm();

      // Step 2: User receives and enters verification code
      await userCompletesEmailVerification();

      // Step 3: User reviews registration summary
      await userReviewsRegistrationSummary();

      // Step 4: User completes payment
      await userCompletesPayment();

      // Verify user sees success message
      expect(screen.getByText('Registrasi Berhasil!')).toBeInTheDocument();
      expect(screen.getByText('Selamat datang di Terapintar!')).toBeInTheDocument();
    });

    it('should provide clear feedback at each step', async () => {
      render(<RegisterFlow />);

      // Check initial step feedback
      expect(screen.getByText('Langkah 1 dari 5')).toBeInTheDocument();
      expect(screen.getByText('20%')).toBeInTheDocument();
      expect(screen.getByText('Informasi Klinik')).toBeInTheDocument();

      // Move to verification step
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);

      expect(screen.getByText('Langkah 2 dari 5')).toBeInTheDocument();
      expect(screen.getByText('40%')).toBeInTheDocument();
      expect(screen.getByText('Verifikasi Email')).toBeInTheDocument();
    });

    it('should allow user to navigate back and edit information', async () => {
      render(<RegisterFlow />);

      // User fills clinic form
      const nameInput = screen.getByLabelText('Nama Klinik');
      fireEvent.change(nameInput, { target: { value: 'Test Clinic' } });

      // User proceeds to next step
      mockStore.nextStep.mockImplementation(() => {
        mockStore.currentStep = 'verification';
      });

      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      // User decides to go back and edit
      mockStore.setStep.mockImplementation(() => {
        mockStore.currentStep = 'clinic';
      });

      fireEvent.click(screen.getByText('Edit Information'));

      await waitFor(() => {
        expect(mockStore.currentStep).toBe('clinic');
      });

      // Verify user can see their previous input
      expect(nameInput).toHaveValue('Test Clinic');
    });
  });

  describe('Form Completion and Validation', () => {
    it('should guide user through required fields', async () => {
      render(<RegisterFlow />);

      // User tries to submit empty form
      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      // User sees validation errors
      await waitFor(() => {
        expect(screen.getByText('Nama klinik minimal 3 karakter')).toBeInTheDocument();
        expect(screen.getByText('Email wajib diisi')).toBeInTheDocument();
        expect(screen.getByText('Nomor telepon wajib diisi')).toBeInTheDocument();
      });

      // User fills required fields
      const nameInput = screen.getByLabelText('Nama Klinik');
      const emailInput = screen.getByLabelText('Email Admin');
      const phoneInput = screen.getByLabelText('Nomor Telepon Admin');

      fireEvent.change(nameInput, { target: { value: 'Test Clinic' } });
      fireEvent.change(emailInput, { target: { value: 'admin@clinic.com' } });
      fireEvent.change(phoneInput, { target: { value: '+62-812-3456-7890' } });

      // User submits again
      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      // Validation errors should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Nama klinik minimal 3 karakter')).not.toBeInTheDocument();
        expect(screen.queryByText('Email wajib diisi')).not.toBeInTheDocument();
        expect(screen.queryByText('Nomor telepon wajib diisi')).not.toBeInTheDocument();
      });
    });

    it('should provide real-time validation feedback', async () => {
      render(<RegisterFlow />);

      const emailInput = screen.getByLabelText('Email Admin');

      // User enters invalid email
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
      });

      // User enters valid email
      fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.queryByText('Format email tidak valid')).not.toBeInTheDocument();
      });
    });

    it('should show clear error messages', async () => {
      render(<RegisterFlow />);

      // User enters invalid data
      const nameInput = screen.getByLabelText('Nama Klinik');
      fireEvent.change(nameInput, { target: { value: 'ab' } }); // Too short
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(screen.getByText('Nama klinik minimal 3 karakter')).toBeInTheDocument();
      });

      // Error message should be clear and actionable
      const errorMessage = screen.getByText('Nama klinik minimal 3 karakter');
      expect(errorMessage).toHaveClass('text-red-600');
    });
  });

  describe('Error Scenarios and Recovery', () => {
    it('should handle network interruption gracefully', async () => {
      // Simulate network error
      mockRegistrationHook.sendVerificationEmail.mockRejectedValue(
        new Error('Network error')
      );

      render(<RegisterFlow />);

      // User fills form and submits
      await userFillsClinicForm();

      // User sees network error message
      await waitFor(() => {
        expect(screen.getByText('Terjadi kesalahan jaringan')).toBeInTheDocument();
        expect(screen.getByText('Silakan periksa koneksi internet Anda dan coba lagi')).toBeInTheDocument();
      });

      // User can retry
      const retryButton = screen.getByText('Coba Lagi');
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).not.toBeDisabled();
    });

    it('should handle form validation errors clearly', async () => {
      render(<RegisterFlow />);

      // User submits incomplete form
      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      // User sees all validation errors
      await waitFor(() => {
        expect(screen.getByText('Nama klinik minimal 3 karakter')).toBeInTheDocument();
        expect(screen.getByText('Email wajib diisi')).toBeInTheDocument();
        expect(screen.getByText('Nomor telepon wajib diisi')).toBeInTheDocument();
      });

      // User can easily identify which fields need attention
      const nameInput = screen.getByLabelText('Nama Klinik');
      const emailInput = screen.getByLabelText('Email Admin');
      const phoneInput = screen.getByLabelText('Nomor Telepon Admin');

      expect(nameInput).toHaveClass('border-red-500');
      expect(emailInput).toHaveClass('border-red-500');
      expect(phoneInput).toHaveClass('border-red-500');
    });

    it('should handle payment failure scenarios', async () => {
      // Simulate payment failure
      mockStore.currentStep = 'payment';
      mockStore.error = 'Pembayaran gagal';

      render(<RegisterFlow />);

      // User sees payment failure message
      expect(screen.getByText('Pembayaran gagal')).toBeInTheDocument();

      // User can retry payment
      const retryButton = screen.getByText('Coba Lagi');
      expect(retryButton).toBeInTheDocument();

      // User can choose different payment method
      const changeMethodButton = screen.getByText('Ganti Metode Pembayaran');
      expect(changeMethodButton).toBeInTheDocument();
    });

    it('should handle email verification failures', async () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);

      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');

      // User enters invalid code
      fireEvent.change(codeInput, { target: { value: '000000' } });
      fireEvent.click(screen.getByText('Verifikasi Kode'));

      // User sees clear error message
      await waitFor(() => {
        expect(screen.getByText('Kode verifikasi tidak valid')).toBeInTheDocument();
        expect(screen.getByText('Percobaan 1 dari 3')).toBeInTheDocument();
      });

      // User can resend code
      const resendButton = screen.getByText('Kirim Ulang Kode');
      expect(resendButton).toBeInTheDocument();
    });

    it('should handle session timeout gracefully', async () => {
      // Simulate session timeout
      mockRegistrationHook.sendVerificationEmail.mockRejectedValue(
        new Error('Session expired')
      );

      render(<RegisterFlow />);

      // User tries to submit form
      await userFillsClinicForm();

      // User sees session timeout message
      await waitFor(() => {
        expect(screen.getByText('Sesi Anda telah berakhir')).toBeInTheDocument();
        expect(screen.getByText('Silakan login ulang untuk melanjutkan')).toBeInTheDocument();
      });

      // User can recover session
      const loginButton = screen.getByText('Login Ulang');
      expect(loginButton).toBeInTheDocument();
    });
  });

  describe('Payment Success/Failure Flows', () => {
    it('should handle successful payment completion', async () => {
      mockStore.currentStep = 'payment';
      render(<RegisterFlow />);

      // User completes payment
      fireEvent.click(screen.getByText('Complete Payment'));

      // User sees success message
      await waitFor(() => {
        expect(screen.getByText('Pembayaran Berhasil!')).toBeInTheDocument();
        expect(screen.getByText('Terima kasih telah mendaftar')).toBeInTheDocument();
      });

      // User can proceed to dashboard
      const dashboardButton = screen.getByText('Masuk ke Dashboard');
      expect(dashboardButton).toBeInTheDocument();
    });

    it('should handle payment cancellation', async () => {
      mockStore.currentStep = 'payment';
      render(<RegisterFlow />);

      // User cancels payment
      fireEvent.click(screen.getByText('Batal'));

      // User returns to summary step
      await waitFor(() => {
        expect(mockStore.setStep).toHaveBeenCalledWith('summary');
      });

      // User can try payment again
      const retryButton = screen.getByText('Coba Lagi');
      expect(retryButton).toBeInTheDocument();
    });

    it('should handle payment timeout scenarios', async () => {
      mockStore.currentStep = 'payment';
      mockStore.error = 'Pembayaran timeout';

      render(<RegisterFlow />);

      // User sees timeout message
      expect(screen.getByText('Pembayaran timeout')).toBeInTheDocument();
      expect(screen.getByText('Sesi pembayaran telah berakhir')).toBeInTheDocument();

      // User can retry payment
      const retryButton = screen.getByText('Coba Lagi');
      expect(retryButton).toBeInTheDocument();
    });

    it('should provide payment retry functionality', async () => {
      mockStore.currentStep = 'payment';
      mockStore.error = 'Pembayaran gagal';

      render(<RegisterFlow />);

      // User sees retry options
      expect(screen.getByText('Coba Lagi')).toBeInTheDocument();
      expect(screen.getByText('Ganti Metode Pembayaran')).toBeInTheDocument();

      // User can choose to retry
      fireEvent.click(screen.getByText('Coba Lagi'));

      await waitFor(() => {
        expect(mockStore.clearError).toHaveBeenCalled();
      });
    });
  });

  describe('Email Verification Scenarios', () => {
    it('should handle successful email verification', async () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);

      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');

      // User enters correct code
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(screen.getByText('Verifikasi Kode'));

      // User sees success message
      await waitFor(() => {
        expect(screen.getByText('✓ Kode terverifikasi')).toBeInTheDocument();
      });

      // User proceeds to next step
      await waitFor(() => {
        expect(mockStore.nextStep).toHaveBeenCalled();
      });
    });

    it('should handle invalid code entry', async () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);

      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');

      // User enters invalid code
      fireEvent.change(codeInput, { target: { value: '000000' } });
      fireEvent.click(screen.getByText('Verifikasi Kode'));

      // User sees error message
      await waitFor(() => {
        expect(screen.getByText('Kode verifikasi tidak valid')).toBeInTheDocument();
        expect(screen.getByText('Percobaan 1 dari 3')).toBeInTheDocument();
      });

      // User can try again
      expect(codeInput).toHaveValue('000000');
      expect(screen.getByText('Verifikasi Kode')).not.toBeDisabled();
    });

    it('should handle code expiration', async () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);

      // User sees expiration message
      expect(screen.getByText('Kode verifikasi telah kedaluwarsa')).toBeInTheDocument();

      // User can request new code
      const resendButton = screen.getByText('Kirim Ulang Kode');
      expect(resendButton).toBeInTheDocument();
      expect(resendButton).not.toBeDisabled();
    });

    it('should handle resend functionality', async () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);

      const resendButton = screen.getByText('Kirim Ulang Kode');

      // User clicks resend
      fireEvent.click(resendButton);

      // User sees countdown timer
      await waitFor(() => {
        expect(screen.getByText('60')).toBeInTheDocument();
      });

      // Button is disabled during countdown
      expect(resendButton).toBeDisabled();

      // User sees success message
      await waitFor(() => {
        expect(screen.getByText('Kode baru telah dikirim')).toBeInTheDocument();
      });
    });

    it('should handle rate limiting scenarios', async () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);

      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');

      // User makes multiple failed attempts
      for (let i = 0; i < 3; i++) {
        fireEvent.change(codeInput, { target: { value: '000000' } });
        fireEvent.click(verifyButton);
        await waitFor(() => {
          expect(screen.getByText(`Percobaan ${i + 1} dari 3`)).toBeInTheDocument();
        });
      }

      // User is blocked after max attempts
      expect(verifyButton).toBeDisabled();
      expect(screen.getByText('Terlalu banyak percobaan. Silakan kirim ulang kode.')).toBeInTheDocument();

      // User can request new code to reset attempts
      const resendButton = screen.getByText('Kirim Ulang Kode');
      expect(resendButton).toBeInTheDocument();
    });
  });

  // Helper functions for user scenarios
  async function userFillsClinicForm() {
    const nameInput = screen.getByLabelText('Nama Klinik');
    const emailInput = screen.getByLabelText('Email Admin');
    const phoneInput = screen.getByLabelText('Nomor Telepon Admin');

    fireEvent.change(nameInput, { target: { value: 'Test Clinic' } });
    fireEvent.change(emailInput, { target: { value: 'admin@clinic.com' } });
    fireEvent.change(phoneInput, { target: { value: '+62-812-3456-7890' } });

    fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

    await waitFor(() => {
      expect(mockStore.nextStep).toHaveBeenCalled();
    });
  }

  async function userCompletesEmailVerification() {
    const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Verifikasi Kode'));

    await waitFor(() => {
      expect(mockStore.nextStep).toHaveBeenCalled();
    });
  }

  async function userReviewsRegistrationSummary() {
    fireEvent.click(screen.getByText('Proceed to Payment'));

    await waitFor(() => {
      expect(mockStore.nextStep).toHaveBeenCalled();
    });
  }

  async function userCompletesPayment() {
    fireEvent.click(screen.getByText('Complete Payment'));

    await waitFor(() => {
      expect(mockStore.nextStep).toHaveBeenCalled();
    });
  }
});
