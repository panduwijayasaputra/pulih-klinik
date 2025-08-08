'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useTherapist } from '@/hooks/useTherapist';

type RegistrationStep = 'validate' | 'profile' | 'password' | 'complete';

interface TherapistRegistrationProps {
  invitationToken: string;
}

interface TherapistProfileData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialization: string;
  yearsExperience: number;
  education: string;
  certifications?: string;
}

interface TherapistPasswordData {
  password: string;
  confirmPassword: string;
}

export const TherapistRegistration: React.FC<TherapistRegistrationProps> = ({
  invitationToken
}) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('validate');
  const [invitation, setInvitation] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState<TherapistProfileData | null>(null);
  
  const { validateInvitation, registerTherapist, loading, error, clearError } = useTherapist();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors
  } = useForm<TherapistProfileData & TherapistPasswordData>();

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError('confirmPassword', { message: 'Password tidak cocok' });
    } else {
      clearErrors('confirmPassword');
    }
  }, [password, confirmPassword, setError, clearErrors]);

  // Validate invitation token on component mount
  useEffect(() => {
    validateInvitationToken();
  }, [invitationToken]);

  const validateInvitationToken = async () => {
    try {
      const result = await validateInvitation(invitationToken);
      if (result.valid && result.invitation) {
        setInvitation(result.invitation);
        setCurrentStep('profile');
      } else {
        setCurrentStep('validate');
      }
    } catch (error) {
      setCurrentStep('validate');
    }
  };

  const handleProfileSubmit = async (data: TherapistProfileData) => {
    setProfileData(data);
    setCurrentStep('password');
  };

  const handlePasswordSubmit = async (data: TherapistPasswordData) => {
    if (!profileData) return;

    try {
      const result = await registerTherapist({
        ...profileData,
        password: data.password,
        confirmPassword: data.confirmPassword,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      if (result.success) {
        setCurrentStep('complete');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const getStepNumber = (step: RegistrationStep) => {
    const steps = ['validate', 'profile', 'password', 'complete'];
    return steps.indexOf(step) + 1;
  };

  const getProgressPercentage = () => {
    const steps = ['validate', 'profile', 'password', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const specializations = [
    'Anxiety Disorders',
    'Depression',
    'PTSD (Post-Traumatic Stress Disorder)',
    'Phobias',
    'Addiction',
    'Stress Management',
    'Self-Esteem Issues',
    'Relationship Problems',
    'Grief and Loss',
    'Sleep Disorders',
    'Performance Enhancement',
    'Pain Management',
    'Weight Management',
    'Smoking Cessation',
    'Other'
  ];

  const renderValidateStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Undangan Tidak Valid
        </h3>
        <p className="text-gray-600 mb-4">
          Token undangan yang Anda gunakan tidak valid atau sudah kedaluwarsa.
        </p>
        <p className="text-sm text-gray-500">
          Silakan hubungi admin klinik untuk mendapatkan undangan baru.
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Informasi Klinik:</h4>
        <p className="text-sm text-gray-600">
          {invitation?.clinic_name || 'Klinik tidak ditemukan'}
        </p>
        <p className="text-sm text-gray-600">
          Admin: {invitation?.admin_name || 'Admin tidak ditemukan'}
        </p>
      </div>
    </div>
  );

  const renderProfileStep = () => (
    <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-6">
      {/* Invitation Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <BuildingOfficeIcon className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-900">Undangan dari Klinik</h4>
          </div>
          <p className="text-sm text-blue-800">
            <strong>{invitation?.clinic_name}</strong> mengundang Anda untuk bergabung sebagai therapist.
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Admin: {invitation?.admin_name}
          </p>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserIcon className="w-5 h-5 mr-2" />
            Informasi Pribadi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                {...register('name', { required: 'Nama lengkap wajib diisi' })}
                id="name"
                placeholder="Contoh: Dr. Budi Santoso"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                {...register('email', { 
                  required: 'Email wajib diisi',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' }
                })}
                id="email"
                type="email"
                placeholder="therapist@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Nomor Telepon *</Label>
              <Input
                {...register('phone', { 
                  required: 'Nomor telepon wajib diisi',
                  pattern: { value: /^(\+62|0)[0-9]{9,12}$/, message: 'Format telepon tidak valid' }
                })}
                id="phone"
                placeholder="+62-812-3456-7890"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AcademicCapIcon className="w-5 h-5 mr-2" />
            Informasi Profesional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licenseNumber">Nomor SIP *</Label>
              <Input
                {...register('licenseNumber', { required: 'Nomor SIP wajib diisi' })}
                id="licenseNumber"
                placeholder="SIP-123456"
                className={errors.licenseNumber ? 'border-red-500' : ''}
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.licenseNumber.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="specialization">Spesialisasi *</Label>
              <select
                {...register('specialization', { required: 'Spesialisasi wajib diisi' })}
                id="specialization"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.specialization ? 'border-red-500' : ''
                }`}
              >
                <option value="">Pilih Spesialisasi</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="yearsExperience">Pengalaman Kerja (Tahun) *</Label>
              <Input
                {...register('yearsExperience', { 
                  required: 'Pengalaman kerja wajib diisi',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Pengalaman minimal 0 tahun' }
                })}
                id="yearsExperience"
                type="number"
                min="0"
                placeholder="5"
                className={errors.yearsExperience ? 'border-red-500' : ''}
              />
              {errors.yearsExperience && (
                <p className="mt-1 text-sm text-red-600">{errors.yearsExperience.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="education">Pendidikan Terakhir *</Label>
              <Input
                {...register('education', { required: 'Pendidikan terakhir wajib diisi' })}
                id="education"
                placeholder="S1 Psikologi, Universitas Indonesia"
                className={errors.education ? 'border-red-500' : ''}
              />
              {errors.education && (
                <p className="mt-1 text-sm text-red-600">{errors.education.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="certifications">Sertifikasi (Opsional)</Label>
            <Textarea
              {...register('certifications')}
              id="certifications"
              rows={3}
              placeholder="Contoh: Certified Hypnotherapist, CBT Practitioner, EMDR Certified"
              className="resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Pisahkan sertifikasi dengan koma
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="px-8">
          Lanjutkan ke Setup Password
        </Button>
      </div>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BriefcaseIcon className="w-5 h-5 mr-2" />
            Setup Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  {...register('password', { 
                    required: 'Password wajib diisi',
                    minLength: { value: 8, message: 'Password minimal 8 karakter' },
                    pattern: { 
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: 'Password harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus'
                    }
                  })}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                <p>Password harus mengandung:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Minimal 8 karakter</li>
                  <li>Huruf besar dan huruf kecil</li>
                  <li>Angka</li>
                  <li>Karakter khusus (@$!%*?&)</li>
                </ul>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
              <div className="relative">
                <Input
                  {...register('confirmPassword', { required: 'Konfirmasi password wajib diisi' })}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi password"
                  className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setCurrentStep('profile')}
        >
          Kembali ke Profil
        </Button>
        <Button type="submit" className="px-8" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Mendaftarkan...
            </>
          ) : (
            'Selesaikan Pendaftaran'
          )}
        </Button>
      </div>
    </form>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircleIcon className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Pendaftaran Berhasil!
        </h3>
        <p className="text-gray-600 mb-4">
          Akun therapist Anda telah berhasil dibuat dan menunggu aktivasi dari admin klinik.
        </p>
        <p className="text-sm text-gray-500">
          Anda akan menerima email konfirmasi setelah akun diaktivasi.
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Langkah Selanjutnya:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Tunggu aktivasi dari admin klinik</li>
          <li>• Periksa email untuk instruksi selanjutnya</li>
          <li>• Login ke platform setelah akun diaktivasi</li>
          <li>• Mulai sesi terapi dengan klien</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pendaftaran Therapist
        </h2>
        <p className="text-gray-600">
          Lengkapi informasi Anda untuk bergabung sebagai therapist
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Langkah {getStepNumber(currentStep)} dari 4</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
        <Progress value={getProgressPercentage()} className="h-2" />
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Step Content */}
      {currentStep === 'validate' && renderValidateStep()}
      {currentStep === 'profile' && renderProfileStep()}
      {currentStep === 'password' && renderPasswordStep()}
      {currentStep === 'complete' && renderCompleteStep()}
    </div>
  );
};
