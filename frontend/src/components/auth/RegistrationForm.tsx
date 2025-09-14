'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registrationSchema, RegistrationFormData } from '@/schemas/authSchema';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  onClearError,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const password = watch('password');

  const handleFormSubmit = async (data: RegistrationFormData) => {
    if (onClearError) {
      onClearError();
    }
    await onSubmit(data);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Daftar Admin Klinik
        </h2>
        <p className="text-gray-600">
          Buat akun admin untuk mengelola klinik Anda
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nama Lengkap
          </Label>
          <Input
            id="name"
            type="text"
            {...register('name')}
            className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Masukkan nama lengkap"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="admin@klinik.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Minimal 8 karakter dengan huruf besar, kecil, dan angka"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="passwordConfirm" className="text-sm font-medium text-gray-700">
            Konfirmasi Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="passwordConfirm"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('passwordConfirm')}
              className={`pr-10 ${errors.passwordConfirm ? 'border-red-500' : ''}`}
              placeholder="Ulangi password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.passwordConfirm && (
            <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm.message}</p>
          )}
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Kekuatan password:</p>
            <div className="space-y-1">
              <div className={`text-xs ${password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                ✓ Minimal 8 karakter
              </div>
              <div className={`text-xs ${/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                ✓ Mengandung huruf kecil
              </div>
              <div className={`text-xs ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                ✓ Mengandung huruf besar
              </div>
              <div className={`text-xs ${/\d/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                ✓ Mengandung angka
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Memproses...
            </div>
          ) : (
            'Daftar'
          )}
        </Button>
      </form>

    </div>
  );
};

export default RegistrationForm;
