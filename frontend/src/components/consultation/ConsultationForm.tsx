'use client';

import React, { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import { 
  ConsultationFormTypeEnum,
  ConsultationFormTypeLabels,
  ConsultationStatusEnum,
  ConsultationStatusLabels,
} from '@/types/consultation';
import { ConsultationFormData } from '@/schemas/consultationSchema';
import { Client } from '@/types/client';

export interface ConsultationFormProps {
  form: UseFormReturn<ConsultationFormData>;
  onSubmit: (data: ConsultationFormData) => Promise<void>;
  onSave: (status?: ConsultationStatusEnum) => Promise<void>;
  isSubmitting: boolean;
  isLoading: boolean;
  mode?: 'create' | 'edit';
  allowTypeChange?: boolean;
  client?: Client; // Optional client data for pre-population
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  form,
  onSubmit,
  onSave,
  isSubmitting,
  isLoading,
  mode = 'create',
  allowTypeChange = true,
  client,
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty, isValid } } = form;
  
  const formType = watch('formType');
  const previousTherapyExperience = watch('previousTherapyExperience');
  const currentMedications = watch('currentMedications');

  // Handle form type change
  const handleFormTypeChange = useCallback((newFormType: ConsultationFormTypeEnum) => {
    if (!allowTypeChange) return;
    setValue('formType', newFormType, { shouldDirty: true, shouldValidate: true });
  }, [setValue, allowTypeChange]);

  // Handle save as draft
  const handleSaveDraft = useCallback(async () => {
    await onSave(ConsultationStatusEnum.Draft);
  }, [onSave]);

  // Handle save as completed
  const handleSaveCompleted = useCallback(async () => {
    await onSave(ConsultationStatusEnum.Completed);
  }, [onSave]);

  // Helper function to calculate age from birthDate
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. Client Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Klien</h3>
          <p className="text-sm text-gray-600 mb-4">Data klien (dapat diedit jika ada ketidaksesuaian)</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label>Nama Lengkap *</Label>
              <Input 
                defaultValue={client?.fullName || client?.name || ''}
                placeholder="Nama lengkap klien"
                className="bg-gray-50"
                readOnly
              />
            </div>
            
            <div>
              <Label>Jenis Kelamin *</Label>
              <Input 
                defaultValue={client?.gender || ''}
                className="bg-gray-50"
                readOnly
              />
            </div>
            
            <div>
              <Label>Tempat, Tanggal Lahir *</Label>
              <Input 
                defaultValue={client ? `${client.birthPlace || ''}, ${client.birthDate || ''}` : ''}
                className="bg-gray-50"
                readOnly
              />
            </div>
            
            <div>
              <Label>Umur</Label>
              <Input 
                defaultValue={client?.birthDate ? calculateAge(client.birthDate).toString() + ' tahun' : ''}
                className="bg-gray-50"
                readOnly
              />
            </div>
            
            <div>
              <Label>Agama *</Label>
              <Input 
                defaultValue={client?.religion || ''}
                className="bg-gray-50"
                readOnly
              />
            </div>
            
            <div>
              <Label>Pekerjaan *</Label>
              <Input 
                defaultValue={client?.occupation || ''}
                className="bg-gray-50"
                readOnly
              />
            </div>
            
            <div>
              <Label>Pendidikan *</Label>
              <Input 
                defaultValue={client?.education || ''}
                className="bg-gray-50"
                readOnly
              />
            </div>
            
            <div>
              <Label>Telepon *</Label>
              <Input 
                defaultValue={client?.phone || ''}
                className="bg-gray-50"
                readOnly
              />
            </div>
            
            <div>
              <Label>Email</Label>
              <Input 
                defaultValue={client?.email || ''}
                className="bg-gray-50"
                readOnly
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <Label>Alamat *</Label>
              <Textarea 
                defaultValue={client?.address || ''}
                className="bg-gray-50"
                readOnly
                rows={2}
              />
            </div>
            
            <div>
              <Label>Hobi</Label>
              <Textarea 
                defaultValue={client?.hobbies || ''}
                className="bg-gray-50"
                readOnly
                rows={2}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <Label>Status Pernikahan *</Label>
              <Input 
                defaultValue={client?.maritalStatus || ''}
                className="bg-gray-50"
                readOnly
              />
            </div>
            
            {client?.spouseName && (
              <div>
                <Label>Nama Pasangan</Label>
                <Input 
                  defaultValue={client.spouseName}
                  className="bg-gray-50"
                  readOnly
                />
              </div>
            )}
            
            <div>
              <Label>Kontak Darurat</Label>
              <Input 
                defaultValue={client?.emergencyContact || ''}
                className="bg-gray-50"
                readOnly
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <Label>Kunjungan Pertama?</Label>
              <Select 
                defaultValue={client?.firstVisit ? 'true' : 'false'}
                disabled
              >
                <SelectTrigger className="bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ya</SelectItem>
                  <SelectItem value="false">Tidak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {!client?.firstVisit && (
              <div>
                <Label>Detail Kunjungan Sebelumnya</Label>
                <Textarea 
                  defaultValue={client?.previousVisitDetails || ''}
                  className="bg-gray-50"
                  readOnly
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>

        {/* 2. Session Information */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Sesi</h3>
          <p className="text-sm text-gray-600 mb-4">Detail dasar sesi konsultasi</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label>Jenis Konsultasi *</Label>
              <Select
                value={formType}
                onValueChange={handleFormTypeChange}
                disabled={!allowTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis konsultasi" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ConsultationFormTypeEnum).map(type => (
                    <SelectItem key={type} value={type}>
                      {ConsultationFormTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.formType && (
                <p className="mt-1 text-sm text-red-600">{errors.formType.message}</p>
              )}
            </div>
            
            <div>
              <Label>Status Konsultasi *</Label>
              <Select
                value={watch('status')}
                onValueChange={(val) => setValue('status', val as ConsultationStatusEnum, { shouldDirty: true, shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ConsultationStatusEnum).map(status => (
                    <SelectItem key={status} value={status}>
                      {ConsultationStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sessionDate">Tanggal Sesi *</Label>
              <Input 
                id="sessionDate" 
                type="datetime-local" 
                {...register('sessionDate')}
                className="mt-1"
              />
              {errors.sessionDate && (
                <p className="mt-1 text-sm text-red-600">{errors.sessionDate.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="sessionDuration">Durasi Sesi (menit) *</Label>
              <Input 
                id="sessionDuration" 
                type="number" 
                min="15" 
                max="180" 
                step="15" 
                {...register('sessionDuration', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.sessionDuration && (
                <p className="mt-1 text-sm text-red-600">{errors.sessionDuration.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Consultation Reason Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Alasan Konsultasi</h3>
          <p className="text-sm text-gray-600 mb-4">Keluhan dan masalah utama yang dialami klien</p>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="primaryConcern">Alasan Utama Konsultasi *</Label>
              <Textarea 
                id="primaryConcern"
                {...register('primaryConcern')}
                placeholder="Jelaskan keluhan/masalah utama yang ingin dikonsultasikan..."
                rows={4}
                className="mt-1"
              />
              {errors.primaryConcern && (
                <p className="mt-1 text-sm text-red-600">{errors.primaryConcern.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Durasi Masalah *</Label>
                <Select 
                  value={watch('symptomDuration') || ''}
                  onValueChange={(val) => setValue('symptomDuration', val, { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih durasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<1 month">Kurang dari 1 bulan</SelectItem>
                    <SelectItem value="1-3 months">1-3 bulan</SelectItem>
                    <SelectItem value="3-6 months">3-6 bulan</SelectItem>
                    <SelectItem value=">6 months">Lebih dari 6 bulan</SelectItem>
                  </SelectContent>
                </Select>
                {errors.symptomDuration && (
                  <p className="mt-1 text-sm text-red-600">{errors.symptomDuration.message}</p>
                )}
              </div>
              
              <div>
                <Label>Frekuensi Masalah</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Harian</SelectItem>
                    <SelectItem value="Weekly">Mingguan</SelectItem>
                    <SelectItem value="Monthly">Bulanan</SelectItem>
                    <SelectItem value="Rare">Jarang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Tingkat Gangguan *</Label>
                <Select 
                  value={watch('symptomSeverity')?.toString() || ''}
                  onValueChange={(val) => setValue('symptomSeverity', parseInt(val) as 1|2|3|4|5, { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tidak mengganggu</SelectItem>
                    <SelectItem value="2">Sedikit mengganggu</SelectItem>
                    <SelectItem value="3">Cukup mengganggu</SelectItem>
                    <SelectItem value="4">Sangat mengganggu</SelectItem>
                    <SelectItem value="5">Sangat sangat mengganggu</SelectItem>
                  </SelectContent>
                </Select>
                {errors.symptomSeverity && (
                  <p className="mt-1 text-sm text-red-600">{errors.symptomSeverity.message}</p>
                )}
              </div>
            </div>

            {/* Emotion Scale */}
            <div>
              <Label>Skala Emosi (0-10)</Label>
              <p className="text-sm text-gray-600 mb-3">Berikan penilaian untuk setiap emosi yang dirasakan saat ini</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Kecemasan', key: 'anxiety' },
                  { label: 'Depresi', key: 'depression' },
                  { label: 'Marah', key: 'anger' },
                  { label: 'Frustrasi', key: 'frustration' },
                  { label: 'Sedih', key: 'sadness' },
                  { label: 'Bahagia', key: 'happiness' },
                  { label: 'Tenang', key: 'calmness' },
                  { label: 'Stress', key: 'stress' }
                ].map(emotion => (
                  <div key={emotion.key} className="space-y-2">
                    <Label className="text-sm">{emotion.label}</Label>
                    <Input 
                      type="range" 
                      min="0" 
                      max="10" 
                      step="1"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Psychological History Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Riwayat Psikologis</h3>
          <p className="text-sm text-gray-600 mb-4">Riwayat kesehatan mental dan pengobatan sebelumnya</p>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Pernah mengalami masalah serupa? *</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="previousTherapyExperience-yes"
                      checked={previousTherapyExperience === true}
                      onCheckedChange={(checked) => setValue('previousTherapyExperience', checked === true, { shouldDirty: true, shouldValidate: true })}
                    />
                    <Label htmlFor="previousTherapyExperience-yes">Ya</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="previousTherapyExperience-no"
                      checked={previousTherapyExperience === false}
                      onCheckedChange={(checked) => setValue('previousTherapyExperience', checked !== true, { shouldDirty: true, shouldValidate: true })}
                    />
                    <Label htmlFor="previousTherapyExperience-no">Tidak</Label>
                  </div>
                </div>
                {errors.previousTherapyExperience && (
                  <p className="mt-1 text-sm text-red-600">{errors.previousTherapyExperience.message}</p>
                )}
              </div>

              <div>
                <Label>Sedang mengonsumsi obat? *</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="currentMedications-yes"
                      checked={currentMedications === true}
                      onCheckedChange={(checked) => setValue('currentMedications', checked === true, { shouldDirty: true, shouldValidate: true })}
                    />
                    <Label htmlFor="currentMedications-yes">Ya</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="currentMedications-no"
                      checked={currentMedications === false}
                      onCheckedChange={(checked) => setValue('currentMedications', checked !== true, { shouldDirty: true, shouldValidate: true })}
                    />
                    <Label htmlFor="currentMedications-no">Tidak</Label>
                  </div>
                </div>
                {errors.currentMedications && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentMedications.message}</p>
                )}
              </div>
            </div>

            {previousTherapyExperience && (
              <div>
                <Label htmlFor="previousTherapyDetails">Detail Pengalaman Sebelumnya *</Label>
                <Textarea 
                  id="previousTherapyDetails"
                  {...register('previousTherapyDetails')}
                  placeholder="Jelaskan kapan, dimana, dan bagaimana pengalaman terapi/konseling sebelumnya..."
                  rows={3}
                  className="mt-1"
                />
                {errors.previousTherapyDetails && (
                  <p className="mt-1 text-sm text-red-600">{errors.previousTherapyDetails.message}</p>
                )}
              </div>
            )}

            {currentMedications && (
              <div>
                <Label htmlFor="currentMedicationsDetails">Detail Obat yang Dikonsumsi *</Label>
                <Textarea 
                  id="currentMedicationsDetails"
                  {...register('currentMedicationsDetails')}
                  placeholder="Sebutkan nama obat, dosis, dan frekuensi konsumsi..."
                  rows={3}
                  className="mt-1"
                />
                {errors.currentMedicationsDetails && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentMedicationsDetails.message}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Kualitas Tidur</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kualitas tidur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Baik</SelectItem>
                    <SelectItem value="Fair">Lumayan</SelectItem>
                    <SelectItem value="Poor">Buruk</SelectItem>
                    <SelectItem value="Disturbed">Terganggu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Frekuensi Pikiran untuk Menyakiti Diri</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Never">Tidak pernah</SelectItem>
                    <SelectItem value="Sometimes">Kadang-kadang</SelectItem>
                    <SelectItem value="Often">Sering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Drug Dependency Specific Section */}
        {formType === ConsultationFormTypeEnum.DrugAddiction && (
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Riwayat Penggunaan Zat</h3>
            <p className="text-sm text-gray-600 mb-4">Informasi detail mengenai penggunaan zat dan riwayat ketergantungan</p>
            
            <div className="space-y-6">
              {/* Substance History */}
              <div>
                <Label htmlFor="primarySubstance">Zat Utama yang Digunakan *</Label>
                <Input 
                  id="primarySubstance"
                  {...register('primarySubstance')}
                  placeholder="Contoh: Alkohol, Ganja, Kokain, dll."
                  className="mt-1"
                />
                {errors.primarySubstance && (
                  <p className="mt-1 text-sm text-red-600">{errors.primarySubstance.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="additionalSubstances">Zat Lain yang Pernah Digunakan</Label>
                <Textarea 
                  id="additionalSubstances"
                  placeholder="Sebutkan zat lain yang pernah digunakan (pisahkan dengan koma)"
                  rows={2}
                  className="mt-1"
                  onChange={(e) => {
                    const substances = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                    setValue('additionalSubstances', substances, { shouldDirty: true, shouldValidate: true });
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="ageOfFirstUse">Usia Pertama Kali Menggunakan</Label>
                  <Input 
                    id="ageOfFirstUse"
                    type="number"
                    min="1"
                    max="100"
                    {...register('ageOfFirstUse', { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="frequencyOfUse">Frekuensi Penggunaan</Label>
                  <Input 
                    id="frequencyOfUse"
                    {...register('frequencyOfUse')}
                    placeholder="Contoh: Setiap hari, 2-3x seminggu"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="quantityPerUse">Jumlah per Penggunaan</Label>
                  <Input 
                    id="quantityPerUse"
                    {...register('quantityPerUse')}
                    placeholder="Contoh: 1 botol, 2 gram"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="lastUseDate">Tanggal Terakhir Menggunakan</Label>
                  <Input 
                    id="lastUseDate"
                    type="date"
                    {...register('lastUseDate')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="attemptsToQuit">Jumlah Percobaan Berhenti</Label>
                  <Input 
                    id="attemptsToQuit"
                    type="number"
                    min="0"
                    {...register('attemptsToQuit', { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="withdrawalSymptoms">Gejala Withdrawal yang Dialami</Label>
                <Textarea 
                  id="withdrawalSymptoms"
                  placeholder="Contoh: Gemetar, berkeringat, mual, gelisah, dll. (pisahkan dengan koma)"
                  rows={3}
                  className="mt-1"
                  onChange={(e) => {
                    const symptoms = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                    setValue('withdrawalSymptoms', symptoms, { shouldDirty: true, shouldValidate: true });
                  }}
                />
              </div>

              <div>
                <Label>Tingkat Toleransi</Label>
                <p className="text-sm text-gray-600 mb-2">Seberapa banyak zat yang dibutuhkan untuk merasakan efek yang sama</p>
                <Select 
                  value={watch('toleranceLevel')?.toString() || ''}
                  onValueChange={(val) => setValue('toleranceLevel', parseInt(val) as 1|2|3|4|5, { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat toleransi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sangat rendah</SelectItem>
                    <SelectItem value="2">Rendah</SelectItem>
                    <SelectItem value="3">Sedang</SelectItem>
                    <SelectItem value="4">Tinggi</SelectItem>
                    <SelectItem value="5">Sangat tinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="triggerSituations">Situasi Pemicu Penggunaan</Label>
                <Textarea 
                  id="triggerSituations"
                  placeholder="Contoh: Stress kerja, masalah keluarga, tekanan teman, dll. (pisahkan dengan koma)"
                  rows={3}
                  className="mt-1"
                  onChange={(e) => {
                    const triggers = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                    setValue('triggerSituations', triggers, { shouldDirty: true, shouldValidate: true });
                  }}
                />
              </div>

              <div>
                <Label htmlFor="impactOnDailyLife">Dampak pada Kehidupan Sehari-hari</Label>
                <Textarea 
                  id="impactOnDailyLife"
                  {...register('impactOnDailyLife')}
                  placeholder="Jelaskan bagaimana penggunaan zat mempengaruhi pekerjaan, keluarga, kesehatan, keuangan, dll."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="financialImpact">Dampak Finansial *</Label>
                <Textarea 
                  id="financialImpact"
                  {...register('financialImpact')}
                  placeholder="Jelaskan dampak finansial dari penggunaan zat (biaya, hutang, kehilangan pekerjaan, dll.)"
                  rows={3}
                  className="mt-1"
                />
                {errors.financialImpact && (
                  <p className="mt-1 text-sm text-red-600">{errors.financialImpact.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Pernah Mengikuti Program Rehabilitasi?</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="previousTreatmentPrograms-yes"
                        checked={watch('previousTreatmentPrograms') === true}
                        onCheckedChange={(checked) => setValue('previousTreatmentPrograms', checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="previousTreatmentPrograms-yes">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="previousTreatmentPrograms-no"
                        checked={watch('previousTreatmentPrograms') === false}
                        onCheckedChange={(checked) => setValue('previousTreatmentPrograms', checked !== true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="previousTreatmentPrograms-no">Tidak</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Ada Masalah Hukum Terkait?</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="legalIssuesRelated-yes"
                        checked={watch('legalIssuesRelated') === true}
                        onCheckedChange={(checked) => setValue('legalIssuesRelated', checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="legalIssuesRelated-yes">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="legalIssuesRelated-no"
                        checked={watch('legalIssuesRelated') === false}
                        onCheckedChange={(checked) => setValue('legalIssuesRelated', checked !== true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="legalIssuesRelated-no">Tidak</Label>
                    </div>
                  </div>
                </div>
              </div>

              {watch('previousTreatmentPrograms') && (
                <div>
                  <Label htmlFor="previousTreatmentDetails">Detail Program Rehabilitasi Sebelumnya</Label>
                  <Textarea 
                    id="previousTreatmentDetails"
                    {...register('previousTreatmentDetails')}
                    placeholder="Jelaskan kapan, dimana, berapa lama, dan hasil dari program rehabilitasi sebelumnya..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              )}

              {watch('legalIssuesRelated') && (
                <div>
                  <Label htmlFor="legalIssuesDetails">Detail Masalah Hukum</Label>
                  <Textarea 
                    id="legalIssuesDetails"
                    {...register('legalIssuesDetails')}
                    placeholder="Jelaskan masalah hukum yang dialami terkait penggunaan zat..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="currentSobrietyPeriod">Periode Bebas Zat Saat Ini</Label>
                <Input 
                  id="currentSobrietyPeriod"
                  {...register('currentSobrietyPeriod')}
                  placeholder="Contoh: 3 hari, 2 minggu, 1 bulan"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Minor Client Specific Section */}
        {formType === ConsultationFormTypeEnum.Minor && (
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Khusus Anak</h3>
            <p className="text-sm text-gray-600 mb-4">Informasi tambahan untuk konsultasi anak di bawah umur</p>
            
            <div className="space-y-6">
              {/* Guardian Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-4">Informasi Wali/Orang Tua</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Wali yang Hadir Saat Konsultasi?</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="guardianPresent-yes"
                          checked={watch('guardianPresent') === true}
                          onCheckedChange={(checked) => setValue('guardianPresent', checked === true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="guardianPresent-yes">Ya</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="guardianPresent-no"
                          checked={watch('guardianPresent') === false}
                          onCheckedChange={(checked) => setValue('guardianPresent', checked !== true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="guardianPresent-no">Tidak</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="guardianRelationship">Hubungan dengan Anak</Label>
                    <Select 
                      value={watch('guardianRelationship') || ''}
                      onValueChange={(val) => setValue('guardianRelationship', val, { shouldDirty: true, shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih hubungan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Father">Ayah</SelectItem>
                        <SelectItem value="Mother">Ibu</SelectItem>
                        <SelectItem value="Legal guardian">Wali resmi</SelectItem>
                        <SelectItem value="Other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="guardianConcerns">Kekhawatiran Wali/Orang Tua</Label>
                  <Textarea 
                    id="guardianConcerns"
                    {...register('guardianConcerns')}
                    placeholder="Jelaskan kekhawatiran utama orang tua/wali terhadap anak..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* School Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-4">Informasi Sekolah</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currentGradeLevel">Tingkat Kelas Saat Ini</Label>
                    <Input 
                      id="currentGradeLevel"
                      {...register('currentGradeLevel')}
                      placeholder="Contoh: Kelas 3 SD, Kelas 1 SMP"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Prestasi Akademik</Label>
                    <Select 
                      value={watch('academicPerformance')?.toString() || ''}
                      onValueChange={(val) => setValue('academicPerformance', parseInt(val) as 1|2|3|4|5, { shouldDirty: true, shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih prestasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Sangat baik</SelectItem>
                        <SelectItem value="4">Baik</SelectItem>
                        <SelectItem value="3">Cukup</SelectItem>
                        <SelectItem value="2">Kurang</SelectItem>
                        <SelectItem value="1">Sangat kurang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label>Ada Masalah Perilaku di Sekolah?</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="schoolBehaviorIssues-yes"
                          checked={watch('schoolBehaviorIssues') === true}
                          onCheckedChange={(checked) => setValue('schoolBehaviorIssues', checked === true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="schoolBehaviorIssues-yes">Ya</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="schoolBehaviorIssues-no"
                          checked={watch('schoolBehaviorIssues') === false}
                          onCheckedChange={(checked) => setValue('schoolBehaviorIssues', checked !== true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="schoolBehaviorIssues-no">Tidak</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Ada Riwayat Bullying?</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="bullyingHistory-yes"
                          checked={watch('bullyingHistory') === true}
                          onCheckedChange={(checked) => setValue('bullyingHistory', checked === true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="bullyingHistory-yes">Ya</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="bullyingHistory-no"
                          checked={watch('bullyingHistory') === false}
                          onCheckedChange={(checked) => setValue('bullyingHistory', checked !== true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="bullyingHistory-no">Tidak</Label>
                      </div>
                    </div>
                  </div>
                </div>

                {watch('schoolBehaviorIssues') && (
                  <div className="mt-4">
                    <Label htmlFor="schoolBehaviorDetails">Detail Masalah Perilaku di Sekolah</Label>
                    <Textarea 
                      id="schoolBehaviorDetails"
                      {...register('schoolBehaviorDetails')}
                      placeholder="Jelaskan masalah perilaku yang dilaporkan dari sekolah..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="mt-4">
                  <Label htmlFor="teacherConcerns">Kekhawatiran Guru</Label>
                  <Textarea 
                    id="teacherConcerns"
                    {...register('teacherConcerns')}
                    placeholder="Masukan dari guru atau pihak sekolah tentang anak..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Family and Social */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-4">Keluarga dan Sosial</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="familyStructure">Struktur Keluarga</Label>
                    <Input 
                      id="familyStructure"
                      {...register('familyStructure')}
                      placeholder="Contoh: Keluarga inti lengkap, orang tua bercerai, tinggal dengan nenek"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="siblingRelationships">Hubungan dengan Saudara</Label>
                    <Textarea 
                      id="siblingRelationships"
                      {...register('siblingRelationships')}
                      placeholder="Jelaskan hubungan anak dengan saudara kandung/tiri..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="peerRelationships">Hubungan dengan Teman Sebaya</Label>
                    <Textarea 
                      id="peerRelationships"
                      {...register('peerRelationships')}
                      placeholder="Bagaimana anak berinteraksi dengan teman-temannya..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Ada Konflik Keluarga?</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="familyConflicts-yes"
                            checked={watch('familyConflicts') === true}
                            onCheckedChange={(checked) => setValue('familyConflicts', checked === true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="familyConflicts-yes">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="familyConflicts-no"
                            checked={watch('familyConflicts') === false}
                            onCheckedChange={(checked) => setValue('familyConflicts', checked !== true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="familyConflicts-no">Tidak</Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Ada Kesulitan Sosial?</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="socialDifficulties-yes"
                            checked={watch('socialDifficulties') === true}
                            onCheckedChange={(checked) => setValue('socialDifficulties', checked === true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="socialDifficulties-yes">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="socialDifficulties-no"
                            checked={watch('socialDifficulties') === false}
                            onCheckedChange={(checked) => setValue('socialDifficulties', checked !== true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="socialDifficulties-no">Tidak</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {watch('socialDifficulties') && (
                    <div>
                      <Label htmlFor="socialDifficultiesDetails">Detail Kesulitan Sosial</Label>
                      <Textarea 
                        id="socialDifficultiesDetails"
                        {...register('socialDifficultiesDetails')}
                        placeholder="Jelaskan kesulitan sosial yang dialami anak..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Developmental Assessment */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-4">Perkembangan dan Perilaku</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="developmentalMilestones">Milestone Perkembangan</Label>
                    <Textarea 
                      id="developmentalMilestones"
                      {...register('developmentalMilestones')}
                      placeholder="Informasi tentang perkembangan motorik, bahasa, kognitif anak..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Ada Masalah Perhatian/Konsentrasi?</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="attentionConcerns-yes"
                            checked={watch('attentionConcerns') === true}
                            onCheckedChange={(checked) => setValue('attentionConcerns', checked === true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="attentionConcerns-yes">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="attentionConcerns-no"
                            checked={watch('attentionConcerns') === false}
                            onCheckedChange={(checked) => setValue('attentionConcerns', checked !== true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="attentionConcerns-no">Tidak</Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Ada Masalah Perilaku?</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="behavioralConcerns-yes"
                            checked={watch('behavioralConcerns') === true}
                            onCheckedChange={(checked) => setValue('behavioralConcerns', checked === true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="behavioralConcerns-yes">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="behavioralConcerns-no"
                            checked={watch('behavioralConcerns') === false}
                            onCheckedChange={(checked) => setValue('behavioralConcerns', checked !== true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="behavioralConcerns-no">Tidak</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {watch('attentionConcerns') && (
                    <div>
                      <Label htmlFor="attentionDetails">Detail Masalah Perhatian/Konsentrasi</Label>
                      <Textarea 
                        id="attentionDetails"
                        {...register('attentionDetails')}
                        placeholder="Jelaskan masalah perhatian atau konsentrasi yang dialami..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {watch('behavioralConcerns') && (
                    <div>
                      <Label htmlFor="behavioralDetails">Detail Masalah Perilaku</Label>
                      <Textarea 
                        id="behavioralDetails"
                        {...register('behavioralDetails')}
                        placeholder="Jelaskan masalah perilaku yang dialami anak..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Goals and Treatment Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tujuan dan Harapan</h3>
          <p className="text-sm text-gray-600 mb-4">Apa yang ingin dicapai dari proses terapi ini</p>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="treatmentGoals">Tujuan Terapi *</Label>
              <Textarea 
                id="treatmentGoals"
                placeholder="Tuliskan tujuan-tujuan yang ingin dicapai dari terapi ini (pisahkan dengan enter untuk multiple goals)..."
                rows={4}
                className="mt-1"
                onChange={(e) => {
                  const goals = e.target.value.split('\n').filter(goal => goal.trim() !== '');
                  setValue('treatmentGoals', goals, { shouldDirty: true, shouldValidate: true });
                }}
              />
              {errors.treatmentGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.treatmentGoals.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="clientExpectations">Harapan dari Terapi</Label>
              <Textarea 
                id="clientExpectations"
                {...register('clientExpectations')}
                placeholder="Apa yang Anda harapkan dari proses terapi ini..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Preferensi Jenis Terapi</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih preferensi terapi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CBT">Cognitive Behavioral Therapy (CBT)</SelectItem>
                  <SelectItem value="General counseling">Konseling Umum</SelectItem>
                  <SelectItem value="Undecided">Belum yakin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 6. Notes and Assessment */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Catatan dan Penilaian</h3>
          <p className="text-sm text-gray-600 mb-4">Catatan terapis dan rekomendasi</p>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="consultationNotes">Catatan Konsultasi</Label>
              <Textarea 
                id="consultationNotes" 
                {...register('consultationNotes')}
                placeholder="Catatan umum tentang sesi konsultasi, observasi, dan hal-hal penting lainnya..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="initialAssessment">Penilaian Awal</Label>
              <Textarea 
                id="initialAssessment"
                {...register('initialAssessment')}
                placeholder="Penilaian awal kondisi klien berdasarkan informasi yang diperoleh..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="recommendedTreatmentPlan">Rencana Terapi yang Direkomendasikan</Label>
              <Textarea 
                id="recommendedTreatmentPlan"
                {...register('recommendedTreatmentPlan')}
                placeholder="Rencana terapi yang direkomendasikan berdasarkan penilaian..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting || isLoading}
          >
            Simpan sebagai Draft
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveCompleted}
            disabled={isSubmitting || isLoading || !isValid}
          >
            Simpan dan Selesaikan
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting || isLoading || !isDirty || !isValid}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;