'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
    formState: { errors },
    watch,
    setError
  } = useForm<PasswordSetupForm>({
    resolver: zodResolver(PasswordSetupSchema)
  });

  const password = watch('password');

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
        console.error('Token validation error:', error);
        setTokenValid(false);
      }
    };

    validateRegistrationToken();
  }, [token, validateToken]);

  const onSubmit = async (data: PasswordSetupForm) => {
    setIsSubmitting(true);
    
    try {
      const result = await completeRegistration({
        token,
        password: data.password
      });

      if (result.success) {
        // Show success message
        alert('Registration completed successfully! You can now login with your credentials.');
        
        // Redirect to login page with success message
        router.push('/login?message=registration_complete');
      } else {
        setError('root', { 
          message: result.message || 'Failed to complete registration. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Registration completion error:', error);
      setError('root', { 
        message: 'An error occurred while completing registration. Please try again.' 
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
      return { strength, label: 'Weak', color: 'bg-red-500' };
    } else if (strength <= 3) {
      return { strength, label: 'Medium', color: 'bg-yellow-500' };
    } else if (strength <= 4) {
      return { strength, label: 'Strong', color: 'bg-blue-500' };
    } else {
      return { strength, label: 'Very Strong', color: 'bg-green-500' };
    }
  };

  // Loading state
  if (loading || tokenValid === null) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Validating registration link...</p>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Invalid or Expired Link</h3>
        <p className="text-gray-600 mb-4">
          This registration link is invalid or has expired. Please contact your clinic administrator for a new link.
        </p>
        <Button 
          variant="outline" 
          onClick={() => router.push('/login')}
        >
          Go to Login
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
                  Welcome, {therapistInfo.name}!
                </h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>Email: {therapistInfo.email}</p>
                  <p>Clinic: {therapistInfo.clinicName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password Field */}
        <div>
          <Label htmlFor="password">Create Password *</Label>
          <div className="relative">
            <Input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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
                <p>Password requirements:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li className={password.length >= 8 ? 'text-green-600' : ''}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>One uppercase letter</li>
                  <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>One lowercase letter</li>
                  <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>One number</li>
                  <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>One special character</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Password Confirmation Field */}
        <div>
          <Label htmlFor="passwordConfirmation">Confirm Password *</Label>
          <div className="relative">
            <Input
              {...register('passwordConfirmation')}
              id="passwordConfirmation"
              type={showPasswordConfirmation ? 'text' : 'password'}
              placeholder="Confirm your password"
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
          <Checkbox
            {...register('acceptTerms')}
            id="acceptTerms"
            className={errors.acceptTerms ? 'border-red-500' : ''}
          />
          <div className="flex-1">
            <Label htmlFor="acceptTerms" className="text-sm">
              I accept the{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
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
          >
            {loading || isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Setting up account...
              </>
            ) : (
              <>
                <LockClosedIcon className="w-4 h-4 mr-2" />
                Complete Registration
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
                What happens next?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  After completing registration, you'll be redirected to the login page where you can access your therapist account with your new credentials.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};