'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emailVerificationSchema, EmailVerificationFormData } from '@/schemas/authSchema';

interface EmailVerificationFormProps {
  email: string;
  onSubmit: (data: EmailVerificationFormData) => Promise<void>;
  onResendCode: () => Promise<void>;
  isLoading?: boolean;
  isResending?: boolean;
  error?: string | null;
  onClearError?: () => void;
  canResend?: boolean;
  resendCooldown?: number; // in seconds
}

export const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  email,
  onSubmit,
  onResendCode,
  isLoading = false,
  isResending = false,
  error,
  onClearError,
  canResend = true,
  resendCooldown = 60,
}) => {
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      email,
      code: '',
    },
  });

  // Handle resend cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleFormSubmit = async (data: EmailVerificationFormData) => {
    if (onClearError) {
      onClearError();
    }
    await onSubmit(data);
  };

  const handleResendCode = async () => {
    if (onClearError) {
      onClearError();
    }
    await onResendCode();
    setCooldown(resendCooldown);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verifikasi Email
        </h2>
        <p className="text-gray-600">
          Kami telah mengirim kode verifikasi ke:
        </p>
        <p className="text-sm font-medium text-blue-600 mt-1">
          {email}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Verification Code */}
        <div>
          <Label htmlFor="code" className="text-sm font-medium text-gray-700">
            Kode Verifikasi
          </Label>
          <Input
            id="code"
            type="text"
            {...register('code')}
            className={`mt-1 text-center text-lg tracking-widest ${errors.code ? 'border-red-500' : ''}`}
            placeholder="000000"
            maxLength={6}
            disabled={isLoading}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Memverifikasi...
            </div>
          ) : (
            'Verifikasi Email'
          )}
        </Button>
      </form>

      {/* Resend Code Section */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Tidak menerima kode?
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={handleResendCode}
          disabled={isResending || cooldown > 0 || !canResend}
          className="w-full"
        >
          {isResending ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
              Mengirim ulang...
            </div>
          ) : cooldown > 0 ? (
            `Kirim ulang dalam ${formatTime(cooldown)}`
          ) : (
            'Kirim Ulang Kode'
          )}
        </Button>
      </div>

      {/* Back to Registration */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Email salah?{' '}
          <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Kembali ke pendaftaran
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
