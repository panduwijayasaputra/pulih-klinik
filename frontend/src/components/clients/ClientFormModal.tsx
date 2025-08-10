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
import { 
  ClientEducationEnum, 
  ClientGenderEnum, 
  ClientReligionEnum, 
  ClientMaritalStatusEnum, 
  ClientRelationshipWithSpouseEnum,
  ClientGuardianRelationshipEnum,
  ClientGuardianMaritalStatusEnum,
  ClientGenderLabels,
  ClientMaritalStatusLabels,
  ClientRelationshipWithSpouseLabels,
  ClientReligionLabels,
  ClientEducationLabels,
  ClientGuardianRelationshipLabels,
  ClientGuardianMaritalStatusLabels
} from '@/types/enums';

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
      emergencyContact: '',
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
      ...defaultValues,
    },
  });

  // Reset form when modal opens/closes or defaultValues change
  React.useEffect(() => {
    if (open) {
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
        emergencyContact: '',
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

  // Watch isMinor to conditionally show fields
  const isMinor = watch('isMinor');

  return (
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
                onValueChange={val => setValue('gender', val as ClientCreateData['gender'], { shouldDirty: true, shouldValidate: true })}
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
                onValueChange={val => setValue('religion', val as ClientCreateData['religion'], { shouldDirty: true, shouldValidate: true })}
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
                onValueChange={val => setValue('maritalStatus', val as ClientCreateData['maritalStatus'], { shouldDirty: true, shouldValidate: true })}
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
                onValueChange={val => setValue('education', val as ClientCreateData['education'], { shouldDirty: true, shouldValidate: true })}
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
                  onValueChange={val => setValue('relationshipWithSpouse', val as ClientCreateData['relationshipWithSpouse'], { shouldDirty: true, shouldValidate: true })}
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

        {/* Minor-specific fields */}
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
                    value={watch('guardianRelationship')}
                    onValueChange={val => setValue('guardianRelationship', val as ClientCreateData['guardianRelationship'], { shouldDirty: true, shouldValidate: true })}
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
                    value={watch('guardianMaritalStatus')}
                    onValueChange={val => setValue('guardianMaritalStatus', val as ClientCreateData['guardianMaritalStatus'], { shouldDirty: true, shouldValidate: true })}
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
            </div>
          </>
        )}

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

        <div>
          <Label htmlFor="address">Alamat *</Label>
          <Textarea id="address" rows={3} placeholder="Alamat lengkap" {...register('address')} />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="emergencyContact">Kontak Darurat</Label>
            <Input id="emergencyContact" placeholder="Kontak darurat" {...register('emergencyContact')} />
            {errors.emergencyContact && (
              <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.message}</p>
            )}
          </div>
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
