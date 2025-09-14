'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useRegistrationStore } from '@/store/registration';
import { EmailStatus } from '@/types/registration';
import { z } from 'zod';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const emailCheckSchema = z.object({
  email: z.string().email('Masukkan alamat email yang valid'),
});

type EmailCheckFormData = z.infer<typeof emailCheckSchema>;

export const EmailCheck: React.FC = () => {
  const {
    checkEmailStatus,
    emailStatus,
    isLoading,
    error,
    clearError,
    clearEmailStatus,
    nextStep,
    updateUserData,
    data
  } = useRegistrationStore();

  const [isChecking, setIsChecking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<EmailCheckFormData>({
    resolver: zodResolver(emailCheckSchema),
    defaultValues: {
      email: data.user?.email || '',
    },
  });

  const email = watch('email');

  const onSubmit = async (formData: EmailCheckFormData) => {
    setIsChecking(true);
    clearError();

    try {
      const status = await checkEmailStatus(formData.email);

      // Update user data with email
      updateUserData({
        ...data.user,
        email: formData.email,
        name: data.user?.name || '',
        password: data.user?.password || '',
        confirmPassword: data.user?.confirmPassword || '',
      });

      // Status is now handled in the UI based on the emailStatus state
    } catch (error) {
      console.error('Email check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleTryAgain = () => {
    clearError();
  };

  const handleChangeEmail = () => {
    clearError();
    clearEmailStatus();
    // Reset the form to show email input with empty email field
    reset({ email: '' });
  };

  const getStatusIcon = () => {
    if (!emailStatus) return null;

    switch (emailStatus.status) {
      case 'available':
        return <CheckCircleIcon className="w-8 h-8 text-green-600" />;
      case 'exists':
        return <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />;
      case 'needs_verification':
        return <EnvelopeIcon className="w-8 h-8 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    if (!emailStatus) return null;

    switch (emailStatus.status) {
      case 'available':
        return (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-2">Email tersedia!</p>
            <p className="text-sm text-gray-600 mb-2">Email yang tersedia:</p>
            <p className="text-sm font-medium text-gray-900 mb-4">{emailStatus.email}</p>
            <p className="text-sm text-gray-600 mb-4">Anda dapat melanjutkan registrasi.</p>
            <div className="space-y-2">
              <Button
                onClick={nextStep}
                className="w-full"
              >
                Lanjutkan Registrasi
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={handleChangeEmail}
                variant="outline"
                size="sm"
              >
                Gunakan Email Lain
              </Button>
            </div>
          </div>
        );
      case 'exists':
        return (
          <div className="text-center">
            <p className="text-red-600 font-medium mb-2">Email sudah terdaftar</p>
            <p className="text-sm text-gray-600 mb-2">
              Pengguna dengan alamat email ini sudah terdaftar dan terverifikasi:
            </p>
            <p className="text-sm font-medium text-gray-900 mb-4">{emailStatus.email}</p>
            <Button
              onClick={handleChangeEmail}
              variant="outline"
              size="sm"
            >
              Coba Email Lain
            </Button>
          </div>
        );
      case 'needs_verification':
        return (
          <div className="text-center">
            <p className="text-blue-600 font-medium mb-2">Email perlu verifikasi</p>
            <p className="text-sm text-gray-600 mb-2">
              Email ini sudah terdaftar tetapi belum terverifikasi:
            </p>
            <p className="text-sm font-medium text-gray-900 mb-2">{emailStatus.email}</p>
            <p className="text-sm text-gray-600 mb-4">
              Silakan periksa email Anda untuk kode verifikasi.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  nextStep();
                  nextStep(); // Skip user form, go to email verification
                }}
                className="w-full"
              >
                Lanjutkan ke Verifikasi Email
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={handleChangeEmail}
                variant="outline"
                size="sm"
              >
                Gunakan Email Lain
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <EnvelopeIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Periksa Ketersediaan Email
        </h2>
        <p className="text-gray-600">
          Masukkan alamat email Anda untuk memeriksa ketersediaannya untuk registrasi
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          {!emailStatus ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Alamat Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Masukkan alamat email Anda"
                  disabled={isChecking || isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!email || isChecking || isLoading}
              >
                {(isChecking || isLoading) ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Memeriksa...
                  </div>
                ) : (
                  'Periksa Ketersediaan Email'
                )}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {getStatusIcon()}
              <div className="text-center">
                {getStatusMessage()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};
