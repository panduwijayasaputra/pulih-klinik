'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginFormData, loginSchema } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login(data);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          Masuk ke Terapintar
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Masukkan email dan password Anda untuk mengakses sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="nama@email.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <div className="relative">
              <Input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password Anda"
                className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              {...register('rememberMe')}
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <Label htmlFor="rememberMe" className="text-sm text-foreground">
              Ingat saya
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Belum memiliki akun?{' '}
            <a href="/register" className="text-primary-600 hover:text-primary-500 font-medium">
              Daftar sekarang
            </a>
          </p>
        </div>

        {/* Demo credentials info */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Demo Login:</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Administrator:</strong> admin@terapintar.com / admin123</p>
            <p><strong>Clinic Admin:</strong> admin@kliniksehat.com / clinic123</p>
            <p><strong>Therapist:</strong> therapist@kliniksehat.com / therapist123</p>
            <p><strong>Multi-Role:</strong> dr.ahmad@kliniksehat.com / multi123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};