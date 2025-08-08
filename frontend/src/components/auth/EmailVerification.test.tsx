import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { EmailVerification } from './EmailVerification';

// Mock the useRegistration hook
jest.mock('@/hooks/useRegistration', () => ({
  useRegistration: () => ({
    verifyCode: jest.fn(),
    loading: false,
    error: null,
    clearError: jest.fn()
  })
}));

describe('EmailVerification', () => {
  const defaultProps = {
    email: 'test@example.com',
    onVerificationSuccess: jest.fn(),
    onResendEmail: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial Rendering', () => {
    it('should render email verification form', () => {
      render(<EmailVerification {...defaultProps} />);
      expect(screen.getByText('Verifikasi Email')).toBeInTheDocument();
    });

    it('should display masked email address', () => {
      render(<EmailVerification {...defaultProps} />);
      expect(screen.getByText('test***@example.com')).toBeInTheDocument();
    });

    it('should render verification code input', () => {
      render(<EmailVerification {...defaultProps} />);
      expect(screen.getByPlaceholderText('Masukkan kode 6 digit')).toBeInTheDocument();
    });

    it('should render verify button', () => {
      render(<EmailVerification {...defaultProps} />);
      expect(screen.getByText('Verifikasi Kode')).toBeInTheDocument();
    });

    it('should render resend button', () => {
      render(<EmailVerification {...defaultProps} />);
      expect(screen.getByText('Kirim Ulang Kode')).toBeInTheDocument();
    });
  });

  describe('Code Input Validation', () => {
    it('should accept only numeric input', () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      
      fireEvent.change(codeInput, { target: { value: '123456' } });
      expect(codeInput).toHaveValue('123456');
    });

    it('should limit input to 6 digits', () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      
      fireEvent.change(codeInput, { target: { value: '123456789' } });
      expect(codeInput).toHaveValue('123456');
    });

    it('should reject non-numeric input', () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      
      fireEvent.change(codeInput, { target: { value: 'abc123' } });
      expect(codeInput).toHaveValue('123');
    });

    it('should auto-focus on code input', () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      expect(codeInput).toHaveFocus();
    });
  });

  describe('Verification Process', () => {
    it('should call onVerificationSuccess when valid code is entered', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');
      
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(verifyButton);
      
      await waitFor(() => {
        expect(defaultProps.onVerificationSuccess).toHaveBeenCalled();
      });
    });

    it('should show loading state during verification', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');
      
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(verifyButton);
      
      expect(screen.getByText('Memverifikasi...')).toBeInTheDocument();
    });

    it('should show error for invalid code', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');
      
      fireEvent.change(codeInput, { target: { value: '000000' } });
      fireEvent.click(verifyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Kode verifikasi tidak valid')).toBeInTheDocument();
      });
    });

    it('should clear error when new code is entered', () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      
      // First, trigger an error
      fireEvent.change(codeInput, { target: { value: '000000' } });
      fireEvent.click(screen.getByText('Verifikasi Kode'));
      
      // Then enter a new code
      fireEvent.change(codeInput, { target: { value: '123456' } });
      
      expect(screen.queryByText('Kode verifikasi tidak valid')).not.toBeInTheDocument();
    });
  });

  describe('Resend Functionality', () => {
    it('should call onResendEmail when resend button is clicked', async () => {
      render(<EmailVerification {...defaultProps} />);
      const resendButton = screen.getByText('Kirim Ulang Kode');
      
      fireEvent.click(resendButton);
      
      await waitFor(() => {
        expect(defaultProps.onResendEmail).toHaveBeenCalled();
      });
    });

    it('should show countdown timer after resend', async () => {
      render(<EmailVerification {...defaultProps} />);
      const resendButton = screen.getByText('Kirim Ulang Kode');
      
      fireEvent.click(resendButton);
      
      await waitFor(() => {
        expect(screen.getByText('60')).toBeInTheDocument();
      });
    });

    it('should disable resend button during countdown', async () => {
      render(<EmailVerification {...defaultProps} />);
      const resendButton = screen.getByText('Kirim Ulang Kode');
      
      fireEvent.click(resendButton);
      
      await waitFor(() => {
        expect(resendButton).toBeDisabled();
      });
    });

    it('should enable resend button after countdown completes', async () => {
      render(<EmailVerification {...defaultProps} />);
      const resendButton = screen.getByText('Kirim Ulang Kode');
      
      fireEvent.click(resendButton);
      
      // Fast-forward time to complete countdown
      act(() => {
        jest.advanceTimersByTime(60000);
      });
      
      await waitFor(() => {
        expect(resendButton).not.toBeDisabled();
      });
    });

    it('should show loading state during resend', async () => {
      render(<EmailVerification {...defaultProps} />);
      const resendButton = screen.getByText('Kirim Ulang Kode');
      
      fireEvent.click(resendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Mengirim...')).toBeInTheDocument();
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should track verification attempts', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');
      
      // First attempt
      fireEvent.change(codeInput, { target: { value: '000000' } });
      fireEvent.click(verifyButton);
      
      // Second attempt
      fireEvent.change(codeInput, { target: { value: '111111' } });
      fireEvent.click(verifyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Percobaan 2 dari 3')).toBeInTheDocument();
      });
    });

    it('should show remaining attempts', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');
      
      fireEvent.change(codeInput, { target: { value: '000000' } });
      fireEvent.click(verifyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Percobaan 1 dari 3')).toBeInTheDocument();
      });
    });

    it('should disable verification after max attempts', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');
      
      // Make 3 failed attempts
      for (let i = 0; i < 3; i++) {
        fireEvent.change(codeInput, { target: { value: '000000' } });
        fireEvent.click(verifyButton);
        await waitFor(() => {
          expect(screen.getByText(`Percobaan ${i + 1} dari 3`)).toBeInTheDocument();
        });
      }
      
      expect(verifyButton).toBeDisabled();
      expect(screen.getByText('Terlalu banyak percobaan. Silakan kirim ulang kode.')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display network error message', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');
      
      // Simulate network error
      fireEvent.change(codeInput, { target: { value: '999999' } });
      fireEvent.click(verifyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Terjadi kesalahan jaringan')).toBeInTheDocument();
      });
    });

    it('should display timeout error message', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');
      
      // Simulate timeout error
      fireEvent.change(codeInput, { target: { value: '888888' } });
      fireEvent.click(verifyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Verifikasi timeout. Silakan coba lagi.')).toBeInTheDocument();
      });
    });

    it('should clear error when input changes', () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      
      // Trigger error
      fireEvent.change(codeInput, { target: { value: '000000' } });
      fireEvent.click(screen.getByText('Verifikasi Kode'));
      
      // Change input to clear error
      fireEvent.change(codeInput, { target: { value: '123456' } });
      
      expect(screen.queryByText('Kode verifikasi tidak valid')).not.toBeInTheDocument();
    });
  });

  describe('Success States', () => {
    it('should show success message when verification succeeds', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');
      
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(verifyButton);
      
      await waitFor(() => {
        expect(screen.getByText('✓ Kode terverifikasi')).toBeInTheDocument();
      });
    });

    it('should call onVerificationSuccess after successful verification', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      const verifyButton = screen.getByText('Verifikasi Kode');
      
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(verifyButton);
      
      await waitFor(() => {
        expect(defaultProps.onVerificationSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      expect(codeInput).toHaveAttribute('aria-label', 'Kode verifikasi');
    });

    it('should have proper form labels', () => {
      render(<EmailVerification {...defaultProps} />);
      expect(screen.getByText('Kode Verifikasi')).toBeInTheDocument();
    });

    it('should have proper button types', () => {
      render(<EmailVerification {...defaultProps} />);
      const verifyButton = screen.getByText('Verifikasi Kode');
      const resendButton = screen.getByText('Kirim Ulang Kode');
      
      expect(verifyButton).toHaveAttribute('type', 'button');
      expect(resendButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Email Masking', () => {
    it('should mask email address correctly', () => {
      render(<EmailVerification {...defaultProps} />);
      expect(screen.getByText('test***@example.com')).toBeInTheDocument();
    });

    it('should handle short email addresses', () => {
      render(<EmailVerification email="a@b.com" onVerificationSuccess={jest.fn()} onResendEmail={jest.fn()} />);
      expect(screen.getByText('a***@b.com')).toBeInTheDocument();
    });

    it('should handle long email addresses', () => {
      render(<EmailVerification email="verylongemailaddress@example.com" onVerificationSuccess={jest.fn()} onResendEmail={jest.fn()} />);
      expect(screen.getByText('verylongemailaddress***@example.com')).toBeInTheDocument();
    });
  });

  describe('Component State Management', () => {
    it('should maintain code input state', () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      
      fireEvent.change(codeInput, { target: { value: '123' } });
      expect(codeInput).toHaveValue('123');
      
      fireEvent.change(codeInput, { target: { value: '123456' } });
      expect(codeInput).toHaveValue('123456');
    });

    it('should clear code input after successful verification', async () => {
      render(<EmailVerification {...defaultProps} />);
      const codeInput = screen.getByPlaceholderText('Masukkan kode 6 digit');
      
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(screen.getByText('Verifikasi Kode'));
      
      await waitFor(() => {
        expect(codeInput).toHaveValue('');
      });
    });
  });
});
