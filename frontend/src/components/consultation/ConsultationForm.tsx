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
import { useAuth } from '@/hooks/useAuth';
import {
  SYMPTOM_DURATION_OPTIONS,
  PROBLEM_FREQUENCY_OPTIONS,
  SYMPTOM_SEVERITY_OPTIONS,
  EMOTION_SCALE_OPTIONS,
  SLEEP_QUALITY_OPTIONS,
  SELF_HARM_FREQUENCY_OPTIONS,
  SUBSTANCE_OPTIONS,
  PRIMARY_SUBSTANCE_OPTIONS,
  TOLERANCE_LEVEL_OPTIONS,
  DESIRE_TO_QUIT_OPTIONS,
  CONSULTATION_REASON_OPTIONS,
  ACADEMIC_PERFORMANCE_OPTIONS,
  THERAPY_PREFERENCE_OPTIONS,
} from '@/lib/constants/consultation-options';

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
  mode: _mode = 'create',
  allowTypeChange = true,
  client,
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty, isValid } } = form;

  const formTypes = watch('formTypes') || [];
  const previousTherapyExperience = watch('previousTherapyExperience');
  const currentMedications = watch('currentMedications');
  const previousPsychologicalDiagnosis = watch('previousPsychologicalDiagnosis');
  const significantPhysicalIllness = watch('significantPhysicalIllness');
  const traumaticExperience = watch('traumaticExperience');
  const familyPsychologicalHistory = watch('familyPsychologicalHistory');

  // Handle save as draft
  const handleSaveDraft = useCallback(async () => {
    await onSave(ConsultationStatusEnum.Draft);
  }, [onSave]);

  // Handle save as completed
  const handleSaveCompleted = useCallback(async () => {
    await onSave(ConsultationStatusEnum.Completed);
  }, [onSave]);

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. Consultation Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Jenis Konsultasi</h3>
          <p className="text-gray-600 mb-6 text-sm">Pilih jenis layanan konsultasi yang dibutuhkan</p>

          <div className="space-y-6">
            {/* Consultation Types - Full Width */}
            <div>
              <Label className="text-base font-medium">Jenis Konsultasi *</Label>
              <p className="text-gray-600 mb-4 text-sm">Centang jenis konsultasi yang sesuai dengan kebutuhan</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(ConsultationFormTypeEnum).map(type => {
                  const isMinorType = type === ConsultationFormTypeEnum.Minor;
                  const isDisabled = (isMinorType && client && !client.isMinor) || (type === ConsultationFormTypeEnum.General && client && client.isMinor);
                  const isChecked = formTypes.includes(type);

                  return (
                    <div key={type} className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
                      <Checkbox
                        id={`formType-${type}`}
                        checked={isChecked}
                        disabled={isDisabled || !allowTypeChange}
                        onCheckedChange={(checked) => {
                          if (!isDisabled && allowTypeChange) {
                            const newFormTypes = checked
                              ? [...formTypes, type]
                              : formTypes.filter(t => t !== type);
                            setValue('formTypes', newFormTypes, {
                              shouldDirty: true,
                              shouldValidate: true
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={`formType-${type}`}
                        className={`text-sm font-medium flex-1 ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {ConsultationFormTypeLabels[type]}
                      </Label>
                    </div>
                  );
                })}
              </div>

              {errors.formTypes && (
                <p className="mt-1 text-sm text-red-600">{errors.formTypes.message}</p>
              )}

              {/* Warning message for non-minor clients selecting minor consultation */}
              {client && !client.isMinor && formTypes.includes(ConsultationFormTypeEnum.Minor) && (
                <p className="mt-1 text-sm text-orange-600">
                  ⚠️ Konsultasi anak & remaja hanya tersedia untuk klien di bawah umur
                </p>
              )}
            </div>
          </div>
        </div>

        {/* General Specific Section */}
        {formTypes.includes(ConsultationFormTypeEnum.General) && (
          <>
            {/* 2. Consultation Reason Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Keluhan Utama</h3>
              <p className="text-gray-600 mb-6 text-sm">Ceritakan masalah yang ingin dikonsultasikan</p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="primaryConcern" className="text-base font-medium">Keluhan Utama *</Label>
                  <Textarea
                    id="primaryConcern"
                    {...register('primaryConcern')}
                    placeholder="Ceritakan dengan detail masalah yang Anda alami..."
                    rows={4}
                    className="mt-2"
                  />
                  {errors.primaryConcern && (
                    <p className="mt-1 text-sm text-red-600">{errors.primaryConcern.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-base font-medium">Sudah Berlangsung *</Label>
                    <Select
                      value={watch('symptomDuration') || ''}
                      onValueChange={(val) => setValue('symptomDuration', val, { shouldDirty: true, shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih durasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {SYMPTOM_DURATION_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.symptomDuration && (
                      <p className="mt-1 text-sm text-red-600">{errors.symptomDuration.message}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-base font-medium">Seberapa Sering</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih frekuensi" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROBLEM_FREQUENCY_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Tingkat Gangguan *</Label>
                    <Select
                      value={watch('symptomSeverity')?.toString() || ''}
                      onValueChange={(val) => setValue('symptomSeverity', parseInt(val) as 1 | 2 | 3 | 4 | 5, { shouldDirty: true, shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tingkat" />
                      </SelectTrigger>
                      <SelectContent>
                        {SYMPTOM_SEVERITY_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.symptomSeverity && (
                      <p className="mt-1 text-sm text-red-600">{errors.symptomSeverity.message}</p>
                    )}
                  </div>
                </div>

                {/* Emotion Scale */}
                <div>
                  <Label className="text-base font-medium">Kondisi Emosi Saat Ini</Label>
                  <p className="text-gray-600 mb-6 text-sm">Geser slider untuk menunjukkan tingkat emosi (0 = tidak sama sekali, 10 = sangat kuat)</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {EMOTION_SCALE_OPTIONS.map(emotion => (
                      <div key={emotion.key} className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium text-gray-700">{emotion.label}</Label>
                          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {watch(`emotionScale.${emotion.key}`) || 0}
                          </span>
                        </div>
                        <Input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          className="w-full accent-blue-500"
                          {...register(`emotionScale.${emotion.key}`, { valueAsNumber: true })}
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Tidak ada</span>
                          <span>Sangat kuat</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Psychological History Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Riwayat Kesehatan</h3>
              <p className="text-gray-600 mb-6 text-sm">Informasi tentang kesehatan mental dan pengobatan</p>

              <div className="space-y-8">
                <div>
                  <Label className="text-base font-medium">Pernah didiagnosis gangguan psikologis? *</Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="previousPsychologicalDiagnosis-yes"
                        checked={watch('previousPsychologicalDiagnosis') === true}
                        onCheckedChange={(checked) => setValue('previousPsychologicalDiagnosis', checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="previousPsychologicalDiagnosis-yes" className="text-sm font-medium">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="previousPsychologicalDiagnosis-no"
                        checked={watch('previousPsychologicalDiagnosis') === false}
                        onCheckedChange={(checked) => setValue('previousPsychologicalDiagnosis', checked !== true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="previousPsychologicalDiagnosis-no" className="text-sm font-medium">Tidak</Label>
                    </div>
                  </div>
                  {errors.previousPsychologicalDiagnosis && (
                    <p className="mt-1 text-sm text-red-600">{errors.previousPsychologicalDiagnosis.message}</p>
                  )}

                  {watch('previousPsychologicalDiagnosis') && (
                    <div className="mt-4">
                      <Label htmlFor="previousPsychologicalDiagnosisDetails">Detail Diagnosis Psikologi Sebelumnya *</Label>
                      <Textarea
                        id="previousPsychologicalDiagnosisDetails"
                        {...register('previousPsychologicalDiagnosisDetails')}
                        placeholder="Jelaskan diagnosis yang pernah diterima, kapan, dan dari siapa..."
                        rows={3}
                        className="mt-1"
                      />
                      {errors.previousPsychologicalDiagnosisDetails && (
                        <p className="mt-1 text-sm text-red-600">{errors.previousPsychologicalDiagnosisDetails.message}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-base font-medium">Sedang menjalani pengobatan atau terapi? *</Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="currentMedications-yes"
                        checked={currentMedications === true}
                        onCheckedChange={(checked) => setValue('currentMedications', checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="currentMedications-yes" className="text-sm font-medium">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="currentMedications-no"
                        checked={currentMedications === false}
                        onCheckedChange={(checked) => setValue('currentMedications', checked !== true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="currentMedications-no" className="text-sm font-medium">Tidak</Label>
                    </div>
                  </div>
                  {errors.currentMedications && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentMedications.message}</p>
                  )}

                  {currentMedications && (
                    <div className="mt-4">
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
                </div>

                <div>
                  <Label className="text-base font-medium">Ada riwayat penyakit fisik yang signifikan? *</Label>
                  <p className="text-sm text-gray-600 mt-1 mb-3">Seperti diabetes, hipertensi, gangguan hormon, dll.</p>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="significantPhysicalIllness-yes"
                        checked={watch('significantPhysicalIllness') === true}
                        onCheckedChange={(checked) => setValue('significantPhysicalIllness', checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="significantPhysicalIllness-yes" className="text-sm font-medium">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="significantPhysicalIllness-no"
                        checked={watch('significantPhysicalIllness') === false}
                        onCheckedChange={(checked) => setValue('significantPhysicalIllness', checked !== true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="significantPhysicalIllness-no" className="text-sm font-medium">Tidak</Label>
                    </div>
                  </div>
                  {errors.significantPhysicalIllness && (
                    <p className="mt-1 text-sm text-red-600">{errors.significantPhysicalIllness.message}</p>
                  )}

                  {watch('significantPhysicalIllness') && (
                    <div className="mt-4">
                      <Label htmlFor="significantPhysicalIllnessDetails">Detail Riwayat Penyakit Fisik *</Label>
                      <Textarea
                        id="significantPhysicalIllnessDetails"
                        {...register('significantPhysicalIllnessDetails')}
                        placeholder="Jelaskan jenis penyakit, kapan didiagnosis, dan pengobatan yang dijalani..."
                        rows={3}
                        className="mt-1"
                      />
                      {errors.significantPhysicalIllnessDetails && (
                        <p className="mt-1 text-sm text-red-600">{errors.significantPhysicalIllnessDetails.message}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-base font-medium">Pernah mengalami kejadian traumatis? *</Label>
                  <p className="text-sm text-gray-600 mt-1 mb-3">Kehilangan orang terdekat, kecelakaan, kekerasan, dll.</p>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="traumaticExperience-yes"
                        checked={watch('traumaticExperience') === true}
                        onCheckedChange={(checked) => setValue('traumaticExperience', checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="traumaticExperience-yes" className="text-sm font-medium">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="traumaticExperience-no"
                        checked={watch('traumaticExperience') === false}
                        onCheckedChange={(checked) => setValue('traumaticExperience', checked !== true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="traumaticExperience-no" className="text-sm font-medium">Tidak</Label>
                    </div>
                  </div>
                  {errors.traumaticExperience && (
                    <p className="mt-1 text-sm text-red-600">{errors.traumaticExperience.message}</p>
                  )}

                  {watch('traumaticExperience') && (
                    <div className="mt-4">
                      <Label htmlFor="traumaticExperienceDetails">Detail Kejadian Traumatis *</Label>
                      <Textarea
                        id="traumaticExperienceDetails"
                        {...register('traumaticExperienceDetails')}
                        placeholder="Jelaskan kejadian yang dialami, kapan terjadi, dan dampaknya..."
                        rows={3}
                        className="mt-1"
                      />
                      {errors.traumaticExperienceDetails && (
                        <p className="mt-1 text-sm text-red-600">{errors.traumaticExperienceDetails.message}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-base font-medium">Ada keluarga dengan riwayat gangguan psikologis? *</Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="familyPsychologicalHistory-yes"
                        checked={watch('familyPsychologicalHistory') === true}
                        onCheckedChange={(checked) => setValue('familyPsychologicalHistory', checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="familyPsychologicalHistory-yes" className="text-sm font-medium">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="familyPsychologicalHistory-no"
                        checked={watch('familyPsychologicalHistory') === false}
                        onCheckedChange={(checked) => setValue('familyPsychologicalHistory', checked !== true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="familyPsychologicalHistory-no" className="text-sm font-medium">Tidak</Label>
                    </div>
                  </div>
                  {errors.familyPsychologicalHistory && (
                    <p className="mt-1 text-sm text-red-600">{errors.familyPsychologicalHistory.message}</p>
                  )}

                  {watch('familyPsychologicalHistory') && (
                    <div className="mt-4">
                      <Label htmlFor="familyPsychologicalHistoryDetails">Detail Riwayat Gangguan Psikologis Keluarga *</Label>
                      <Textarea
                        id="familyPsychologicalHistoryDetails"
                        {...register('familyPsychologicalHistoryDetails')}
                        placeholder="Jelaskan anggota keluarga yang memiliki riwayat gangguan psikologis, jenis gangguan, dan hubungan keluarga..."
                        rows={3}
                        className="mt-1"
                      />
                      {errors.familyPsychologicalHistoryDetails && (
                        <p className="mt-1 text-sm text-red-600">{errors.familyPsychologicalHistoryDetails.message}</p>
                      )}
                    </div>
                  )}
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

                <div>
                  <Label className="text-base font-medium">Kualitas Tidur</Label>
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
                  <Label className="text-base font-medium">Pikiran Menyakiti Diri</Label>
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

            {/* 4. Emotional Condition Section - Only for General Consultation */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kondisi Emosional</h3>
              <p className="text-gray-600 mb-6 text-sm">Informasi tentang kondisi emosional dan perasaan Anda saat ini</p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Bagaimana perasaan Anda dalam satu bulan terakhir? *</Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="feeling-excellent"
                        checked={watch('recentMoodState') === 'excellent'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('recentMoodState', 'excellent', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="feeling-excellent" className="text-sm font-medium cursor-pointer">Sangat baik</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="feeling-good"
                        checked={watch('recentMoodState') === 'good'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('recentMoodState', 'good', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="feeling-good" className="text-sm font-medium cursor-pointer">Baik</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="feeling-neutral"
                        checked={watch('recentMoodState') === 'neutral'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('recentMoodState', 'neutral', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="feeling-neutral" className="text-sm font-medium cursor-pointer">Biasa saja</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="feeling-bad"
                        checked={watch('recentMoodState') === 'bad'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('recentMoodState', 'bad', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="feeling-bad" className="text-sm font-medium cursor-pointer">Buruk</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="feeling-very-bad"
                        checked={watch('recentMoodState') === 'very_bad'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('recentMoodState', 'very_bad', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="feeling-very-bad" className="text-sm font-medium cursor-pointer">Sangat buruk</Label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="recentMoodStateDetails">Jelaskan secara singkat:</Label>
                    <Input
                      id="recentMoodStateDetails"
                      {...register('recentMoodStateDetails')}
                      placeholder="Jelaskan perasaan Anda dalam satu bulan terakhir..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Apakah Anda sering mengalami perasaan berikut ini?</Label>
                  <p className="text-gray-600 mb-4 mt-2 text-sm">Pilih semua yang sesuai dengan kondisi Anda (bisa memilih lebih dari satu)</p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="emotion-prolonged-sadness"
                        checked={watch('frequentEmotions')?.includes('prolonged_sadness') || false}
                        onCheckedChange={(checked) => {
                          const currentEmotions = watch('frequentEmotions') || [];
                          const emotion = 'prolonged_sadness';
                          const newEmotions = checked
                            ? [...currentEmotions, emotion]
                            : currentEmotions.filter(e => e !== emotion);
                          setValue('frequentEmotions', newEmotions, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="emotion-prolonged-sadness" className="text-sm font-medium cursor-pointer">
                        Sedih berkepanjangan
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="emotion-anxiety"
                        checked={watch('frequentEmotions')?.includes('anxiety_without_reason') || false}
                        onCheckedChange={(checked) => {
                          const currentEmotions = watch('frequentEmotions') || [];
                          const emotion = 'anxiety_without_reason';
                          const newEmotions = checked
                            ? [...currentEmotions, emotion]
                            : currentEmotions.filter(e => e !== emotion);
                          setValue('frequentEmotions', newEmotions, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="emotion-anxiety" className="text-sm font-medium cursor-pointer">
                        Cemas atau takut tanpa alasan yang jelas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="emotion-loss-interest"
                        checked={watch('frequentEmotions')?.includes('loss_of_interest') || false}
                        onCheckedChange={(checked) => {
                          const currentEmotions = watch('frequentEmotions') || [];
                          const emotion = 'loss_of_interest';
                          const newEmotions = checked
                            ? [...currentEmotions, emotion]
                            : currentEmotions.filter(e => e !== emotion);
                          setValue('frequentEmotions', newEmotions, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="emotion-loss-interest" className="text-sm font-medium cursor-pointer">
                        Kehilangan minat terhadap hal-hal yang dulu disukai
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="emotion-irritability"
                        checked={watch('frequentEmotions')?.includes('irritability') || false}
                        onCheckedChange={(checked) => {
                          const currentEmotions = watch('frequentEmotions') || [];
                          const emotion = 'irritability';
                          const newEmotions = checked
                            ? [...currentEmotions, emotion]
                            : currentEmotions.filter(e => e !== emotion);
                          setValue('frequentEmotions', newEmotions, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="emotion-irritability" className="text-sm font-medium cursor-pointer">
                        Mudah marah atau tersinggung
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="emotion-sleep-issues"
                        checked={watch('frequentEmotions')?.includes('sleep_problems') || false}
                        onCheckedChange={(checked) => {
                          const currentEmotions = watch('frequentEmotions') || [];
                          const emotion = 'sleep_problems';
                          const newEmotions = checked
                            ? [...currentEmotions, emotion]
                            : currentEmotions.filter(e => e !== emotion);
                          setValue('frequentEmotions', newEmotions, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="emotion-sleep-issues" className="text-sm font-medium cursor-pointer">
                        Sulit tidur atau terlalu banyak tidur
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="emotion-worthlessness"
                        checked={watch('frequentEmotions')?.includes('worthlessness_guilt') || false}
                        onCheckedChange={(checked) => {
                          const currentEmotions = watch('frequentEmotions') || [];
                          const emotion = 'worthlessness_guilt';
                          const newEmotions = checked
                            ? [...currentEmotions, emotion]
                            : currentEmotions.filter(e => e !== emotion);
                          setValue('frequentEmotions', newEmotions, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="emotion-worthlessness" className="text-sm font-medium cursor-pointer">
                        Merasa tidak berharga atau bersalah secara berlebihan
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Apakah Anda memiliki pikiran untuk menyakiti diri sendiri atau bunuh diri? *</Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="self-harm-often"
                        checked={watch('selfHarmThoughts') === 'often'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('selfHarmThoughts', 'often', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="self-harm-often" className="text-sm font-medium cursor-pointer">Ya, sering</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="self-harm-sometimes"
                        checked={watch('selfHarmThoughts') === 'sometimes'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('selfHarmThoughts', 'sometimes', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="self-harm-sometimes" className="text-sm font-medium cursor-pointer">Kadang-kadang</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="self-harm-never"
                        checked={watch('selfHarmThoughts') === 'never'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('selfHarmThoughts', 'never', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="self-harm-never" className="text-sm font-medium cursor-pointer">Tidak pernah</Label>
                    </div>
                  </div>
                  {(watch('selfHarmThoughts') === 'often' || watch('selfHarmThoughts') === 'sometimes') && (
                    <div className="mt-4">
                      <Label htmlFor="selfHarmDetails">Jika Ya, apakah pernah melakukan tindakan? Jelaskan:</Label>
                      <Textarea
                        id="selfHarmDetails"
                        {...register('selfHarmDetails')}
                        placeholder="Jelaskan apakah pernah melakukan tindakan menyakiti diri sendiri..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-base font-medium">Seberapa sering Anda merasa stres dalam kehidupan sehari-hari? *</Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="stress-never"
                        checked={watch('dailyStressFrequency') === 'never'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('dailyStressFrequency', 'never', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="stress-never" className="text-sm font-medium cursor-pointer">Tidak pernah</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="stress-rarely"
                        checked={watch('dailyStressFrequency') === 'rarely'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('dailyStressFrequency', 'rarely', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="stress-rarely" className="text-sm font-medium cursor-pointer">Jarang</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="stress-sometimes"
                        checked={watch('dailyStressFrequency') === 'sometimes'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('dailyStressFrequency', 'sometimes', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="stress-sometimes" className="text-sm font-medium cursor-pointer">Kadang-kadang</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="stress-often"
                        checked={watch('dailyStressFrequency') === 'often'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('dailyStressFrequency', 'often', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="stress-often" className="text-sm font-medium cursor-pointer">Sering</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="stress-very-often"
                        checked={watch('dailyStressFrequency') === 'very_often'}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('dailyStressFrequency', 'very_often', { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="stress-very-often" className="text-sm font-medium cursor-pointer">Sangat sering</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Goals and Treatment Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tujuan Terapi</h3>
              <p className="text-gray-600 mb-6 text-sm">Apa yang ingin Anda capai dari terapi ini</p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Tujuan Terapi *</Label>
                  <p className="text-gray-600 mb-4 mt-2 text-sm">Pilih tujuan yang ingin Anda capai dari terapi ini (boleh lebih dari satu)</p>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="goal-understanding"
                        checked={watch('treatmentGoals')?.includes('Pemahaman lebih baik tentang masalah saya dan diri sendiri') || false}
                        onCheckedChange={(checked) => {
                          const currentGoals = watch('treatmentGoals') || [];
                          const goalText = 'Pemahaman lebih baik tentang masalah saya dan diri sendiri';
                          const newGoals = checked
                            ? [...currentGoals, goalText]
                            : currentGoals.filter(goal => goal !== goalText);
                          setValue('treatmentGoals', newGoals, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="goal-understanding" className="text-sm font-medium cursor-pointer">
                        Pemahaman lebih baik tentang masalah saya dan diri sendiri
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="goal-strategies"
                        checked={watch('treatmentGoals')?.includes('Strategi untuk mengatasi masalah saya') || false}
                        onCheckedChange={(checked) => {
                          const currentGoals = watch('treatmentGoals') || [];
                          const goalText = 'Strategi untuk mengatasi masalah saya';
                          const newGoals = checked
                            ? [...currentGoals, goalText]
                            : currentGoals.filter(goal => goal !== goalText);
                          setValue('treatmentGoals', newGoals, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="goal-strategies" className="text-sm font-medium cursor-pointer">
                        Strategi untuk mengatasi masalah saya
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="goal-emotional-support"
                        checked={watch('treatmentGoals')?.includes('Dukungan emosional') || false}
                        onCheckedChange={(checked) => {
                          const currentGoals = watch('treatmentGoals') || [];
                          const goalText = 'Dukungan emosional';
                          const newGoals = checked
                            ? [...currentGoals, goalText]
                            : currentGoals.filter(goal => goal !== goalText);
                          setValue('treatmentGoals', newGoals, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="goal-emotional-support" className="text-sm font-medium cursor-pointer">
                        Dukungan emosional
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="goal-relationships"
                        checked={watch('treatmentGoals')?.includes('Meningkatkan hubungan sosial dan keluarga') || false}
                        onCheckedChange={(checked) => {
                          const currentGoals = watch('treatmentGoals') || [];
                          const goalText = 'Meningkatkan hubungan sosial dan keluarga';
                          const newGoals = checked
                            ? [...currentGoals, goalText]
                            : currentGoals.filter(goal => goal !== goalText);
                          setValue('treatmentGoals', newGoals, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="goal-relationships" className="text-sm font-medium cursor-pointer">
                        Meningkatkan hubungan sosial dan keluarga
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="goal-stress-management"
                        checked={watch('treatmentGoals')?.includes('Mengatasi stres dalam pekerjaan atau kehidupan sehari-hari') || false}
                        onCheckedChange={(checked) => {
                          const currentGoals = watch('treatmentGoals') || [];
                          const goalText = 'Mengatasi stres dalam pekerjaan atau kehidupan sehari-hari';
                          const newGoals = checked
                            ? [...currentGoals, goalText]
                            : currentGoals.filter(goal => goal !== goalText);
                          setValue('treatmentGoals', newGoals, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor="goal-stress-management" className="text-sm font-medium cursor-pointer">
                        Mengatasi stres dalam pekerjaan atau kehidupan sehari-hari
                      </Label>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="goal-other"
                          checked={watch('treatmentGoals')?.some(goal => goal.startsWith('Lainnya:')) || false}
                          onCheckedChange={(checked) => {
                            const currentGoals = watch('treatmentGoals') || [];
                            if (checked) {
                              // Add placeholder for other goal if not exists
                              const hasOther = currentGoals.some(goal => goal.startsWith('Lainnya:'));
                              if (!hasOther) {
                                setValue('treatmentGoals', [...currentGoals, 'Lainnya: '], { shouldDirty: true, shouldValidate: true });
                              }
                            } else {
                              // Remove all "other" goals
                              const newGoals = currentGoals.filter(goal => !goal.startsWith('Lainnya:'));
                              setValue('treatmentGoals', newGoals, { shouldDirty: true, shouldValidate: true });
                            }
                          }}
                        />
                        <Label htmlFor="goal-other" className="text-sm font-medium cursor-pointer">
                          Lainnya (sebutkan):
                        </Label>
                      </div>

                      {watch('treatmentGoals')?.some(goal => goal.startsWith('Lainnya:')) && (
                        <div className="ml-6">
                          <Input
                            id="goal-other-details"
                            placeholder="Sebutkan tujuan lainnya..."
                            className="mt-2"
                            onChange={(e) => {
                              const currentGoals = watch('treatmentGoals') || [];
                              const otherGoals = currentGoals.filter(goal => !goal.startsWith('Lainnya:'));
                              const newOtherGoal = e.target.value.trim() ? `Lainnya: ${e.target.value.trim()}` : 'Lainnya: ';
                              setValue('treatmentGoals', [...otherGoals, newOtherGoal], { shouldDirty: true, shouldValidate: true });
                            }}
                            value={watch('treatmentGoals')?.find(goal => goal.startsWith('Lainnya:'))?.replace('Lainnya: ', '') || ''}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {errors.treatmentGoals && (
                    <p className="mt-3 text-sm text-red-600">{errors.treatmentGoals.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="clientExpectations" className="text-base font-medium">Harapan Anda</Label>
                  <Textarea
                    id="clientExpectations"
                    {...register('clientExpectations')}
                    placeholder="Apa yang Anda harapkan dari terapi ini..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Preferensi Jenis Terapi</Label>
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
          </>
        )}

        {/* Drug Dependency Specific Section */}
        {formTypes.includes(ConsultationFormTypeEnum.DrugAddiction) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Riwayat Penggunaan Zat</h3>
            <p className="text-gray-600 mb-6 text-sm">Informasi tentang penggunaan zat dan proses ketergantungan</p>

            <div className="space-y-6">
              {/* Substance Usage Checklist - Based on Alpha Theta Medika PDF */}
              <div>
                <Label className="text-base font-medium">Jenis Zat yang Pernah Digunakan *</Label>
                <p className="text-gray-600 mb-4 text-sm">Centang semua zat yang pernah digunakan</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {SUBSTANCE_OPTIONS.map(substance => (
                    <div key={substance.key} className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
                      <Checkbox
                        id={`substance-${substance.key}`}
                        checked={watch(`substanceHistory.${substance.key}`) || false}
                        onCheckedChange={(checked) => setValue(`substanceHistory.${substance.key}`, checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor={`substance-${substance.key}`} className="text-sm font-medium flex-1">{substance.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other substances details */}
              {watch('substanceHistory.other_substances') && (
                <div>
                  <Label htmlFor="otherSubstancesDetails">Sebutkan Zat Lainnya</Label>
                  <Input
                    id="otherSubstancesDetails"
                    {...register('otherSubstancesDetails')}
                    placeholder="Sebutkan zat lain yang pernah digunakan"
                    className="mt-1"
                  />
                </div>
              )}

              {/* Primary substance */}
              <div>
                <Label htmlFor="primarySubstance">Zat Utama yang Saat Ini Menjadi Masalah *</Label>
                <Select
                  value={watch('primarySubstance') || ''}
                  onValueChange={(val) => setValue('primarySubstance', val, { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih zat utama" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIMARY_SUBSTANCE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.primarySubstance && (
                  <p className="mt-1 text-sm text-red-600">{errors.primarySubstance.message}</p>
                )}
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
                  onValueChange={(val) => setValue('toleranceLevel', parseInt(val) as 1 | 2 | 3 | 4 | 5, { shouldDirty: true, shouldValidate: true })}
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
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="previousTreatmentPrograms-yes"
                        checked={watch('previousTreatmentPrograms') === true}
                        onCheckedChange={(checked) => setValue('previousTreatmentPrograms', checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="previousTreatmentPrograms-yes" className="text-sm font-medium">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="previousTreatmentPrograms-no"
                        checked={watch('previousTreatmentPrograms') === false}
                        onCheckedChange={(checked) => setValue('previousTreatmentPrograms', checked !== true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="previousTreatmentPrograms-no" className="text-sm font-medium">Tidak</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Ada Masalah Hukum Terkait?</Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="legalIssuesRelated-yes"
                        checked={watch('legalIssuesRelated') === true}
                        onCheckedChange={(checked) => setValue('legalIssuesRelated', checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="legalIssuesRelated-yes" className="text-sm font-medium">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="legalIssuesRelated-no"
                        checked={watch('legalIssuesRelated') === false}
                        onCheckedChange={(checked) => setValue('legalIssuesRelated', checked !== true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="legalIssuesRelated-no" className="text-sm font-medium">Tidak</Label>
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

              {/* Goals and Motivation */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-4">Tujuan dan Motivasi</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Keinginan untuk Berhenti Menggunakan Zat</Label>
                    <Select
                      value={watch('desireToQuit') || ''}
                      onValueChange={(val) => setValue('desireToQuit', val, { shouldDirty: true, shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tingkat keinginan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Ya, sangat ingin berhenti</SelectItem>
                        <SelectItem value="Yes, but unsure">Ya, tapi masih ragu</SelectItem>
                        <SelectItem value="No">Belum yakin ingin berhenti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="recoveryGoals">Tujuan Pemulihan</Label>
                    <Textarea
                      id="recoveryGoals"
                      placeholder="Sebutkan tujuan-tujuan yang ingin dicapai dalam proses pemulihan (pisahkan dengan enter)"
                      rows={3}
                      className="mt-1"
                      onChange={(e) => {
                        const goals = e.target.value.split('\n').filter(goal => goal.trim() !== '');
                        setValue('recoveryGoals', goals, { shouldDirty: true, shouldValidate: true });
                      }}
                    />
                  </div>

                  <div>
                    <Label>Bersedia untuk Follow-up?</Label>
                    <div className="flex items-center space-x-6 mt-2">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="willingForFollowUp-yes"
                          checked={watch('willingForFollowUp') === true}
                          onCheckedChange={(checked) => setValue('willingForFollowUp', checked === true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="willingForFollowUp-yes" className="text-sm font-medium">Ya</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="willingForFollowUp-no"
                          checked={watch('willingForFollowUp') === false}
                          onCheckedChange={(checked) => setValue('willingForFollowUp', checked !== true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="willingForFollowUp-no" className="text-sm font-medium">Tidak</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Minor Client Specific Section */}
        {formTypes.includes(ConsultationFormTypeEnum.Minor) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Informasi Anak dan Wali</h3>
            <p className="text-gray-600 mb-6 text-sm">Informasi khusus untuk konsultasi anak di bawah umur</p>

            <div className="space-y-6">
              {/* Guardian Information - Using existing client data */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-1">Informasi Orang Tua/Wali</h4>
                <p className="text-gray-600 mb-4 text-sm">Data wali diambil dari profil klien</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Nama Orang Tua/Wali</Label>
                    <Input
                      defaultValue={client?.guardianFullName || ''}
                      className="bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label>Hubungan dengan Anak</Label>
                    <Input
                      defaultValue={client?.guardianRelationship || ''}
                      className="bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label>Nomor Telepon Orang Tua/Wali</Label>
                    <Input
                      defaultValue={client?.guardianPhone || ''}
                      className="bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label>Pekerjaan Orang Tua/Wali</Label>
                    <Input
                      defaultValue={client?.guardianOccupation || ''}
                      className="bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label>Status Perkawinan Orang Tua</Label>
                    <Input
                      defaultValue={client?.guardianMaritalStatus || ''}
                      className="bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label>Perwalian Hukum</Label>
                    <Input
                      defaultValue={client?.guardianLegalCustody ? 'Ya' : 'Tidak'}
                      className="bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Alamat Orang Tua/Wali</Label>
                  <Textarea
                    defaultValue={client?.guardianAddress || ''}
                    className="bg-gray-50"
                    readOnly
                    rows={2}
                  />
                </div>

                {client?.guardianLegalCustody && !client?.guardianCustodyDocsAttached && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-700">
                      ⚠️ <strong>Perhatian:</strong> Klien berada dalam perwalian hukum tetapi dokumen perwalian belum dilampirkan.
                      Mohon pastikan dokumen perwalian sudah diunggah di profil klien.
                    </p>
                  </div>
                )}
              </div>

              {/* Consultation Reasons for Minors */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-4">Alasan Konsultasi</h4>
                <div>
                  <Label>Apa alasan utama membawa anak ke layanan Hipnoterapi? *</Label>
                  <p className="text-sm text-gray-600 mb-3">Centang semua yang sesuai</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border-2 border-gray-200 rounded-lg">
                    {CONSULTATION_REASON_OPTIONS.map(reason => (
                      <div key={reason.key} className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
                        <Checkbox
                          id={`consultation-reason-${reason.key}`}
                          checked={watch(`consultationReasons.${reason.key}`) || false}
                          onCheckedChange={(checked) => setValue(`consultationReasons.${reason.key}`, checked === true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor={`consultation-reason-${reason.key}`} className="text-sm font-medium flex-1">{reason.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="otherConsultationReason">Alasan Lainnya</Label>
                  <Input
                    id="otherConsultationReason"
                    {...register('otherConsultationReason')}
                    placeholder="Sebutkan alasan lain jika ada"
                    className="mt-1"
                  />
                </div>

                <div className="mt-4">
                  <Label htmlFor="problemOnset">Sejak kapan masalah ini muncul?</Label>
                  <Input
                    id="problemOnset"
                    {...register('problemOnset')}
                    placeholder="Contoh: 3 bulan yang lalu, sejak kelas 2, dll."
                    className="mt-1"
                  />
                </div>

                <div className="mt-4">
                  <Label>Pernahkah anak mendapatkan bantuan psikologis/psikiatri sebelumnya?</Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="previousPsychologicalHelp-yes"
                        checked={watch('previousPsychologicalHelp') === true}
                        onCheckedChange={(checked) => setValue('previousPsychologicalHelp', checked === true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="previousPsychologicalHelp-yes" className="text-sm font-medium">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="previousPsychologicalHelp-no"
                        checked={watch('previousPsychologicalHelp') === false}
                        onCheckedChange={(checked) => setValue('previousPsychologicalHelp', checked !== true, { shouldDirty: true, shouldValidate: true })}
                      />
                      <Label htmlFor="previousPsychologicalHelp-no" className="text-sm font-medium">Tidak</Label>
                    </div>
                  </div>
                </div>

                {watch('previousPsychologicalHelp') && (
                  <div className="mt-4">
                    <Label htmlFor="previousPsychologicalHelpDetails">Detail Bantuan Sebelumnya</Label>
                    <Input
                      id="previousPsychologicalHelpDetails"
                      {...register('previousPsychologicalHelpDetails')}
                      placeholder="Sebutkan tempat & tahun: contoh RS. ABC tahun 2023"
                      className="mt-1"
                    />
                  </div>
                )}
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
                      onValueChange={(val) => setValue('academicPerformance', parseInt(val) as 1 | 2 | 3 | 4 | 5, { shouldDirty: true, shouldValidate: true })}
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
                    <div className="flex items-center space-x-6 mt-2">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="schoolBehaviorIssues-yes"
                          checked={watch('schoolBehaviorIssues') === true}
                          onCheckedChange={(checked) => setValue('schoolBehaviorIssues', checked === true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="schoolBehaviorIssues-yes" className="text-sm font-medium">Ya</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="schoolBehaviorIssues-no"
                          checked={watch('schoolBehaviorIssues') === false}
                          onCheckedChange={(checked) => setValue('schoolBehaviorIssues', checked !== true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="schoolBehaviorIssues-no" className="text-sm font-medium">Tidak</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Ada Riwayat Bullying?</Label>
                    <div className="flex items-center space-x-6 mt-2">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="bullyingHistory-yes"
                          checked={watch('bullyingHistory') === true}
                          onCheckedChange={(checked) => setValue('bullyingHistory', checked === true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="bullyingHistory-yes" className="text-sm font-medium">Ya</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="bullyingHistory-no"
                          checked={watch('bullyingHistory') === false}
                          onCheckedChange={(checked) => setValue('bullyingHistory', checked !== true, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor="bullyingHistory-no" className="text-sm font-medium">Tidak</Label>
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
                      <div className="flex items-center space-x-6 mt-2">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="familyConflicts-yes"
                            checked={watch('familyConflicts') === true}
                            onCheckedChange={(checked) => setValue('familyConflicts', checked === true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="familyConflicts-yes" className="text-sm font-medium">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="familyConflicts-no"
                            checked={watch('familyConflicts') === false}
                            onCheckedChange={(checked) => setValue('familyConflicts', checked !== true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="familyConflicts-no" className="text-sm font-medium">Tidak</Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Ada Kesulitan Sosial?</Label>
                      <div className="flex items-center space-x-6 mt-2">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="socialDifficulties-yes"
                            checked={watch('socialDifficulties') === true}
                            onCheckedChange={(checked) => setValue('socialDifficulties', checked === true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="socialDifficulties-yes" className="text-sm font-medium">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="socialDifficulties-no"
                            checked={watch('socialDifficulties') === false}
                            onCheckedChange={(checked) => setValue('socialDifficulties', checked !== true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="socialDifficulties-no" className="text-sm font-medium">Tidak</Label>
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
                      <div className="flex items-center space-x-6 mt-2">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="attentionConcerns-yes"
                            checked={watch('attentionConcerns') === true}
                            onCheckedChange={(checked) => setValue('attentionConcerns', checked === true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="attentionConcerns-yes" className="text-sm font-medium">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="attentionConcerns-no"
                            checked={watch('attentionConcerns') === false}
                            onCheckedChange={(checked) => setValue('attentionConcerns', checked !== true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="attentionConcerns-no" className="text-sm font-medium">Tidak</Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Ada Masalah Perilaku?</Label>
                      <div className="flex items-center space-x-6 mt-2">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="behavioralConcerns-yes"
                            checked={watch('behavioralConcerns') === true}
                            onCheckedChange={(checked) => setValue('behavioralConcerns', checked === true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="behavioralConcerns-yes" className="text-sm font-medium">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="behavioralConcerns-no"
                            checked={watch('behavioralConcerns') === false}
                            onCheckedChange={(checked) => setValue('behavioralConcerns', checked !== true, { shouldDirty: true, shouldValidate: true })}
                          />
                          <Label htmlFor="behavioralConcerns-no" className="text-sm font-medium">Tidak</Label>
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

        {/* 6. Notes and Assessment */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Catatan Terapis</h3>
          <p className="text-gray-600 mb-6 text-sm">Catatan dan penilaian dari terapis</p>

          <div className="space-y-6">
            <div>
              <Label htmlFor="consultationNotes" className="text-base font-medium">Catatan Konsultasi</Label>
              <Textarea
                id="consultationNotes"
                {...register('consultationNotes')}
                placeholder="Catatan umum tentang sesi konsultasi dan observasi..."
                rows={4}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="initialAssessment" className="text-base font-medium">Penilaian Awal</Label>
              <Textarea
                id="initialAssessment"
                {...register('initialAssessment')}
                placeholder="Penilaian awal kondisi klien..."
                rows={4}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="recommendedTreatmentPlan" className="text-base font-medium">Rencana Terapi</Label>
              <Textarea
                id="recommendedTreatmentPlan"
                {...register('recommendedTreatmentPlan')}
                placeholder="Rencana terapi yang direkomendasikan..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
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