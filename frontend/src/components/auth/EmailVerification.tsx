'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useRegistrationStore } from '@/store/registration';
import {
  ArrowPathIcon,
  CheckIcon,
  EnvelopeIcon,
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
  const { markEmailAsVerified } = useRegistrationStore();
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
    let interval: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const handleCodeChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 6); // Only allow digits, max 6
    setCode(cleanValue);
    setError(''); // Clear error when user types
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
        // Mark email as verified in the store
        markEmailAsVerified(email);
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
    if (username && username.length > 3) {
      return `${username.slice(0, 3)}***@${domain}`;
    }
    return email;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <EnvelopeIcon className="w-8 h-8 text-blue-600" />
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
          <div className="space-y-4 flex flex-col items-center justify-center">
            <div>
              <Label htmlFor="verification-code" className="text-sm font-medium text-gray-700 text-center mb-4 block">
                Masukkan Kode Verifikasi
              </Label>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <Input
                    key={idx}
                    ref={idx === 0 ? inputRef : undefined}
                    id={`verification-code-${idx}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={code[idx] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
                      const newCode = code.split('');
                      newCode[idx] = val;
                      // If user pastes or types more than one digit, fill next boxes
                      if (e.target.value.length > 1) {
                        const chars = e.target.value.replace(/[^0-9]/g, '').split('');
                        for (let i = 0; i < chars.length && idx + i < 6; i++) {
                          newCode[idx + i] = chars[i] || '';
                        }
                      }
                      
                      const finalCode = newCode.join('');
                      
                      // Call handleCodeChange with the new signature
                      handleCodeChange(finalCode);
                      
                      // Handle paste scenario - move to the next empty box or last box
                      if (e.target.value.length > 1) {
                        const chars = e.target.value.replace(/[^0-9]/g, '').split('');
                        const targetIdx = Math.min(idx + chars.length, 5);
                        const target = document.getElementById(`verification-code-${targetIdx}`) as HTMLInputElement;
                        if (target) target.focus();
                      }
                    }}
                    onFocus={(e) => {
                      // Select all text when focused so user can type without deleting
                      e.target.select();
                    }}
                    onClick={(e) => {
                      // Select all text when clicked so user can type without deleting
                      e.currentTarget.select();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !code[idx] && idx > 0) {
                        const prev = document.getElementById(`verification-code-${idx - 1}`) as HTMLInputElement;
                        if (prev) prev.focus();
                      }
                      // Move to next box when any digit is typed, even if it's the same value
                      else if (/^[0-9]$/.test(e.key) && idx < 5) {
                        // Use setTimeout to let the onChange handler complete first
                        setTimeout(() => {
                          const next = document.getElementById(`verification-code-${idx + 1}`) as HTMLInputElement;
                          if (next) next.focus();
                        }, 0);
                      }
                    }}
                    placeholder="•"
                    maxLength={1}
                    className={`w-12 h-12 text-center text-2xl font-mono tracking-widest border rounded-md ${error ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    disabled={loading}
                    aria-describedby={error ? 'verification-error' : undefined}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
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
              className="text-center"
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
