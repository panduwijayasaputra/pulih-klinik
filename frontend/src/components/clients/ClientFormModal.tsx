'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormModal } from '@/components/ui/form-modal';
import ConfirmationDialog, { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/toast';

import { createClientSchema } from '@/schemas/clientSchema';
import type { ClientFormData } from '@/types/client';
import { useClient } from '@/hooks/useClient';
import {
  ClientEducationEnum,
  ClientEducationLabels,
  ClientGenderEnum,
  ClientGenderLabels,
  ClientGuardianMaritalStatusEnum,
  ClientGuardianMaritalStatusLabels,
  ClientGuardianRelationshipEnum,
  ClientGuardianRelationshipLabels,
  ClientMaritalStatusEnum,
  ClientMaritalStatusLabels,
  ClientRelationshipWithSpouseEnum,
  ClientRelationshipWithSpouseLabels,
  ClientReligionEnum,
  ClientReligionLabels
} from '@/types/enums';

export interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  defaultValues?: Partial<ClientFormData>;
  onSubmitSuccess?: (data: ClientFormData) => void;
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
  const [isLoadingClient, setIsLoadingClient] = useState(mode === 'edit');
  const { openDialog, isOpen: dialogIsOpen, config: dialogConfig, closeDialog } = useConfirmationDialog();
  const { addToast } = useToast();
  const { createClient, loading: clientLoading } = useClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(createClientSchema),
    mode: mode === 'edit' ? 'onSubmit' : 'onChange',
    defaultValues: {
      fullName: '',
      gender: ClientGenderEnum.Male,
      birthPlace: '',
      birthDate: '',
      religion: ClientReligionEnum.Islam,
      occupation: '',
      education: ClientEducationEnum.Bachelor,
      educationMajor: '',
      address: '',
      phone: '',
      email: '',
      hobbies: '',
      maritalStatus: ClientMaritalStatusEnum.Single,
      spouseName: '',
      relationshipWithSpouse: undefined,

      firstVisit: true,
      previousVisitDetails: '',
      isMinor: false,
      school: '',
      grade: '',
      guardianFullName: '',
      guardianRelationship: undefined,
      guardianPhone: '',
      guardianAddress: '',
      guardianOccupation: '',
      guardianMaritalStatus: undefined,
      guardianLegalCustody: false,
      guardianCustodyDocsAttached: false,
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      emergencyContactAddress: '',
      ...defaultValues,
    },
  });

  // Reset form when modal opens/closes or defaultValues change
  React.useEffect(() => {
    if (open) {
      if (mode === 'edit') {
        // Load client data for edit mode
        const loadClientData = async () => {
          setIsLoadingClient(true);
          try {
            // Mock API call to get client data
            await new Promise(resolve => setTimeout(resolve, 500));

            // Reset with default values for edit mode
            reset({
              fullName: '',
              gender: ClientGenderEnum.Male,
              birthPlace: '',
              birthDate: '',
              religion: ClientReligionEnum.Islam,
              occupation: '',
              education: ClientEducationEnum.Bachelor,
              educationMajor: '',
              address: '',
              phone: '',
              email: '',
              hobbies: '',
              maritalStatus: ClientMaritalStatusEnum.Single,
              spouseName: '',
              relationshipWithSpouse: undefined,

              firstVisit: true,
              previousVisitDetails: '',
              isMinor: false,
              school: '',
              grade: '',
              guardianFullName: '',
              guardianRelationship: undefined,
              guardianPhone: '',
              guardianAddress: '',
              guardianOccupation: '',
              guardianMaritalStatus: undefined,
              guardianLegalCustody: false,
              guardianCustodyDocsAttached: false,
              emergencyContactName: '',
              emergencyContactPhone: '',
              emergencyContactRelationship: '',
              emergencyContactAddress: '',
              ...defaultValues, // Apply the default values passed from parent
            });

            // Don't force dirty state - let the form be clean initially
          } catch (error) {
            console.error('Failed to load client data:', error);
          } finally {
            setIsLoadingClient(false);
          }
        };

        loadClientData();
      } else {
        // Reset form for create mode
        reset({
          fullName: '',
          gender: ClientGenderEnum.Male,
          birthPlace: '',
          birthDate: '',
          religion: ClientReligionEnum.Islam,
          occupation: '',
          education: ClientEducationEnum.Bachelor,
          educationMajor: '',
          address: '',
          phone: '',
          email: '',
          hobbies: '',
          maritalStatus: ClientMaritalStatusEnum.Single,
          spouseName: '',
          relationshipWithSpouse: undefined,

          firstVisit: true,
          previousVisitDetails: '',
          isMinor: false,
          school: '',
          grade: '',
          guardianFullName: '',
          guardianRelationship: undefined,
          guardianPhone: '',
          guardianAddress: '',
          guardianOccupation: '',
          guardianMaritalStatus: undefined,
          guardianLegalCustody: false,
          guardianCustodyDocsAttached: false,
          emergencyContactName: '',
          emergencyContactPhone: '',
          emergencyContactRelationship: '',
          emergencyContactAddress: '',
          ...defaultValues,
        });
        setIsLoadingClient(false);
      }
    }
  }, [open, mode, defaultValues, reset]);

  const onSubmit = (data: ClientFormData) => {
    console.log('onSubmit called with data:', data);
    console.log('Mode:', mode);
    const titleText = mode === 'edit' ? 'Perbarui Data Klien' : 'Tambah Klien Baru';
    const confirmText = mode === 'edit' ? 'Perbarui Data' : 'Tambah Klien';

    console.log('Opening dialog...');
    openDialog({
      title: titleText,
      description: mode === 'edit'
        ? `Apakah Anda yakin ingin memperbarui data klien berikut?`
        : `Apakah Anda yakin ingin menambahkan klien baru dengan data berikut?`,
      confirmText: confirmText,
      cancelText: 'Tinjau Kembali',
      variant: mode === 'edit' ? 'info' : 'create',
      children: (
        <div className="space-y-3 py-2">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Nama:</span>
              <span className="text-sm font-semibold text-gray-900">{data.fullName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <span className="text-sm font-semibold text-gray-900">{data.email || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Telepon:</span>
              <span className="text-sm font-semibold text-gray-900">{data.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Tanggal Lahir:</span>
              <span className="text-sm font-semibold text-gray-900">{data.birthDate}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            {mode === 'edit'
              ? '✏️ Perubahan akan diterapkan segera setelah dikonfirmasi.'
              : '👤 Klien baru akan ditambahkan ke dalam sistem dengan status "Baru".'
            }
          </div>
        </div>
      ),
      onConfirm: () => submitForm(data)
    });
  };

  const submitForm = async (data: ClientFormData) => {
    try {
      if (mode === 'edit') {
        // Mock update API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success toast for edit mode
        addToast({
          type: 'success',
          title: 'Data Klien Berhasil Diperbarui!',
          message: `Data klien ${data.fullName} telah berhasil diperbarui.`,
          duration: 5000,
        });

        onSubmitSuccess?.(data);
        onOpenChange(false);
      } else {
        // Create new client using the API
        const result = await createClient(data);

        if (result) {
          addToast({
            type: 'success',
            title: 'Klien Baru Berhasil Ditambahkan!',
            message: `Klien ${data.fullName} telah berhasil ditambahkan ke sistem.`,
            duration: 8000,
          });

          onSubmitSuccess?.(data);
          onOpenChange(false);
        } else {
          addToast({
            type: 'error',
            title: 'Pembuatan Gagal',
            message: 'Gagal menambahkan klien. Silakan coba lagi.'
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      addToast({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: `Terjadi kesalahan tak terduga saat ${mode === 'edit' ? 'memperbarui' : 'menambahkan'} klien`
      });
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

  // Watch isMinor to conditionally show fields
  const isMinor = watch('isMinor');

  // Debug form state
  console.log('ClientFormModal Debug:', {
    mode,
    isDirty,
    isValid,
    errors: Object.keys(errors),
    isLoadingClient,
    isSubmitting,
    clientLoading
  });

  if (isLoadingClient) {
    return (
      <FormModal
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        size="2xl"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-2 text-gray-600">Memuat data klien...</span>
        </div>
      </FormModal>
    );
  }

  return (
    <>
      <FormModal
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        size="2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Dasar</h3>
            <p className="text-sm text-gray-600 mb-4">Informasi identitas dan data pribadi klien</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <Input id="fullName" placeholder="Nama lengkap klien" {...register('fullName')} />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>
              <div>
                <Label>Jenis Kelamin *</Label>
                <Select
                  value={watch('gender')}
                  onValueChange={val => setValue('gender', val as ClientFormData['gender'], { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientGenderEnum).map(gender => (
                      <SelectItem key={gender} value={gender}>{ClientGenderLabels[gender]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{(errors.gender as any).message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="birthPlace">Tempat Lahir *</Label>
                <Input id="birthPlace" placeholder="Contoh: Jakarta" {...register('birthPlace')} />
                {errors.birthPlace && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthPlace.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                <Input id="birthDate" type="date" {...register('birthDate')} />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label>Agama *</Label>
                <Select
                  value={watch('religion')}
                  onValueChange={val => setValue('religion', val as ClientFormData['religion'], { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih agama" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientReligionEnum).map(religion => (
                      <SelectItem key={religion} value={religion}>{ClientReligionLabels[religion]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.religion && (
                  <p className="mt-1 text-sm text-red-600">{(errors.religion as any).message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isMinor"
                  {...register('isMinor')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="isMinor" className="text-sm font-medium text-gray-700">
                  Klien adalah anak di bawah umur (di bawah 18 tahun)
                </Label>
              </div>
            </div>
          </div>

          {/* Guardian Information Section */}
          {isMinor && (
            <>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Sekolah</h3>
                <p className="text-sm text-gray-600 mb-4">Data pendidikan untuk klien di bawah umur</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="school">Nama Sekolah *</Label>
                    <Input id="school" placeholder="Nama sekolah" {...register('school')} />
                    {errors.school && (
                      <p className="mt-1 text-sm text-red-600">{errors.school.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="grade">Kelas *</Label>
                    <Input id="grade" placeholder="Contoh: Kelas 3 SD, Kelas 1 SMA" {...register('grade')} />
                    {errors.grade && (
                      <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Wali</h3>
                <p className="text-sm text-gray-600 mb-4">Data wali hukum untuk klien di bawah umur</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="guardianFullName">Nama Lengkap Wali *</Label>
                    <Input id="guardianFullName" placeholder="Nama lengkap wali" {...register('guardianFullName')} />
                    {errors.guardianFullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.guardianFullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Hubungan dengan Klien *</Label>
                    <Select
                      value={watch('guardianRelationship') || ''}
                      onValueChange={val => setValue('guardianRelationship', val as ClientFormData['guardianRelationship'], { shouldDirty: true, shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih hubungan" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ClientGuardianRelationshipEnum).map(relationship => (
                          <SelectItem key={relationship} value={relationship}>
                            {ClientGuardianRelationshipLabels[relationship]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.guardianRelationship && (
                      <p className="mt-1 text-sm text-red-600">{(errors.guardianRelationship as any).message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <Label htmlFor="guardianPhone">Nomor Telepon Wali *</Label>
                    <Input id="guardianPhone" placeholder="+6281234567890" {...register('guardianPhone')} />
                    {errors.guardianPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.guardianPhone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="guardianOccupation">Pekerjaan Wali *</Label>
                    <Input id="guardianOccupation" placeholder="Pekerjaan wali" {...register('guardianOccupation')} />
                    {errors.guardianOccupation && (
                      <p className="mt-1 text-sm text-red-600">{errors.guardianOccupation.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <Label>Status Pernikahan Wali</Label>
                    <Select
                      value={watch('guardianMaritalStatus') || ''}
                      onValueChange={val => setValue('guardianMaritalStatus', val as ClientFormData['guardianMaritalStatus'], { shouldDirty: true, shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status pernikahan" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ClientGuardianMaritalStatusEnum).map(status => (
                          <SelectItem key={status} value={status}>
                            {ClientGuardianMaritalStatusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.guardianMaritalStatus && (
                      <p className="mt-1 text-sm text-red-600">{(errors.guardianMaritalStatus as any).message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="guardianAddress">Alamat Wali</Label>
                    <Input id="guardianAddress" placeholder="Alamat wali (opsional)" {...register('guardianAddress')} />
                    {errors.guardianAddress && (
                      <p className="mt-1 text-sm text-red-600">{errors.guardianAddress.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="guardianLegalCustody"
                      {...register('guardianLegalCustody')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="guardianLegalCustody" className="text-sm font-medium text-gray-700">
                      Memiliki hak asuh hukum
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="guardianCustodyDocsAttached"
                      {...register('guardianCustodyDocsAttached')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="guardianCustodyDocsAttached" className="text-sm font-medium text-gray-700">
                      Dokumen hak asuh terlampir
                    </Label>
                  </div>
                </div>

                {/* Use Guardian as Emergency Contact Checkbox */}
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useGuardianAsEmergencyContact"
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Fill emergency contact fields with guardian data
                          setValue('emergencyContactName', watch('guardianFullName') || '', { shouldDirty: true, shouldValidate: true });
                          setValue('emergencyContactPhone', watch('guardianPhone') || '', { shouldDirty: true, shouldValidate: true });
                          setValue('emergencyContactRelationship', watch('guardianRelationship') ? ClientGuardianRelationshipLabels[watch('guardianRelationship') as keyof typeof ClientGuardianRelationshipLabels] : '', { shouldDirty: true, shouldValidate: true });
                          setValue('emergencyContactAddress', watch('guardianAddress') || '', { shouldDirty: true, shouldValidate: true });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="useGuardianAsEmergencyContact" className="text-sm font-medium text-gray-700">
                      Gunakan data wali sebagai kontak darurat
                    </Label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Contact Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Kontak</h3>
            <p className="text-sm text-gray-600 mb-4">Data kontak untuk komunikasi dengan klien</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Nomor Telepon *</Label>
                <Input id="phone" placeholder="+6281234567890" {...register('phone')} />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Alamat Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" {...register('email')} />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea id="address" placeholder="Alamat lengkap klien" {...register('address')} />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Professional & Personal Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Profesional & Pribadi</h3>
            <p className="text-sm text-gray-600 mb-4">Data pekerjaan, pendidikan, dan informasi pribadi lainnya</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="occupation">Pekerjaan *</Label>
                <Input id="occupation" placeholder="Pekerjaan" {...register('occupation')} />
                {errors.occupation && (
                  <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>
                )}
              </div>
              <div>
                <Label>Status Pernikahan *</Label>
                <Select
                  value={watch('maritalStatus')}
                  onValueChange={val => setValue('maritalStatus', val as ClientFormData['maritalStatus'], { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status pernikahan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientMaritalStatusEnum).map(status => (
                      <SelectItem key={status} value={status}>{ClientMaritalStatusLabels[status]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.maritalStatus && (
                  <p className="mt-1 text-sm text-red-600">{(errors.maritalStatus as any).message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label>Pendidikan *</Label>
                <Select
                  value={watch('education')}
                  onValueChange={val => setValue('education', val as ClientFormData['education'], { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientEducationEnum).map(education => (
                      <SelectItem key={education} value={education}>{ClientEducationLabels[education]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.education && (
                  <p className="mt-1 text-sm text-red-600">{(errors.education as any).message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="educationMajor">Jurusan/Program Studi</Label>
                <Input id="educationMajor" placeholder="Contoh: Teknik Informatika, Manajemen" {...register('educationMajor')} />
                {errors.educationMajor && (
                  <p className="mt-1 text-sm text-red-600">{errors.educationMajor.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="hobbies">Hobi</Label>
                <Input id="hobbies" placeholder="Hobi (opsional)" {...register('hobbies')} />
                {errors.hobbies && (
                  <p className="mt-1 text-sm text-red-600">{errors.hobbies.message}</p>
                )}
              </div>
            </div>

            {/* Spouse Information - Only show if married */}
            {watch('maritalStatus') === ClientMaritalStatusEnum.Married && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <Label htmlFor="spouseName">Nama Pasangan</Label>
                  <Input id="spouseName" placeholder="Nama pasangan" {...register('spouseName')} />
                  {errors.spouseName && (
                    <p className="mt-1 text-sm text-red-600">{errors.spouseName.message}</p>
                  )}
                </div>
                <div>
                  <Label>Hubungan dengan Pasangan</Label>
                  <Select
                    value={watch('relationshipWithSpouse') || ''}
                    onValueChange={val => setValue('relationshipWithSpouse', val as ClientFormData['relationshipWithSpouse'], { shouldDirty: true, shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hubungan" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ClientRelationshipWithSpouseEnum).map(rel => (
                        <SelectItem key={rel} value={rel}>{ClientRelationshipWithSpouseLabels[rel]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.relationshipWithSpouse && (
                    <p className="mt-1 text-sm text-red-600">{(errors.relationshipWithSpouse as any).message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contact Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Kontak Darurat</h3>
            <p className="text-sm text-gray-600 mb-4">Data kontak darurat untuk keadaan darurat</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="emergencyContactName">Nama Kontak Darurat *</Label>
                <Input
                  id="emergencyContactName"
                  placeholder="Nama lengkap kontak darurat"
                  {...register('emergencyContactName')}
                />
                {errors.emergencyContactName && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Nomor Telepon Kontak Darurat</Label>
                <Input
                  id="emergencyContactPhone"
                  placeholder="+6281234567890"
                  {...register('emergencyContactPhone')}
                />
                {errors.emergencyContactPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="emergencyContactRelationship">Hubungan dengan Klien *</Label>
                <Input
                  id="emergencyContactRelationship"
                  placeholder="Contoh: Suami, Istri, Anak, Orang Tua"
                  {...register('emergencyContactRelationship')}
                />
                {errors.emergencyContactRelationship && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContactRelationship.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="emergencyContactAddress">Alamat Kontak Darurat</Label>
                <Input
                  id="emergencyContactAddress"
                  placeholder="Alamat kontak darurat (opsional)"
                  {...register('emergencyContactAddress')}
                />
                {errors.emergencyContactAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContactAddress.message}</p>
                )}
              </div>
            </div>
          </div>







          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Kunjungan Pertama *</Label>
              <Select
                value={watch('firstVisit') ? 'true' : 'false'}
                onValueChange={val => setValue('firstVisit', val === 'true', { shouldDirty: true, shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status kunjungan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ya, kunjungan pertama</SelectItem>
                  <SelectItem value="false">Tidak, sudah pernah berkunjung</SelectItem>
                </SelectContent>
              </Select>
              {errors.firstVisit && (
                <p className="mt-1 text-sm text-red-600">{(errors.firstVisit as any).message}</p>
              )}
            </div>
          </div>

          {!watch('firstVisit') && (
            <div>
              <Label htmlFor="previousVisitDetails">Detail Kunjungan Sebelumnya</Label>
              <Textarea id="previousVisitDetails" rows={3} placeholder="Jelaskan detail kunjungan sebelumnya" {...register('previousVisitDetails')} />
              {errors.previousVisitDetails && (
                <p className="mt-1 text-sm text-red-600">{errors.previousVisitDetails.message}</p>
              )}
            </div>
          )}



          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                clientLoading ||
                isSubmitting ||
                !isValid ||
                !isDirty
              }
              onClick={() => {
                console.log('Submit button clicked');
                console.log('Form state:', { isSubmitting, clientLoading, isDirty, isValid, mode });
                console.log('Form errors:', errors);
                console.log('Form values:', watch());
              }}
            >
              {clientLoading || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {mode === 'edit' ? 'Menyimpan...' : 'Menyimpan...'}
                </>
              ) : !isValid || !isDirty ? (
                mode === 'edit' ? 'Lengkapi Form untuk Update' : 'Lengkapi Form untuk Melanjutkan'
              ) : (
                mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Klien'
              )}
            </Button>
          </div>
        </form>
      </FormModal>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialogIsOpen}
        onClose={closeDialog}
        {...dialogConfig}
      />
    </>
  );
}

export default ClientFormModal;