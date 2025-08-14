'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowPathIcon, 
  CheckIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface EmailVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onResendEmail: () => Promise<void>;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerificationSuccess,
  onResendEmail
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only allow digits, max 6
    setCode(value);
    setError(''); // Clear error when user types

    // Auto-submit when 6 digits are entered
    if (value.length === 6) {
      handleVerifyCode(value);
    }
  };

  const handleVerifyCode = async (verificationCode: string = code) => {
    if (verificationCode.length !== 6) {
      setError('Kode verifikasi harus 6 digit');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock API call - in real implementation, this would call the verification API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - code '123456' is considered valid
      const isValid = verificationCode === '123456';
      
      if (isValid) {
        onVerificationSuccess();
      } else {
        setError('Kode verifikasi tidak valid. Silakan coba lagi.');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat verifikasi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError('');

    try {
      await onResendEmail();
      setCountdown(60); // Start 60-second countdown
    } catch (error) {
      setError('Gagal mengirim ulang email. Silakan coba lagi.');
    } finally {
      setIsResending(false);
    }
  };

  const formatEmail = (email: string) => {
    const [username, domain] = email.split('@');
    if (username.length > 3) {
      return `${username.slice(0, 3)}***@${domain}`;
    }
    return email;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Verifikasi Email
        </h3>
        <p className="text-gray-600 mb-4">
          Kami telah mengirim kode verifikasi 6 digit ke:
        </p>
        <p className="font-medium text-gray-900 mb-6">
          {formatEmail(email)}
        </p>
      </div>

      {/* Verification Code Input */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="verification-code" className="text-sm font-medium text-gray-700">
                Masukkan Kode Verifikasi
              </Label>
              <Input
                ref={inputRef}
                id="verification-code"
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="123456"
                maxLength={6}
                className={`text-center text-lg font-mono tracking-widest ${
                  error ? 'border-red-500 focus:border-red-500' : ''
                }`}
                disabled={loading}
                aria-describedby={error ? 'verification-error' : undefined}
              />
              {error && (
                <div id="verification-error" className="flex items-center mt-2 text-sm text-red-600">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}
            </div>

            {/* Verification Button */}
            <Button
              onClick={() => handleVerifyCode()}
              disabled={code.length !== 6 || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Verifikasi Kode
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resend Email Section */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">
          Tidak menerima email?
        </p>
        <Button
          onClick={handleResendEmail}
          disabled={countdown > 0 || isResending}
          variant="outline"
          size="sm"
        >
          {isResending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
              Mengirim...
            </>
          ) : countdown > 0 ? (
            <>
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Kirim Ulang ({countdown}s)
            </>
          ) : (
            <>
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Kirim Ulang Email
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Periksa folder spam/junk jika tidak menemukan email</li>
          <li>• Pastikan alamat email yang dimasukkan sudah benar</li>
          <li>• Kode verifikasi berlaku selama 10 menit</li>
          <li>• Anda dapat meminta kode baru setiap 60 detik</li>
        </ul>
      </div>
    </div>
  );
};
