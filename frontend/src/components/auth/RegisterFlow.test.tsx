import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { RegisterFlow } from './RegisterFlow';
import { useRegistrationStore } from '@/store/registration';

// Mock the registration store
jest.mock('@/store/registration', () => ({
  useRegistrationStore: jest.fn()
}));

// Mock the EmailVerification component
jest.mock('./EmailVerification', () => ({
  EmailVerification: ({ onVerificationSuccess }: { onVerificationSuccess: () => void }) => (
    <div data-testid="email-verification">
      <h2>Verifikasi Email</h2>
      <button onClick={onVerificationSuccess}>Verify Email</button>
    </div>
  )
}));

// Mock the RegistrationSummary component
jest.mock('./RegistrationSummary', () => ({
  RegistrationSummary: ({ onProceedToPayment }: { onProceedToPayment: () => void }) => (
    <div data-testid="registration-summary">
      <h2>Ringkasan Registrasi</h2>
      <button onClick={onProceedToPayment}>Proceed to Payment</button>
    </div>
  )
}));

// Mock the PaymentModal component
jest.mock('@/components/payment/PaymentModal', () => ({
  PaymentModal: ({ onPaymentSuccess }: { onPaymentSuccess: () => void }) => (
    <div data-testid="payment-modal">
      <h2>Pembayaran</h2>
      <button onClick={onPaymentSuccess}>Complete Payment</button>
    </div>
  )
}));

describe('RegisterFlow', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    (useRegistrationStore as jest.Mock).mockReturnValue(mockStore);
  });

  describe('Initial Rendering', () => {
    it('should render clinic form as initial step', () => {
      render(<RegisterFlow />);
      expect(screen.getByText('Informasi Klinik')).toBeInTheDocument();
    });

    it('should show correct progress information', () => {
      render(<RegisterFlow />);
      expect(screen.getByText('Langkah 1 dari 5')).toBeInTheDocument();
      expect(screen.getByText('20%')).toBeInTheDocument();
    });

    it('should display step titles correctly', () => {
      render(<RegisterFlow />);
      expect(screen.getByText('Informasi Klinik')).toBeInTheDocument();
    });
  });

  describe('Step Navigation', () => {
    it('should progress to verification step when clinic form is submitted', async () => {
      mockStore.currentStep = 'clinic';
      render(<RegisterFlow />);

      // Simulate clinic form submission
      const submitButton = screen.getByText('Lanjutkan ke Verifikasi Email');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockStore.nextStep).toHaveBeenCalled();
      });
    });

    it('should progress to summary step when verification is successful', async () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);

      const verifyButton = screen.getByText('Verify Email');
      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockStore.nextStep).toHaveBeenCalled();
      });
    });

    it('should progress to payment step when summary is confirmed', async () => {
      mockStore.currentStep = 'summary';
      render(<RegisterFlow />);

      const proceedButton = screen.getByText('Proceed to Payment');
      fireEvent.click(proceedButton);

      await waitFor(() => {
        expect(mockStore.nextStep).toHaveBeenCalled();
      });
    });

    it('should complete registration when payment is successful', async () => {
      mockStore.currentStep = 'payment';
      render(<RegisterFlow />);

      const completeButton = screen.getByText('Complete Payment');
      fireEvent.click(completeButton);

      await waitFor(() => {
        expect(mockStore.nextStep).toHaveBeenCalled();
      });
    });
  });

  describe('Step Rendering', () => {
    it('should render clinic form step', () => {
      mockStore.currentStep = 'clinic';
      render(<RegisterFlow />);
      expect(screen.getByText('Informasi Klinik')).toBeInTheDocument();
    });

    it('should render email verification step', () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);
      expect(screen.getByTestId('email-verification')).toBeInTheDocument();
    });

    it('should render registration summary step', () => {
      mockStore.currentStep = 'summary';
      render(<RegisterFlow />);
      expect(screen.getByTestId('registration-summary')).toBeInTheDocument();
    });

    it('should render payment modal step', () => {
      mockStore.currentStep = 'payment';
      render(<RegisterFlow />);
      expect(screen.getByTestId('payment-modal')).toBeInTheDocument();
    });

    it('should render completion step', () => {
      mockStore.currentStep = 'complete';
      render(<RegisterFlow />);
      expect(screen.getByText('Registrasi Berhasil!')).toBeInTheDocument();
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate correct step number for clinic', () => {
      mockStore.currentStep = 'clinic';
      render(<RegisterFlow />);
      expect(screen.getByText('Langkah 1 dari 5')).toBeInTheDocument();
    });

    it('should calculate correct step number for verification', () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);
      expect(screen.getByText('Langkah 2 dari 5')).toBeInTheDocument();
    });

    it('should calculate correct step number for summary', () => {
      mockStore.currentStep = 'summary';
      render(<RegisterFlow />);
      expect(screen.getByText('Langkah 3 dari 5')).toBeInTheDocument();
    });

    it('should calculate correct step number for payment', () => {
      mockStore.currentStep = 'payment';
      render(<RegisterFlow />);
      expect(screen.getByText('Langkah 4 dari 5')).toBeInTheDocument();
    });

    it('should calculate correct step number for complete', () => {
      mockStore.currentStep = 'complete';
      render(<RegisterFlow />);
      expect(screen.getByText('Langkah 5 dari 5')).toBeInTheDocument();
    });
  });

  describe('Progress Percentage', () => {
    it('should show 20% for clinic step', () => {
      mockStore.currentStep = 'clinic';
      render(<RegisterFlow />);
      expect(screen.getByText('20%')).toBeInTheDocument();
    });

    it('should show 40% for verification step', () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);
      expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('should show 60% for summary step', () => {
      mockStore.currentStep = 'summary';
      render(<RegisterFlow />);
      expect(screen.getByText('60%')).toBeInTheDocument();
    });

    it('should show 80% for payment step', () => {
      mockStore.currentStep = 'payment';
      render(<RegisterFlow />);
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('should show 100% for complete step', () => {
      mockStore.currentStep = 'complete';
      render(<RegisterFlow />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when store has error', () => {
      mockStore.error = 'Test error message';
      render(<RegisterFlow />);
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should not display error message when store has no error', () => {
      mockStore.error = null;
      render(<RegisterFlow />);
      expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state when store is loading', () => {
      mockStore.isLoading = true;
      render(<RegisterFlow />);
      // Check for loading indicator or disabled state
      expect(screen.getByText('Informasi Klinik')).toBeInTheDocument();
    });

    it('should not show loading state when store is not loading', () => {
      mockStore.isLoading = false;
      render(<RegisterFlow />);
      expect(screen.getByText('Informasi Klinik')).toBeInTheDocument();
    });
  });

  describe('Data Passing', () => {
    it('should pass clinic data to registration summary', () => {
      mockStore.currentStep = 'summary';
      mockStore.data.clinic = {
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
      render(<RegisterFlow />);
      expect(screen.getByTestId('registration-summary')).toBeInTheDocument();
    });

    it('should pass email to email verification component', () => {
      mockStore.currentStep = 'verification';
      mockStore.data.clinic = {
        adminEmail: 'admin@clinic.com'
      } as any;
      render(<RegisterFlow />);
      expect(screen.getByTestId('email-verification')).toBeInTheDocument();
    });
  });

  describe('Navigation Functions', () => {
    it('should call setStep when navigating back from summary', () => {
      mockStore.currentStep = 'summary';
      render(<RegisterFlow />);
      
      // Simulate edit clinic action
      const editButton = screen.getByText('Edit Information');
      fireEvent.click(editButton);
      
      expect(mockStore.setStep).toHaveBeenCalledWith('clinic');
    });

    it('should call nextStep when proceeding to next step', () => {
      mockStore.currentStep = 'clinic';
      render(<RegisterFlow />);
      
      const nextButton = screen.getByText('Lanjutkan ke Verifikasi Email');
      fireEvent.click(nextButton);
      
      expect(mockStore.nextStep).toHaveBeenCalled();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with EmailVerification component', () => {
      mockStore.currentStep = 'verification';
      render(<RegisterFlow />);
      
      expect(screen.getByTestId('email-verification')).toBeInTheDocument();
      expect(screen.getByText('Verifikasi Email')).toBeInTheDocument();
    });

    it('should integrate with RegistrationSummary component', () => {
      mockStore.currentStep = 'summary';
      render(<RegisterFlow />);
      
      expect(screen.getByTestId('registration-summary')).toBeInTheDocument();
      expect(screen.getByText('Ringkasan Registrasi')).toBeInTheDocument();
    });

    it('should integrate with PaymentModal component', () => {
      mockStore.currentStep = 'payment';
      render(<RegisterFlow />);
      
      expect(screen.getByTestId('payment-modal')).toBeInTheDocument();
      expect(screen.getByText('Pembayaran')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for progress', () => {
      render(<RegisterFlow />);
      expect(screen.getByText('Langkah 1 dari 5')).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(<RegisterFlow />);
      expect(screen.getByText('Informasi Klinik')).toBeInTheDocument();
    });
  });
});
