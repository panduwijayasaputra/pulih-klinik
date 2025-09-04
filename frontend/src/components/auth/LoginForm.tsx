'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const watchRememberMe = watch('rememberMe');

  // Load saved credentials on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCredentials = localStorage.getItem('remember-login');
      if (savedCredentials) {
        try {
          const { email, rememberMe } = JSON.parse(savedCredentials);
          setValue('email', email);
          setValue('rememberMe', rememberMe);
          console.log('🔄 Loaded saved email for:', email);
        } catch (error) {
          console.warn('Failed to parse saved credentials:', error);
          localStorage.removeItem('remember-login');
        }
      }
    }
  }, [setValue]);


  const onSubmit = async (data: LoginFormData) => {
    clearError();
    
    // Handle remember me functionality
    if (typeof window !== 'undefined') {
      if (data.rememberMe) {
        // Save credentials to localStorage (only email for security)
        const credentialsToSave = {
          email: data.email,
          rememberMe: true,
        };
        localStorage.setItem('remember-login', JSON.stringify(credentialsToSave));
        console.log('✅ Email saved for next login');
      } else {
        // Remove saved credentials if rememberMe is unchecked
        localStorage.removeItem('remember-login');
        console.log('🗑️ Saved credentials removed');
      }
    }
    
    // Remove rememberMe from login data (backend doesn't need it)
    const { rememberMe, ...loginData } = data;
    console.log('🚀 Attempting login with:', loginData.email);
    
    try {
      const success = await login(loginData);
      console.log('✅ Login success:', success);
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      // Error is handled by the auth hook
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

      </CardContent>
    </Card>
  );
};