'use client';

import { useState, useEffect } from 'react';
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
import { demoCredentials } from '@/lib/mocks/auth';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyEmailButton, setShowVerifyEmailButton] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  // Function to translate error messages to Bahasa Indonesia
  const translateError = (errorMessage: string): string => {
    const errorLower = errorMessage.toLowerCase();
    
    // Authentication errors - handle specific backend error messages
    if (errorLower.includes('email not verified')) {
      return 'Email belum diverifikasi. Silakan periksa email Anda dan klik link verifikasi, atau daftar ulang.';
    }
    if (errorLower.includes('account disabled')) {
      return 'Akun Anda telah dinonaktifkan. Silakan hubungi admin klinik Anda.';
    }
    if (errorLower.includes('invalid password')) {
      return 'Password salah. Silakan periksa kembali.';
    }
    if (errorLower.includes('user not found')) {
      return 'Email tidak ditemukan. Silakan periksa kembali atau daftar akun baru.';
    }
    
    // Fallback for generic "invalid credentials" (for security, we don't distinguish between user not found and wrong password)
    if (errorLower.includes('invalid credentials') || errorLower.includes('wrong password') || errorLower.includes('incorrect password')) {
      return 'Email atau password salah. Silakan periksa kembali.';
    }
    if (errorLower.includes('too many attempts') || errorLower.includes('rate limit') || errorLower.includes('throttle')) {
      return 'Terlalu banyak percobaan login. Silakan tunggu beberapa saat dan coba lagi.';
    }
    if (errorLower.includes('network') || errorLower.includes('connection') || errorLower.includes('fetch')) {
      return 'Kesalahan koneksi. Silakan periksa internet Anda dan coba lagi.';
    }
    if (errorLower.includes('server error') || errorLower.includes('internal error') || errorLower.includes('500')) {
      return 'Terjadi kesalahan server. Silakan coba lagi nanti.';
    }
    if (errorLower.includes('unauthorized') || errorLower.includes('401')) {
      return 'Akses ditolak. Silakan login kembali.';
    }
    if (errorLower.includes('forbidden') || errorLower.includes('403')) {
      return 'Anda tidak memiliki izin untuk mengakses sistem ini.';
    }
    if (errorLower.includes('not found') || errorLower.includes('404')) {
      return 'Layanan tidak ditemukan. Silakan coba lagi nanti.';
    }
    if (errorLower.includes('timeout') || errorLower.includes('timed out')) {
      return 'Waktu koneksi habis. Silakan coba lagi.';
    }
    if (errorLower.includes('login failed') || errorLower.includes('authentication failed')) {
      return 'Login gagal. Silakan periksa email dan password Anda.';
    }
    
    // Return original message if no translation found
    return errorMessage;
  };

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

  // Clear verify email button when error is cleared and check for email not verified
  useEffect(() => {
    if (!error) {
      setShowVerifyEmailButton(false);
    } else {
      // Check if the current error is email not verified
      const errorLower = error.toLowerCase();
      if (errorLower.includes('email not verified')) {
        setShowVerifyEmailButton(true);
      } else {
        setShowVerifyEmailButton(false);
      }
    }
  }, [error]);

  // Handle demo user selection
  const handleDemoUserSelect = (selectedUser: string) => {
    if (selectedUser === '') return;
    
    const demoUser = demoCredentials.find(cred => cred.label === selectedUser);
    if (demoUser) {
      setValue('email', demoUser.email);
      setValue('password', demoUser.password);
      console.log('🎭 Demo user selected:', demoUser.label);
    }
  };

  // Handle verify email button click
  const handleVerifyEmail = () => {
    const email = watch('email');
    if (email) {
      // Navigate to registration page with email pre-filled and go to verification step
      window.location.href = `/register?email=${encodeURIComponent(email)}&step=email_verification`;
    }
  };


  const onSubmit = async (data: LoginFormData) => {
    clearError();
    setShowVerifyEmailButton(false);
    
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
      // Error is handled by the auth hook and useEffect will check for email not verified
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
              <div className="mb-2">
                {translateError(error)}
              </div>
              {showVerifyEmailButton && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleVerifyEmail}
                  className="w-full"
                >
                  Verifikasi Email
                </Button>
              )}
            </div>
          )}

          {/* Demo User Selection */}
          <div className="space-y-2">
            <Label htmlFor="demoUser" className="text-foreground">Demo User (Pilih untuk testing)</Label>
            <Select onValueChange={handleDemoUserSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih demo user..." />
              </SelectTrigger>
              <SelectContent>
                {demoCredentials.map((cred) => (
                  <SelectItem key={cred.label} value={cred.label}>
                    {cred.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Atau</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="nama@email.com"
              className={errors.email ? 'border-destructive' : ''}
              disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
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