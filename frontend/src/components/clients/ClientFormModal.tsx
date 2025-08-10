'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormModal } from '@/components/ui/form-modal';

import { ClientCreateData, createClientSchema } from '@/schemas/clientSchema';
import { ClientEducationEnum, ClientGenderEnum, ClientReligionEnum } from '@/types/enums';

export interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  defaultValues?: Partial<ClientCreateData>;
  onSubmitSuccess?: (data: ClientCreateData) => void;
  onCancel?: () => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  open,
  onOpenChange,
  mode = 'create',
  defaultValues,
  onSubmitSuccess,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
  } = useForm<ClientCreateData>({
    resolver: zodResolver(createClientSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: 0,
      gender: ClientGenderEnum.Male,
      phone: '',
      email: '',
      occupation: '',
      education: ClientEducationEnum.HighSchool,
      address: '',
      primaryIssue: '',
      ...defaultValues,
    },
  });

  // Reset form when modal opens/closes or defaultValues change
  React.useEffect(() => {
    if (open) {
      reset({
        name: '',
        age: 0,
        gender: ClientGenderEnum.Male,
        phone: '',
        email: '',
        occupation: '',
        education: ClientEducationEnum.HighSchool,
        address: '',
        primaryIssue: '',
        ...defaultValues,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = async (data: ClientCreateData) => {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmitSuccess?.(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const title = mode === 'edit' ? 'Ubah Data Klien' : 'Tambah Klien Baru';
  const description = mode === 'edit' 
    ? 'Update informasi klien yang sudah ada'
    : 'Tambahkan klien baru ke dalam sistem';

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input id="name" placeholder="Nama klien" {...register('name')} />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="age">Usia *</Label>
            <Input id="age" type="number" min={0} max={120} {...register('age', { valueAsNumber: true })} />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Jenis Kelamin *</Label>
            <Select
              value={watch('gender')}
              onValueChange={val => setValue('gender', val as ClientCreateData['gender'], { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ClientGenderEnum).map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{(errors.gender as any).message}</p>
            )}
          </div>

          <div>
            <Label>Pendidikan *</Label>
            <Select
              value={watch('education')}
              onValueChange={val => setValue('education', val as ClientCreateData['education'], { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih pendidikan" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ClientEducationEnum).map(ed => (
                  <SelectItem key={ed} value={ed}>{ed}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.education && (
              <p className="mt-1 text-sm text-red-600">{(errors.education as any).message}</p>
            )}
          </div>

          <div>
            <Label>Agama</Label>
            <Select
              value={watch('religion') as any}
              onValueChange={val => setValue('religion', val as any, { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih agama (opsional)" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ClientReligionEnum).map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.religion && (
              <p className="mt-1 text-sm text-red-600">{(errors.religion as any).message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="phone">Telepon *</Label>
            <Input id="phone" placeholder="+62xxxxxxxxxxx" {...register('phone')} />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@example.com" {...register('email')} />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="occupation">Pekerjaan</Label>
            <Input id="occupation" placeholder="Pekerjaan" {...register('occupation')} />
            {errors.occupation && (
              <p className="mt-1 text-sm text-red-600">{(errors.occupation as any).message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="province">Provinsi</Label>
            <Input id="province" placeholder="Provinsi" {...register('province')} />
            {errors.province && (
              <p className="mt-1 text-sm text-red-600">{(errors.province as any).message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="address">Alamat *</Label>
          <Textarea id="address" rows={3} placeholder="Alamat lengkap" {...register('address')} />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="primaryIssue">Masalah Utama *</Label>
          <Input id="primaryIssue" placeholder="Masalah utama" {...register('primaryIssue')} />
          {errors.primaryIssue && (
            <p className="mt-1 text-sm text-red-600">{errors.primaryIssue.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Kontak Darurat (Nama)</Label>
            <Input placeholder="Nama kontak darurat" {...register('emergencyContact.name')} />
          </div>
          <div>
            <Label>Kontak Darurat (Telepon)</Label>
            <Input placeholder="+62xxxxxxxxxxx" {...register('emergencyContact.phone')} />
          </div>
        </div>
        <div>
          <Label>Kontak Darurat (Hubungan)</Label>
          <Input placeholder="Hubungan (mis: Suami/Istri)" {...register('emergencyContact.relationship')} />
        </div>

        <div>
          <Label htmlFor="notes">Catatan</Label>
          <Textarea id="notes" rows={3} placeholder="Catatan tambahan (opsional)" {...register('notes')} />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{(errors.notes as any).message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty || !isValid}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Menyimpan...
              </>
            ) : (
              mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Klien'
            )}
          </Button>
        </div>
      </form>
    </FormModal>
  );
};

export default ClientFormModal;
