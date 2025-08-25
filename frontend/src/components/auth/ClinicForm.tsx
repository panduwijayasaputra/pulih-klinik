'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClinicDataFormData, indonesianProvinces } from '@/types/registration';
import { clinicDataSchema } from '@/schemas/registrationSchema';
import { useRegistrationStore } from '@/store/registration';

export const ClinicForm: React.FC = () => {
  const { data, updateClinicData, nextStep, clearError, isEmailVerified } = useRegistrationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClinicDataFormData>({
    resolver: zodResolver(clinicDataSchema),
    defaultValues: data.clinic || {
      name: '',
      province: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      officeHours: '',
      adminName: '',
      adminEmail: '',
      adminWhatsapp: '',
      adminPosition: '',
      adminPassword: '',
      confirmPassword: '',
    },
  });

  const adminEmail = watch('adminEmail');
  const isCurrentEmailVerified = adminEmail ? isEmailVerified(adminEmail) : false;

  const onSubmit = async (formData: ClinicDataFormData) => {
    try {
      setIsSubmitting(true);
      clearError();
      
      // Update store first
      updateClinicData(formData);
      
      // If email is already verified, skip verification step
      if (isCurrentEmailVerified) {
        nextStep(); // This will automatically skip verification due to store logic
      } else {
        // Mock email verification sending for new email
        await new Promise(resolve => setTimeout(resolve, 1500));
        nextStep();
      }
    } catch (error) {
      clearError();
      // In a real implementation, this would show an error message
      console.error('Failed to send verification email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Clinic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Informasi Klinik
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="name">Nama Klinik *</Label>
            <Input
              {...register('name')}
              id="name"
              placeholder="Contoh: Klinik Sehat Jiwa Jakarta"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="province">Provinsi *</Label>
            <select
              {...register('province')}
              id="province"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.province ? 'border-red-500' : ''
              }`}
            >
              <option value="">Pilih Provinsi</option>
              {indonesianProvinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">Kota/Kabupaten *</Label>
            <Input
              {...register('city')}
              id="city"
              placeholder="Contoh: Jakarta Pusat"
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Alamat Lengkap *</Label>
            <Textarea
              {...register('address')}
              id="address"
              rows={3}
              placeholder="Contoh: Jl. Sudirman No. 123, Blok A, Lantai 2"
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Nomor Telepon Klinik *</Label>
            <Input
              {...register('phone')}
              id="phone"
              placeholder="Contoh: 0812xxxxxxx, +62812xxxxxxx, atau 62812xxxxxxx"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email Klinik *</Label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="Contoh: info@kliniksehat.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">Website (Opsional)</Label>
            <Input
              {...register('website')}
              id="website"
              placeholder="Contoh: https://kliniksehat.com"
              className={errors.website ? 'border-red-500' : ''}
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="officeHours">Jam Operasional *</Label>
            <Input
              {...register('officeHours')}
              id="officeHours"
              placeholder="Contoh: Senin-Jumat 08:00-17:00"
              className={errors.officeHours ? 'border-red-500' : ''}
            />
            {errors.officeHours && (
              <p className="mt-1 text-sm text-red-600">{errors.officeHours.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Admin Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Informasi Administrator Klinik
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="adminName">Nama Lengkap Admin *</Label>
            <Input
              {...register('adminName')}
              id="adminName"
              placeholder="Contoh: Dr. Sari Wulandari"
              className={errors.adminName ? 'border-red-500' : ''}
            />
            {errors.adminName && (
              <p className="mt-1 text-sm text-red-600">{errors.adminName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="adminPosition">Posisi/Jabatan *</Label>
            <Input
              {...register('adminPosition')}
              id="adminPosition"
              placeholder="Contoh: Direktur Klinik, Kepala Therapist"
              className={errors.adminPosition ? 'border-red-500' : ''}
            />
            {errors.adminPosition && (
              <p className="mt-1 text-sm text-red-600">{errors.adminPosition.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="adminEmail">Email Admin *</Label>
            <div className="relative">
              <Input
                {...register('adminEmail')}
                id="adminEmail"
                type="email"
                placeholder="Contoh: admin@kliniksehat.com"
                className={`${errors.adminEmail ? 'border-red-500' : ''} ${isCurrentEmailVerified ? 'bg-green-50 border-green-300' : ''}`}
                disabled={isCurrentEmailVerified}
              />
              {isCurrentEmailVerified && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                </div>
              )}
            </div>
            {isCurrentEmailVerified && (
              <p className="mt-1 text-sm text-green-600">Email sudah terverifikasi ✓</p>
            )}
            {errors.adminEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.adminEmail.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="adminWhatsapp">WhatsApp Admin *</Label>
            <Input
              {...register('adminWhatsapp')}
              id="adminWhatsapp"
              placeholder="Contoh: 0812xxxxxxx, +62812xxxxxxx, atau 62812xxxxxxx"
              className={errors.adminWhatsapp ? 'border-red-500' : ''}
            />
            {errors.adminWhatsapp && (
              <p className="mt-1 text-sm text-red-600">{errors.adminWhatsapp.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="adminPassword">Password Admin *</Label>
            <div className="relative">
              <Input
                {...register('adminPassword')}
                id="adminPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 8 karakter, huruf besar, kecil, dan angka"
                className={`pr-10 ${errors.adminPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.adminPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.adminPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
            <div className="relative">
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Ulangi password yang sama"
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button 
          type="submit" 
          className="px-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {isCurrentEmailVerified ? 'Memproses...' : 'Mengirim Email Verifikasi...'}
            </>
          ) : (
            isCurrentEmailVerified ? 'Lanjutkan ke Ringkasan' : 'Lanjutkan ke Verifikasi Email'
          )}
        </Button>
      </div>

      {/* Helper Text */}
      <div className="text-sm text-gray-500">
        <p className="mb-1">* Wajib diisi</p>
        <p>Data ini akan digunakan untuk setup awal akun klinik dan komunikasi dengan tim support.</p>
      </div>
    </form>
  );
};