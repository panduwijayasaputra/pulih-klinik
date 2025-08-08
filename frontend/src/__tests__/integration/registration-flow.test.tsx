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

// Mock the payment hook
jest.mock('@/hooks/usePayment', () => ({
  usePayment: jest.fn()
}));

describe('Registration Flow Integration', () => {
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

  const mockPaymentHook = {
    createPayment: jest.fn(),
    checkPaymentStatus: jest.fn(),
    loading: false,
    error: null,
    clearError: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRegistrationStore as jest.Mock).mockReturnValue(mockStore);
    (useRegistration as jest.Mock).mockReturnValue(mockRegistrationHook);
  });

  describe('Complete Registration Flow', () => {
    it('should complete full registration flow successfully', async () => {
      // Setup successful API responses
      mockRegistrationHook.sendVerificationEmail.mockResolvedValue({
        success: true,
        message: 'Verification email sent'
      });

      mockRegistrationHook.verifyCode.mockResolvedValue({
        success: true,
        message: 'Code verified'
      });

      mockPaymentHook.createPayment.mockResolvedValue({
        success: true,
        order_id: 'REG-1234567890',
        redirect_url: 'https://payment-gateway.com'
      });

      render(<RegisterFlow />);

      // Step 1: Complete clinic form
      await completeClinicForm();

      // Step 2: Complete email verification
      await completeEmailVerification();

      // Step 3: Complete registration summary
      await completeRegistrationSummary();

      // Step 4: Complete payment
      await completePayment();

      // Verify completion
      expect(screen.getByText('Registrasi Berhasil!')).toBeInTheDocument();
    });

    it('should persist data across steps', async () => {
      render(<RegisterFlow />);

      // Fill clinic form
      const clinicData = {
        name: 'Test Clinic',
        province: 'DKI Jakarta',
        city: 'Jakarta Pusat',
        address: 'Jl. Test No. 123',
        phone: '021-1234567',
        email: 'test@clinic.com',
        adminName: 'Test Admin',
        adminEmail: 'admin@clinic.com',
        adminWhatsapp: '+62-812-3456-7890',
        adminPosition: 'Director'
      };

      // Simulate clinic form submission
      mockStore.updateClinicData.mockImplementation((data) => {
        mockStore.data.clinic = data;
        mockStore.currentStep = 'verification';
      });

      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      await waitFor(() => {
        expect(mockStore.updateClinicData).toHaveBeenCalledWith(expect.objectContaining(clinicData));
      });

      // Verify data persistence
      expect(mockStore.data.clinic).toEqual(expect.objectContaining(clinicData));
    });

    it('should handle step validation and progression', async () => {
      render(<RegisterFlow />);

      // Test step progression
      expect(mockStore.currentStep).toBe('clinic');

      // Move to verification step
      mockStore.nextStep.mockImplementation(() => {
        mockStore.currentStep = 'verification';
      });

      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      await waitFor(() => {
        expect(mockStore.currentStep).toBe('verification');
      });

      // Move to summary step
      mockStore.nextStep.mockImplementation(() => {
        mockStore.currentStep = 'summary';
      });

      fireEvent.click(screen.getByText('Verify Email'));

      await waitFor(() => {
        expect(mockStore.currentStep).toBe('summary');
      });
    });
  });

  describe('API Integration', () => {
    it('should integrate with registration API endpoints', async () => {
      mockRegistrationHook.sendVerificationEmail.mockResolvedValue({
        success: true,
        message: 'Verification email sent'
      });

      render(<RegisterFlow />);

      // Trigger email verification
      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      await waitFor(() => {
        expect(mockRegistrationHook.sendVerificationEmail).toHaveBeenCalledWith('admin@clinic.com');
      });
    });

    it('should integrate with email verification API calls', async () => {
      mockRegistrationHook.verifyCode.mockResolvedValue({
        success: true,
        message: 'Code verified'
      });

      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);

      // Trigger code verification
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(screen.getByText('Verifikasi Kode'));

      await waitFor(() => {
        expect(mockRegistrationHook.verifyCode).toHaveBeenCalledWith('123456', 'admin@clinic.com');
      });
    });

    it('should integrate with payment API', async () => {
      mockPaymentHook.createPayment.mockResolvedValue({
        success: true,
        order_id: 'REG-1234567890'
      });

      mockStore.currentStep = 'payment';
      render(<RegisterFlow />);

      // Trigger payment
      fireEvent.click(screen.getByText('Complete Payment'));

      await waitFor(() => {
        expect(mockPaymentHook.createPayment).toHaveBeenCalled();
      });
    });

    it('should handle API failures gracefully', async () => {
      mockRegistrationHook.sendVerificationEmail.mockRejectedValue(
        new Error('Network error')
      );

      render(<RegisterFlow />);

      // Trigger email verification
      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      await waitFor(() => {
        expect(screen.getByText('Terjadi kesalahan jaringan')).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery Scenarios', () => {
    it('should recover from network errors', async () => {
      // First attempt fails
      mockRegistrationHook.sendVerificationEmail.mockRejectedValueOnce(
        new Error('Network error')
      );

      // Second attempt succeeds
      mockRegistrationHook.sendVerificationEmail.mockResolvedValueOnce({
        success: true,
        message: 'Verification email sent'
      });

      render(<RegisterFlow />);

      // First attempt
      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      await waitFor(() => {
        expect(screen.getByText('Terjadi kesalahan jaringan')).toBeInTheDocument();
      });

      // Retry
      fireEvent.click(screen.getByText('Coba Lagi'));

      await waitFor(() => {
        expect(mockRegistrationHook.sendVerificationEmail).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle validation errors and allow correction', async () => {
      render(<RegisterFlow />);

      // Submit empty form
      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      await waitFor(() => {
        expect(screen.getByText('Nama klinik minimal 3 karakter')).toBeInTheDocument();
      });

      // Fill required fields
      const nameInput = screen.getByLabelText('Nama Klinik');
      fireEvent.change(nameInput, { target: { value: 'Test Clinic' } });

      // Submit again
      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      await waitFor(() => {
        expect(screen.queryByText('Nama klinik minimal 3 karakter')).not.toBeInTheDocument();
      });
    });

    it('should handle payment failures and allow retry', async () => {
      // First payment attempt fails
      mockPaymentHook.createPayment.mockRejectedValueOnce(
        new Error('Payment failed')
      );

      // Second attempt succeeds
      mockPaymentHook.createPayment.mockResolvedValueOnce({
        success: true,
        order_id: 'REG-1234567890'
      });

      mockStore.currentStep = 'payment';
      render(<RegisterFlow />);

      // First attempt
      fireEvent.click(screen.getByText('Complete Payment'));

      await waitFor(() => {
        expect(screen.getByText('Pembayaran gagal')).toBeInTheDocument();
      });

      // Retry
      fireEvent.click(screen.getByText('Coba Lagi'));

      await waitFor(() => {
        expect(mockPaymentHook.createPayment).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Data Persistence', () => {
    it('should preserve form data when navigating back', async () => {
      render(<RegisterFlow />);

      // Fill clinic form
      const nameInput = screen.getByLabelText('Nama Klinik');
      fireEvent.change(nameInput, { target: { value: 'Test Clinic' } });

      // Navigate to next step
      mockStore.nextStep.mockImplementation(() => {
        mockStore.currentStep = 'verification';
      });

      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      // Navigate back
      mockStore.setStep.mockImplementation(() => {
        mockStore.currentStep = 'clinic';
      });

      fireEvent.click(screen.getByText('Edit Information'));

      await waitFor(() => {
        expect(mockStore.currentStep).toBe('clinic');
      });

      // Verify data is preserved
      expect(nameInput).toHaveValue('Test Clinic');
    });

    it('should maintain verification state', async () => {
      mockStore.currentStep = 'verification';
      mockStore.data.verification = {
        code: '123456',
        emailSent: true,
        attempts: 1,
        verified: false
      };

      render(<RegisterFlow />);

      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      expect(codeInput).toHaveValue('123456');
    });
  });

  describe('Session Management', () => {
    it('should handle session timeout', async () => {
      // Simulate session timeout
      mockRegistrationHook.sendVerificationEmail.mockRejectedValue(
        new Error('Session expired')
      );

      render(<RegisterFlow />);

      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      await waitFor(() => {
        expect(screen.getByText('Sesi Anda telah berakhir')).toBeInTheDocument();
      });
    });

    it('should allow session recovery', async () => {
      // First attempt fails due to session timeout
      mockRegistrationHook.sendVerificationEmail.mockRejectedValueOnce(
        new Error('Session expired')
      );

      // Second attempt succeeds after session recovery
      mockRegistrationHook.sendVerificationEmail.mockResolvedValueOnce({
        success: true,
        message: 'Verification email sent'
      });

      render(<RegisterFlow />);

      // First attempt
      fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

      await waitFor(() => {
        expect(screen.getByText('Sesi Anda telah berakhir')).toBeInTheDocument();
      });

      // Recover session
      fireEvent.click(screen.getByText('Login Ulang'));

      await waitFor(() => {
        expect(mockStore.resetRegistration).toHaveBeenCalled();
      });
    });
  });

  // Helper functions for test scenarios
  async function completeClinicForm() {
    const nameInput = screen.getByLabelText('Nama Klinik');
    fireEvent.change(nameInput, { target: { value: 'Test Clinic' } });

    const emailInput = screen.getByLabelText('Email Admin');
    fireEvent.change(emailInput, { target: { value: 'admin@clinic.com' } });

    fireEvent.click(screen.getByText('Lanjutkan ke Verifikasi Email'));

    await waitFor(() => {
      expect(mockStore.nextStep).toHaveBeenCalled();
    });
  }

  async function completeEmailVerification() {
    const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Verifikasi Kode'));

    await waitFor(() => {
      expect(mockStore.nextStep).toHaveBeenCalled();
    });
  }

  async function completeRegistrationSummary() {
    fireEvent.click(screen.getByText('Proceed to Payment'));

    await waitFor(() => {
      expect(mockStore.nextStep).toHaveBeenCalled();
    });
  }

  async function completePayment() {
    fireEvent.click(screen.getByText('Complete Payment'));

    await waitFor(() => {
      expect(mockStore.nextStep).toHaveBeenCalled();
    });
  }
});
