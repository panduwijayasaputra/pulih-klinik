'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoginFormData } from '@/types/auth';
import { loginSchema } from '@/schemas/authSchema';
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
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const demoCredentials = [
    { label: 'Administrator', email: 'admin@terapintar.com', password: 'admin123' },
    { label: 'Clinic Admin', email: 'admin@kliniksehat.com', password: 'clinic123' },
    { label: 'Therapist', email: 'therapist@kliniksehat.com', password: 'therapist123' },
    { label: 'Multi-Role', email: 'dr.ahmad@kliniksehat.com', password: 'multi123' },
  ];

  const handleDemoSelect = (value: string) => {
    const selectedDemo = demoCredentials[parseInt(value)];
    if (selectedDemo) {
      setValue('email', selectedDemo.email);
      setValue('password', selectedDemo.password);
    }
  };

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

        {/* Demo credentials selector */}
        <div className="mt-6 space-y-2">
          <Label htmlFor="demo-select" className="text-sm font-medium text-foreground">
            Demo Login:
          </Label>
          <Select onValueChange={handleDemoSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih akun demo untuk login cepat" />
            </SelectTrigger>
            <SelectContent>
              {demoCredentials.map((credential, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {credential.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};