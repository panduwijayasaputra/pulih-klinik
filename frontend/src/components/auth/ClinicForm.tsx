'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClinicFormData, indonesianProvinces } from '@/types/registration';
import { clinicFormSchema } from '@/schemas/registrationSchema';
import { useRegistrationStore } from '@/store/registration';

export const ClinicForm: React.FC = () => {
  const { data, updateClinicData, submitClinicData, isLoading, error, clearError, registrationId } = useRegistrationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClinicFormData>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: data.clinic || {
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      description: '',
      workingHours: '',
      province: '',
    },
  });

  const onSubmit = async (formData: ClinicFormData) => {
    if (!registrationId) return;

    try {
      setIsSubmitting(true);
      clearError();
      
      await submitClinicData(registrationId, formData);
      updateClinicData(formData);
    } catch (error) {
      console.error('Failed to submit clinic data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Informasi Klinik
        </h2>
        <p className="text-gray-600">
          Lengkapi informasi klinik Anda
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Clinic Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nama Klinik *
          </Label>
          <Input
            id="name"
            type="text"
            {...register('name')}
            className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Contoh: Klinik Hipnoterapi Sehat"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Alamat Lengkap *
          </Label>
          <Textarea
            id="address"
            {...register('address')}
            className={`mt-1 ${errors.address ? 'border-red-500' : ''}`}
            placeholder="Masukkan alamat lengkap klinik"
            rows={3}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Nomor Telepon *
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="0812-3456-7890"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Klinik *
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="info@kliniksehat.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Province */}
        <div>
          <Label htmlFor="province" className="text-sm font-medium text-gray-700">
            Provinsi
          </Label>
          <select
            {...register('province')}
            id="province"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.province ? 'border-red-500' : ''}`}
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

        {/* Website */}
        <div>
          <Label htmlFor="website" className="text-sm font-medium text-gray-700">
            Website (Opsional)
          </Label>
          <Input
            id="website"
            type="url"
            {...register('website')}
            className={`mt-1 ${errors.website ? 'border-red-500' : ''}`}
            placeholder="https://www.kliniksehat.com"
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
          )}
        </div>

        {/* Working Hours */}
        <div>
          <Label htmlFor="workingHours" className="text-sm font-medium text-gray-700">
            Jam Kerja (Opsional)
          </Label>
          <Input
            id="workingHours"
            type="text"
            {...register('workingHours')}
            className={`mt-1 ${errors.workingHours ? 'border-red-500' : ''}`}
            placeholder="Senin-Jumat: 08:00-17:00, Sabtu: 08:00-12:00"
          />
          {errors.workingHours && (
            <p className="mt-1 text-sm text-red-600">{errors.workingHours.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Deskripsi Klinik (Opsional)
          </Label>
          <Textarea
            id="description"
            {...register('description')}
            className={`mt-1 ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Deskripsi singkat tentang klinik dan layanan yang ditawarkan"
            rows={4}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isSubmitting}
        >
          {(isLoading || isSubmitting) ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Memproses...
            </div>
          ) : (
            'Lanjutkan ke Pilihan Paket'
          )}
        </Button>
      </form>
    </div>
  );
};