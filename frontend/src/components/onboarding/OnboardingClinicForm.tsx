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
import { useOnboardingStore } from '@/store/onboarding';

export const OnboardingClinicForm: React.FC = () => {
  const { data, updateClinicData, submitClinicData, isLoading, error, clearError } = useOnboardingStore();
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
    try {
      setIsSubmitting(true);
      clearError();
      
      console.log('🚀 Submitting clinic data:', formData);
      const result = await submitClinicData(formData);
      console.log('✅ Clinic submission successful:', result);
      updateClinicData(formData);
    } catch (error) {
      console.error('❌ Failed to submit clinic data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Nama Klinik *</Label>
        <Input
          id="name"
          type="text"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
          placeholder="Masukkan nama klinik"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address">Alamat Klinik *</Label>
        <Textarea
          id="address"
          {...register('address')}
          className={errors.address ? 'border-red-500' : ''}
          placeholder="Masukkan alamat lengkap klinik"
          rows={3}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone">Nomor Telepon *</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            className={errors.phone ? 'border-red-500' : ''}
            placeholder="0812-3456-7890"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email Klinik *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
            placeholder="klinik@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="province">Provinsi</Label>
        <select
          id="province"
          {...register('province')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <Label htmlFor="website">Website Klinik</Label>
        <Input
          id="website"
          type="url"
          {...register('website')}
          className={errors.website ? 'border-red-500' : ''}
          placeholder="https://www.klinik.com"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="workingHours">Jam Operasional</Label>
        <Textarea
          id="workingHours"
          {...register('workingHours')}
          className={errors.workingHours ? 'border-red-500' : ''}
          placeholder="Senin-Jumat: 08:00-17:00, Sabtu: 08:00-12:00"
          rows={2}
        />
        {errors.workingHours && (
          <p className="mt-1 text-sm text-red-600">{errors.workingHours.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Deskripsi Klinik</Label>
        <Textarea
          id="description"
          {...register('description')}
          className={errors.description ? 'border-red-500' : ''}
          placeholder="Deskripsikan layanan dan spesialisasi klinik Anda"
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? 'Menyimpan...' : 'Lanjutkan'}
      </Button>
    </form>
  );
};