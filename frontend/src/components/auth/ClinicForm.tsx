'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClinicDataFormData, clinicDataSchema, indonesianProvinces } from '@/types/registration';
import { useRegistrationStore } from '@/store/registration';

export const ClinicForm: React.FC = () => {
  const { data, updateClinicData, nextStep, clearError } = useRegistrationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
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
    },
  });

  const onSubmit = async (formData: ClinicDataFormData) => {
    try {
      setIsSubmitting(true);
      clearError();
      
      // Mock email verification sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update store and proceed
      updateClinicData(formData);
      nextStep();
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
              placeholder="Contoh: 021-1234567 atau +62-21-1234567"
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
            <Input
              {...register('adminEmail')}
              id="adminEmail"
              type="email"
              placeholder="Contoh: admin@kliniksehat.com"
              className={errors.adminEmail ? 'border-red-500' : ''}
            />
            {errors.adminEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.adminEmail.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="adminWhatsapp">WhatsApp Admin *</Label>
            <Input
              {...register('adminWhatsapp')}
              id="adminWhatsapp"
              placeholder="Contoh: +62-812-3456-7890"
              className={errors.adminWhatsapp ? 'border-red-500' : ''}
            />
            {errors.adminWhatsapp && (
              <p className="mt-1 text-sm text-red-600">{errors.adminWhatsapp.message}</p>
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
              Mengirim Email Verifikasi...
            </>
          ) : (
            'Lanjutkan ke Verifikasi Email'
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