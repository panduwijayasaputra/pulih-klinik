'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useRegistrationStore } from '@/store/registration';
import { RegistrationStepEnum } from '@/types/enums';
import {
  ArrowPathIcon,
  CheckIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface EmailVerificationProps {
  email: string;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email
}) => {
  const { 
    markEmailAsVerified, 
    verifyEmail, 
    resendVerificationEmail, 
    isLoading, 
    error, 
    clearError 
  } = useRegistrationStore();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
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
    setLocalError(''); // Clear error when user types
    clearError(); // Clear store error
  };

  const handleVerifyCode = async (verificationCode: string = code) => {
    if (verificationCode.length !== 6) {
      setLocalError('Kode verifikasi harus 6 digit');
      return;
    }

    setLoading(true);
    setLocalError('');
    clearError();

    try {
      await verifyEmail(verificationCode);
      markEmailAsVerified(email);
    } catch (error: any) {
      setLocalError(error.message || 'Kode verifikasi tidak valid. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setLocalError('');
    clearError();

    try {
      await resendVerificationEmail();
      setCountdown(60); // Start 60-second countdown
    } catch (error: any) {
      setLocalError(error.message || 'Gagal mengirim ulang email. Silakan coba lagi.');
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (code.length === 6) {
      handleVerifyCode();
    }
  }, [code]);

  const displayError = localError || error;

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <EnvelopeIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verifikasi Email
        </h2>
        <p className="text-gray-600">
          Kami telah mengirim kode verifikasi 6 digit ke
        </p>
        <p className="font-medium text-gray-900">{email}</p>
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Clear registration store and go to email check step
              const { resetRegistration, setStep } = useRegistrationStore.getState();
              resetRegistration();
              setStep(RegistrationStepEnum.EmailCheck);
            }}
          >
            Ubah Email
          </Button>
        </div>
      </div>

      {displayError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <p className="text-red-600 text-sm">{displayError}</p>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Verification Code Input */}
            <div>
              <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                Kode Verifikasi
              </Label>
              <Input
                ref={inputRef}
                id="verificationCode"
                type="text"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Masukkan 6 digit kode"
                className="mt-1 text-center text-lg tracking-widest"
                maxLength={6}
                disabled={loading || isLoading}
              />
              <p className="mt-2 text-xs text-gray-500">
                Masukkan kode 6 digit yang dikirim ke email Anda
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={() => handleVerifyCode()}
              className="w-full"
              disabled={code.length !== 6 || loading || isLoading}
            >
              {(loading || isLoading) ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Memverifikasi...
                </div>
              ) : (
                'Verifikasi Email'
              )}
            </Button>

            {/* Resend Email */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Tidak menerima email?
              </p>
              <Button
                onClick={handleResendEmail}
                variant="outline"
                size="sm"
                disabled={countdown > 0 || isResending}
              >
                {isResending ? (
                  <div className="flex items-center">
                    <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                    Mengirim...
                  </div>
                ) : countdown > 0 ? (
                  `Kirim ulang dalam ${countdown}s`
                ) : (
                  'Kirim Ulang Kode'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Note */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Development Mode:</strong> Gunakan kode <code className="bg-yellow-100 px-1 rounded">123456</code> untuk verifikasi
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Kode verifikasi akan kadaluarsa dalam 10 menit
        </p>
      </div>
    </div>
  );
};
