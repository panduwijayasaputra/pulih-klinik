'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { useTherapistRegistration } from '@/hooks/useTherapistRegistration';

// Password validation schema
const PasswordSetupSchema = z.object({
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf kapital')
    .regex(/[a-z]/, 'Password harus mengandung minimal 1 huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
    .regex(/[^A-Za-z0-9]/, 'Password harus mengandung minimal 1 simbol'),
  passwordConfirmation: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Anda harus menyetujui syarat dan ketentuan'
  })
}).refine(data => data.password === data.passwordConfirmation, {
  message: 'Konfirmasi password tidak sesuai',
  path: ['passwordConfirmation']
});

type PasswordSetupForm = z.infer<typeof PasswordSetupSchema>;

interface TherapistInfo {
  id: string;
  name: string;
  email: string;
  clinicName: string;
}

interface TherapistPasswordSetupProps {
  token: string;
}

export const TherapistPasswordSetup: React.FC<TherapistPasswordSetupProps> = ({ token }) => {
  const [therapistInfo, setTherapistInfo] = useState<TherapistInfo | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { validateToken, completeRegistration, loading } = useTherapistRegistration();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    setError
  } = useForm<PasswordSetupForm>({
    resolver: zodResolver(PasswordSetupSchema),
    mode: 'onChange' // Enable real-time validation
  });

  const password = watch('password');
  const passwordConfirmation = watch('passwordConfirmation');
  const acceptTerms = watch('acceptTerms');
  
  // Debug form state
  useEffect(() => {
    console.log('Form state:', {
      password: password ? `${password.substring(0, 3)}...` : 'empty',
      passwordConfirmation: passwordConfirmation ? `${passwordConfirmation.substring(0, 3)}...` : 'empty',
      acceptTerms,
      isValid,
      errors
    });
  }, [password, passwordConfirmation, acceptTerms, isValid, errors]);

  // Validate token on component mount
  useEffect(() => {
    const validateRegistrationToken = async () => {
      try {
        const result = await validateToken(token);
        
        if (result.valid && result.therapist) {
          setTherapistInfo(result.therapist);
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch (error) {
        setTokenValid(false);
      }
    };

    validateRegistrationToken();
  }, [token, validateToken]);

  const onSubmit = async (data: PasswordSetupForm) => {
    setIsSubmitting(true);
    console.log('Form data:', data);
    console.log('Token:', token);
    
    try {
      const registrationData = {
        token,
        password: data.password
      };
      console.log('Registration data being sent:', registrationData);
      
      const result = await completeRegistration(registrationData);
      console.log('Registration result:', result);

      if (result.success) {
        // Show success message
        alert('Registrasi berhasil diselesaikan! Anda sekarang dapat login dengan kredensial Anda.');
        
        // Redirect to login page with success message
        router.push('/login?message=registration_complete');
      } else {
        console.log('Registration failed:', result.message);
        setError('root', { 
          message: result.message || 'Gagal menyelesaikan registrasi. Silakan coba lagi.' 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('root', { 
        message: 'Terjadi kesalahan saat menyelesaikan registrasi. Silakan coba lagi.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    if (strength <= 2) {
      return { strength, label: 'Lemah', color: 'bg-red-500' };
    } else if (strength <= 3) {
      return { strength, label: 'Sedang', color: 'bg-yellow-500' };
    } else if (strength <= 4) {
      return { strength, label: 'Kuat', color: 'bg-blue-500' };
    } else {
      return { strength, label: 'Sangat Kuat', color: 'bg-green-500' };
    }
  };

  // Loading state
  if (loading || tokenValid === null) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Memvalidasi link registrasi...</p>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Link Tidak Valid atau Kedaluwarsa</h3>
        <p className="text-gray-600 mb-4">
          Link registrasi ini tidak valid atau telah kedaluwarsa. Silakan hubungi administrator klinik Anda untuk link baru.
        </p>
        <Button 
          variant="outline" 
          onClick={() => router.push('/login')}
        >
          Ke Halaman Login
        </Button>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(password || '');

  return (
    <div className="space-y-6">
      {/* Therapist Information */}
      {therapistInfo && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Selamat datang, {therapistInfo.name}!
                </h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>Email: {therapistInfo.email}</p>
                  <p>Klinik: {therapistInfo.clinicName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password Field */}
        <div>
          <Label htmlFor="password">Buat Kata Sandi *</Label>
          <div className="relative">
            <Input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan kata sandi Anda"
              className={errors.password ? 'border-red-500 pr-20' : 'pr-20'}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <EyeIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
          
          {/* Password Strength Meter */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{passwordStrength.label}</span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <p>Persyaratan kata sandi:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li className={password.length >= 8 ? 'text-green-600' : ''}>Minimal 8 karakter</li>
                  <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>Satu huruf kapital</li>
                  <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>Satu huruf kecil</li>
                  <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>Satu angka</li>
                  <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>Satu karakter khusus</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Password Confirmation Field */}
        <div>
          <Label htmlFor="passwordConfirmation">Konfirmasi Kata Sandi *</Label>
          <div className="relative">
            <Input
              {...register('passwordConfirmation')}
              id="passwordConfirmation"
              type={showPasswordConfirmation ? 'text' : 'password'}
              placeholder="Konfirmasi kata sandi Anda"
              className={errors.passwordConfirmation ? 'border-red-500 pr-20' : 'pr-20'}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
            >
              {showPasswordConfirmation ? (
                <EyeSlashIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <EyeIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.passwordConfirmation && (
            <p className="mt-1 text-sm text-red-600">{errors.passwordConfirmation.message}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="acceptTerms"
                checked={field.value || false}
                onCheckedChange={field.onChange}
                className={errors.acceptTerms ? 'border-red-500' : ''}
              />
            )}
          />
          <div className="flex-1">
            <Label htmlFor="acceptTerms" className="text-sm">
              Saya menyetujui{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Syarat dan Ketentuan
              </a>{' '}
              dan{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Kebijakan Privasi
              </a>
            </Label>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
            )}
          </div>
        </div>

        {/* Error Display */}
        {errors.root && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.root.message}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || isSubmitting}
            onClick={() => {
              console.log('Submit button clicked');
              console.log('Form valid:', isValid);
              console.log('Form errors:', errors);
            }}
          >
            {loading || isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Mengatur akun...
              </>
            ) : (
              <>
                <LockClosedIcon className="w-4 h-4 mr-2" />
                Selesaikan Registrasi
              </>
            )}
          </Button>
        </div>
      </form>

      {/* What happens next */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Apa yang terjadi selanjutnya?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Setelah menyelesaikan registrasi, Anda akan dialihkan ke halaman login di mana Anda dapat mengakses akun terapis Anda dengan kredensial baru.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};