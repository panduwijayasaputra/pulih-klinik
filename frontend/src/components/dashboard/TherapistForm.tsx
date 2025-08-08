'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useTherapist } from '@/hooks/useTherapist';

// Therapist registration schema
const therapistSchema = {
  // Personal Information
  name: { required: 'Nama lengkap wajib diisi', minLength: { value: 3, message: 'Nama minimal 3 karakter' } },
  email: { required: 'Email wajib diisi', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' } },
  phone: { required: 'Nomor telepon wajib diisi', pattern: { value: /^(\+62|0)[0-9]{9,12}$/, message: 'Format telepon tidak valid' } },
  
  // Professional Information
  licenseNumber: { required: 'Nomor SIP wajib diisi' },
  specialization: { required: 'Spesialisasi wajib diisi' },
  yearsExperience: { required: 'Pengalaman kerja wajib diisi', min: { value: 0, message: 'Pengalaman minimal 0 tahun' } },
  education: { required: 'Pendidikan terakhir wajib diisi' },
  
  // Password
  password: { 
    required: 'Password wajib diisi',
    minLength: { value: 8, message: 'Password minimal 8 karakter' },
    pattern: { 
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus'
    }
  },
  confirmPassword: { required: 'Konfirmasi password wajib diisi' }
};

interface TherapistFormData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  
  // Professional Information
  licenseNumber: string;
  specialization: string;
  yearsExperience: number;
  education: string;
  certifications?: string;
  
  // Password
  password: string;
  confirmPassword: string;
}

export const TherapistForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { registerTherapist, loading } = useTherapist();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError,
    clearErrors
  } = useForm<TherapistFormData>();

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Check if passwords match
  React.useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError('confirmPassword', { message: 'Password tidak cocok' });
    } else {
      clearErrors('confirmPassword');
    }
  }, [password, confirmPassword, setError, clearErrors]);

  const onSubmit = async (data: TherapistFormData) => {
    try {
      const result = await registerTherapist({
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      if (result.success) {
        // Show success message and reset form
        alert('Therapist berhasil didaftarkan!');
        reset();
      } else {
        alert('Gagal mendaftarkan therapist. Silakan coba lagi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Daftar Therapist Baru
        </h2>
        <p className="text-gray-600">
          Tambahkan therapist baru ke klinik Anda
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  {...register('name', therapistSchema.name)}
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
                  {...register('email', therapistSchema.email)}
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
                  {...register('phone', therapistSchema.phone)}
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
                  {...register('licenseNumber', therapistSchema.licenseNumber)}
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
                  {...register('specialization', therapistSchema.specialization)}
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
                    ...therapistSchema.yearsExperience,
                    valueAsNumber: true 
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
                  {...register('education', therapistSchema.education)}
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

        {/* Password Setup */}
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
                    {...register('password', therapistSchema.password)}
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
                    {...register('confirmPassword', therapistSchema.confirmPassword)}
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

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button 
            type="submit" 
            className="px-8"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Mendaftarkan...
              </>
            ) : (
              'Daftarkan Therapist'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};