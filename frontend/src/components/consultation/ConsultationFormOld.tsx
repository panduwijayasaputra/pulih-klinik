'use client';

import React, { useCallback, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { 
  ConsultationFormTypeEnum,
  ConsultationFormTypeLabels,
  ConsultationStatusEnum,
  ConsultationStatusLabels,
  SeverityLevelLabels,
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

  // Type-specific field watchers
  const familyMentalHealthHistory = watch('familyMentalHealthHistory');
  const previousMentalHealthDiagnosis = watch('previousMentalHealthDiagnosis');
  const socialCircleSubstanceUse = watch('socialCircleSubstanceUse');
  const previousTreatmentPrograms = watch('previousTreatmentPrograms');
  const legalIssuesRelated = watch('legalIssuesRelated');
  const guardianPresent = watch('guardianPresent');
  const schoolBehaviorIssues = watch('schoolBehaviorIssues');
  const familyConflicts = watch('familyConflicts');
  const socialDifficulties = watch('socialDifficulties');
  const bullyingHistory = watch('bullyingHistory');
  const attentionConcerns = watch('attentionConcerns');
  const behavioralConcerns = watch('behavioralConcerns');

  // Handle form type change
  const handleFormTypeChange = useCallback((newFormType: ConsultationFormTypeEnum) => {
    if (!allowTypeChange) return;
    
    setValue('formType', newFormType, { shouldDirty: true, shouldValidate: true });
    
    // Reset form type-specific fields when changing form type
    if (newFormType !== ConsultationFormTypeEnum.General) {
      setValue('currentLifeStressors', []);
      setValue('supportSystem', '');
      setValue('workLifeBalance', 3);
      setValue('familyMentalHealthHistory', false);
      setValue('familyMentalHealthDetails', '');
      setValue('previousMentalHealthDiagnosis', false);
      setValue('previousMentalHealthDiagnosisDetails', '');
      setValue('sleepPatterns', '');
      setValue('exerciseFrequency', '');
      setValue('dietaryHabits', '');
      setValue('socialConnections', '');
    }
    
    if (newFormType !== ConsultationFormTypeEnum.DrugAddiction) {
      setValue('primarySubstance', '');
      setValue('additionalSubstances', []);
      setValue('ageOfFirstUse', 18);
      setValue('frequencyOfUse', '');
      setValue('quantityPerUse', '');
      setValue('lastUseDate', '');
      setValue('withdrawalSymptoms', []);
      setValue('toleranceLevel', 3);
      setValue('impactOnDailyLife', '');
      setValue('attemptsToQuit', 0);
      setValue('socialCircleSubstanceUse', false);
      setValue('triggerSituations', []);
      setValue('environmentalFactors', []);
      setValue('previousTreatmentPrograms', false);
      setValue('previousTreatmentDetails', '');
      setValue('currentSobrietyPeriod', '');
      setValue('legalIssuesRelated', false);
      setValue('legalIssuesDetails', '');
      setValue('financialImpact', '');
    }
    
    if (newFormType !== ConsultationFormTypeEnum.Minor) {
      setValue('guardianPresent', true);
      setValue('guardianRelationship', '');
      setValue('guardianConcerns', '');
      setValue('currentGradeLevel', '');
      setValue('academicPerformance', 3);
      setValue('schoolBehaviorIssues', false);
      setValue('schoolBehaviorDetails', '');
      setValue('teacherConcerns', '');
      setValue('familyStructure', '');
      setValue('siblingRelationships', '');
      setValue('parentalConcerns', []);
      setValue('familyConflicts', false);
      setValue('familyConflictsDetails', '');
      setValue('peerRelationships', '');
      setValue('socialDifficulties', false);
      setValue('socialDifficultiesDetails', '');
      setValue('bullyingHistory', false);
      setValue('bullyingDetails', '');
      setValue('developmentalMilestones', '');
      setValue('attentionConcerns', false);
      setValue('attentionDetails', '');
      setValue('behavioralConcerns', false);
      setValue('behavioralDetails', '');
    }
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
        {/* Basic Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Dasar</h3>
          <p className="text-sm text-gray-600 mb-4">Informasi dasar tentang konsultasi</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label htmlFor="sessionDate">Tanggal Sesi *</Label>
              <Input 
                id="sessionDate" 
                type="datetime-local" 
                {...register('sessionDate')} 
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
                {...register('sessionDuration', { valueAsNumber: true })} 
              />
              {errors.sessionDuration && (
                <p className="mt-1 text-sm text-red-600">{errors.sessionDuration.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="consultationNotes">Catatan Konsultasi</Label>
            <Textarea 
              id="consultationNotes" 
              rows={3}
              placeholder="Catatan tambahan tentang konsultasi (opsional)"
              {...register('consultationNotes')} 
            />
            {errors.consultationNotes && (
              <p className="mt-1 text-sm text-red-600">{errors.consultationNotes.message}</p>
            )}
          </div>
        </div>

        {/* Client Background Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Riwayat Klien</h3>
          <p className="text-sm text-gray-600 mb-4">Informasi latar belakang klien</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Pengalaman Terapi Sebelumnya *</Label>
              <Select
                value={previousTherapyExperience ? 'true' : 'false'}
                onValueChange={(val) => setValue('previousTherapyExperience', val === 'true', { shouldDirty: true, shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jawaban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ya</SelectItem>
                  <SelectItem value="false">Tidak</SelectItem>
                </SelectContent>
              </Select>
              {errors.previousTherapyExperience && (
                <p className="mt-1 text-sm text-red-600">{errors.previousTherapyExperience.message}</p>
              )}
            </div>

            <div>
              <Label>Sedang Mengonsumsi Obat *</Label>
              <Select
                value={currentMedications ? 'true' : 'false'}
                onValueChange={(val) => setValue('currentMedications', val === 'true', { shouldDirty: true, shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jawaban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ya</SelectItem>
                  <SelectItem value="false">Tidak</SelectItem>
                </SelectContent>
              </Select>
              {errors.currentMedications && (
                <p className="mt-1 text-sm text-red-600">{errors.currentMedications.message}</p>
              )}
            </div>
          </div>

          {previousTherapyExperience && (
            <div className="mt-6">
              <Label htmlFor="previousTherapyDetails">Detail Terapi Sebelumnya *</Label>
              <Textarea 
                id="previousTherapyDetails" 
                rows={3}
                placeholder="Jelaskan detail terapi sebelumnya"
                {...register('previousTherapyDetails')} 
              />
              {errors.previousTherapyDetails && (
                <p className="mt-1 text-sm text-red-600">{errors.previousTherapyDetails.message}</p>
              )}
            </div>
          )}

          {currentMedications && (
            <div className="mt-6">
              <Label htmlFor="currentMedicationsDetails">Detail Obat yang Dikonsumsi *</Label>
              <Textarea 
                id="currentMedicationsDetails" 
                rows={3}
                placeholder="Jelaskan obat yang sedang dikonsumsi"
                {...register('currentMedicationsDetails')} 
              />
              {errors.currentMedicationsDetails && (
                <p className="mt-1 text-sm text-red-600">{errors.currentMedicationsDetails.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Presenting Concerns Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Keluhan Utama</h3>
          <p className="text-sm text-gray-600 mb-4">Masalah dan gejala yang dialami klien</p>
          
          <div>
            <Label htmlFor="primaryConcern">Keluhan Utama *</Label>
            <Textarea 
              id="primaryConcern" 
              rows={4}
              placeholder="Jelaskan keluhan utama klien (minimal 10 karakter)"
              {...register('primaryConcern')} 
            />
            {errors.primaryConcern && (
              <p className="mt-1 text-sm text-red-600">{errors.primaryConcern.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label htmlFor="symptomSeverity">Tingkat Keparahan Gejala *</Label>
              <Select
                value={watch('symptomSeverity')?.toString() || '3'}
                onValueChange={(val) => setValue('symptomSeverity', parseInt(val) as 1|2|3|4|5, { shouldDirty: true, shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat keparahan" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(level => (
                    <SelectItem key={level} value={level.toString()}>
                      {level} - {SeverityLevelLabels[level as 1|2|3|4|5]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.symptomSeverity && (
                <p className="mt-1 text-sm text-red-600">{errors.symptomSeverity.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="symptomDuration">Durasi Gejala *</Label>
              <Input 
                id="symptomDuration" 
                placeholder="Contoh: 2 minggu, 6 bulan, 1 tahun"
                {...register('symptomDuration')} 
              />
              {errors.symptomDuration && (
                <p className="mt-1 text-sm text-red-600">{errors.symptomDuration.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Treatment Goals Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tujuan Terapi</h3>
          <p className="text-sm text-gray-600 mb-4">Ekspektasi dan tujuan dari proses terapi</p>
          
          <div>
            <Label htmlFor="clientExpectations">Ekspektasi Klien</Label>
            <Textarea 
              id="clientExpectations" 
              rows={3}
              placeholder="Jelaskan ekspektasi klien dari terapi (opsional)"
              {...register('clientExpectations')} 
            />
            {errors.clientExpectations && (
              <p className="mt-1 text-sm text-red-600">{errors.clientExpectations.message}</p>
            )}
          </div>
        </div>

        {/* Type-specific sections */}
        {formType === ConsultationFormTypeEnum.General && (
          <GeneralConsultationFields 
            form={form}
            familyMentalHealthHistory={familyMentalHealthHistory}
            previousMentalHealthDiagnosis={previousMentalHealthDiagnosis}
          />
        )}

        {formType === ConsultationFormTypeEnum.DrugAddiction && (
          <DrugAddictionConsultationFields 
            form={form}
            socialCircleSubstanceUse={socialCircleSubstanceUse}
            previousTreatmentPrograms={previousTreatmentPrograms}
            legalIssuesRelated={legalIssuesRelated}
          />
        )}

        {formType === ConsultationFormTypeEnum.Minor && (
          <MinorConsultationFields 
            form={form}
            guardianPresent={guardianPresent}
            schoolBehaviorIssues={schoolBehaviorIssues}
            familyConflicts={familyConflicts}
            socialDifficulties={socialDifficulties}
            bullyingHistory={bullyingHistory}
            attentionConcerns={attentionConcerns}
            behavioralConcerns={behavioralConcerns}
          />
        )}

        {/* Assessment Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hasil Assessment</h3>
          <p className="text-sm text-gray-600 mb-4">Penilaian awal dan rencana pengobatan</p>
          
          <div>
            <Label htmlFor="initialAssessment">Penilaian Awal</Label>
            <Textarea 
              id="initialAssessment" 
              rows={4}
              placeholder="Penilaian awal terhadap kondisi klien (opsional)"
              {...register('initialAssessment')} 
            />
            {errors.initialAssessment && (
              <p className="mt-1 text-sm text-red-600">{errors.initialAssessment.message}</p>
            )}
          </div>

          <div className="mt-6">
            <Label htmlFor="recommendedTreatmentPlan">Rencana Perawatan yang Direkomendasikan</Label>
            <Textarea 
              id="recommendedTreatmentPlan" 
              rows={4}
              placeholder="Rencana perawatan dan terapi yang direkomendasikan (opsional)"
              {...register('recommendedTreatmentPlan')} 
            />
            {errors.recommendedTreatmentPlan && (
              <p className="mt-1 text-sm text-red-600">{errors.recommendedTreatmentPlan.message}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Draft'}
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleSaveCompleted}
              disabled={isSubmitting || isLoading || !isValid}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan & Selesai'}
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting || isLoading || !isDirty || !isValid}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Memproses...
                </>
              ) : (
                mode === 'edit' ? 'Perbarui Konsultasi' : 'Buat Konsultasi'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

// General Consultation specific fields
const GeneralConsultationFields: React.FC<{
  form: UseFormReturn<ConsultationFormData>;
  familyMentalHealthHistory: boolean;
  previousMentalHealthDiagnosis: boolean;
}> = ({ form, familyMentalHealthHistory, previousMentalHealthDiagnosis }) => {
  const { register, setValue, watch, formState: { errors } } = form;

  return (
    <>
      {/* Life Circumstances */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Kondisi Kehidupan</h3>
        <p className="text-sm text-gray-600 mb-4">Informasi tentang kondisi kehidupan sehari-hari</p>
        
        <div>
          <Label htmlFor="supportSystem">Sistem Dukungan *</Label>
          <Input 
            id="supportSystem" 
            placeholder="Contoh: Keluarga, teman, kolega"
            {...register('supportSystem')} 
          />
          {errors.supportSystem && (
            <p className="mt-1 text-sm text-red-600">{errors.supportSystem.message}</p>
          )}
        </div>

        <div className="mt-6">
          <Label htmlFor="workLifeBalance">Keseimbangan Hidup-Kerja *</Label>
          <Select
            value={watch('workLifeBalance')?.toString() || '3'}
            onValueChange={(val) => setValue('workLifeBalance', parseInt(val) as 1|2|3|4|5, { shouldDirty: true, shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tingkat keseimbangan" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(level => (
                <SelectItem key={level} value={level.toString()}>
                  {level} - {level === 1 ? 'Buruk' : level === 2 ? 'Kurang' : level === 3 ? 'Cukup' : level === 4 ? 'Baik' : 'Sangat Baik'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.workLifeBalance && (
            <p className="mt-1 text-sm text-red-600">{errors.workLifeBalance.message}</p>
          )}
        </div>
      </div>

      {/* Mental Health History */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Riwayat Kesehatan Mental</h3>
        <p className="text-sm text-gray-600 mb-4">Riwayat kesehatan mental klien dan keluarga</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Riwayat Gangguan Mental dalam Keluarga *</Label>
            <Select
              value={familyMentalHealthHistory ? 'true' : 'false'}
              onValueChange={(val) => setValue('familyMentalHealthHistory', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.familyMentalHealthHistory && (
              <p className="mt-1 text-sm text-red-600">{errors.familyMentalHealthHistory.message}</p>
            )}
          </div>

          <div>
            <Label>Pernah Didiagnosis Gangguan Mental *</Label>
            <Select
              value={previousMentalHealthDiagnosis ? 'true' : 'false'}
              onValueChange={(val) => setValue('previousMentalHealthDiagnosis', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.previousMentalHealthDiagnosis && (
              <p className="mt-1 text-sm text-red-600">{errors.previousMentalHealthDiagnosis.message}</p>
            )}
          </div>
        </div>

        {familyMentalHealthHistory && (
          <div className="mt-6">
            <Label htmlFor="familyMentalHealthDetails">Detail Riwayat Gangguan Mental Keluarga *</Label>
            <Textarea 
              id="familyMentalHealthDetails" 
              rows={3}
              placeholder="Jelaskan detail riwayat gangguan mental dalam keluarga"
              {...register('familyMentalHealthDetails')} 
            />
            {errors.familyMentalHealthDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.familyMentalHealthDetails.message}</p>
            )}
          </div>
        )}

        {previousMentalHealthDiagnosis && (
          <div className="mt-6">
            <Label htmlFor="previousMentalHealthDiagnosisDetails">Detail Diagnosis Gangguan Mental *</Label>
            <Textarea 
              id="previousMentalHealthDiagnosisDetails" 
              rows={3}
              placeholder="Jelaskan detail diagnosis gangguan mental sebelumnya"
              {...register('previousMentalHealthDiagnosisDetails')} 
            />
            {errors.previousMentalHealthDiagnosisDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.previousMentalHealthDiagnosisDetails.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Lifestyle Factors */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Faktor Gaya Hidup</h3>
        <p className="text-sm text-gray-600 mb-4">Informasi tentang pola hidup sehari-hari</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="sleepPatterns">Pola Tidur *</Label>
            <Input 
              id="sleepPatterns" 
              placeholder="Contoh: Tidur jam 22:00, bangun jam 06:00"
              {...register('sleepPatterns')} 
            />
            {errors.sleepPatterns && (
              <p className="mt-1 text-sm text-red-600">{errors.sleepPatterns.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="exerciseFrequency">Frekuensi Olahraga *</Label>
            <Input 
              id="exerciseFrequency" 
              placeholder="Contoh: 3x seminggu, jarang"
              {...register('exerciseFrequency')} 
            />
            {errors.exerciseFrequency && (
              <p className="mt-1 text-sm text-red-600">{errors.exerciseFrequency.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label htmlFor="dietaryHabits">Kebiasaan Makan *</Label>
            <Input 
              id="dietaryHabits" 
              placeholder="Contoh: Makan 3x sehari, vegetarian"
              {...register('dietaryHabits')} 
            />
            {errors.dietaryHabits && (
              <p className="mt-1 text-sm text-red-600">{errors.dietaryHabits.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="socialConnections">Koneksi Sosial *</Label>
            <Input 
              id="socialConnections" 
              placeholder="Contoh: Aktif bersosialisasi, lebih suka sendiri"
              {...register('socialConnections')} 
            />
            {errors.socialConnections && (
              <p className="mt-1 text-sm text-red-600">{errors.socialConnections.message}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Drug Addiction Consultation specific fields
const DrugAddictionConsultationFields: React.FC<{
  form: UseFormReturn<ConsultationFormData>;
  socialCircleSubstanceUse: boolean;
  previousTreatmentPrograms: boolean;
  legalIssuesRelated: boolean;
}> = ({ form, socialCircleSubstanceUse, previousTreatmentPrograms, legalIssuesRelated }) => {
  const { register, setValue, watch, formState: { errors } } = form;

  return (
    <>
      {/* Substance Use History */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Riwayat Penggunaan Zat</h3>
        <p className="text-sm text-gray-600 mb-4">Informasi detail tentang penggunaan zat</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="primarySubstance">Zat Utama *</Label>
            <Input 
              id="primarySubstance" 
              placeholder="Contoh: Alkohol, Narkoba, Obat-obatan"
              {...register('primarySubstance')} 
            />
            {errors.primarySubstance && (
              <p className="mt-1 text-sm text-red-600">{errors.primarySubstance.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="ageOfFirstUse">Usia Pertama Kali Menggunakan *</Label>
            <Input 
              id="ageOfFirstUse" 
              type="number"
              min="5"
              max="100"
              {...register('ageOfFirstUse', { valueAsNumber: true })} 
            />
            {errors.ageOfFirstUse && (
              <p className="mt-1 text-sm text-red-600">{errors.ageOfFirstUse.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label htmlFor="frequencyOfUse">Frekuensi Penggunaan *</Label>
            <Input 
              id="frequencyOfUse" 
              placeholder="Contoh: Setiap hari, 3x seminggu"
              {...register('frequencyOfUse')} 
            />
            {errors.frequencyOfUse && (
              <p className="mt-1 text-sm text-red-600">{errors.frequencyOfUse.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quantityPerUse">Jumlah per Penggunaan *</Label>
            <Input 
              id="quantityPerUse" 
              placeholder="Contoh: 2 gelas, 1 gram"
              {...register('quantityPerUse')} 
            />
            {errors.quantityPerUse && (
              <p className="mt-1 text-sm text-red-600">{errors.quantityPerUse.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label htmlFor="lastUseDate">Tanggal Terakhir Penggunaan *</Label>
            <Input 
              id="lastUseDate" 
              type="date"
              {...register('lastUseDate')} 
            />
            {errors.lastUseDate && (
              <p className="mt-1 text-sm text-red-600">{errors.lastUseDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="toleranceLevel">Tingkat Toleransi *</Label>
            <Select
              value={watch('toleranceLevel')?.toString() || '3'}
              onValueChange={(val) => setValue('toleranceLevel', parseInt(val) as 1|2|3|4|5, { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tingkat toleransi" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(level => (
                  <SelectItem key={level} value={level.toString()}>
                    {level} - {level === 1 ? 'Rendah' : level === 2 ? 'Rendah-Sedang' : level === 3 ? 'Sedang' : level === 4 ? 'Sedang-Tinggi' : 'Tinggi'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.toleranceLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.toleranceLevel.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label htmlFor="attemptsToQuit">Jumlah Percobaan Berhenti *</Label>
            <Input 
              id="attemptsToQuit" 
              type="number"
              min="0"
              max="50"
              {...register('attemptsToQuit', { valueAsNumber: true })} 
            />
            {errors.attemptsToQuit && (
              <p className="mt-1 text-sm text-red-600">{errors.attemptsToQuit.message}</p>
            )}
          </div>

          <div>
            <Label>Lingkungan Sosial Menggunakan Zat *</Label>
            <Select
              value={socialCircleSubstanceUse ? 'true' : 'false'}
              onValueChange={(val) => setValue('socialCircleSubstanceUse', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.socialCircleSubstanceUse && (
              <p className="mt-1 text-sm text-red-600">{errors.socialCircleSubstanceUse.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="impactOnDailyLife">Dampak pada Kehidupan Sehari-hari *</Label>
          <Textarea 
            id="impactOnDailyLife" 
            rows={3}
            placeholder="Jelaskan dampak penggunaan zat pada kehidupan sehari-hari"
            {...register('impactOnDailyLife')} 
          />
          {errors.impactOnDailyLife && (
            <p className="mt-1 text-sm text-red-600">{errors.impactOnDailyLife.message}</p>
          )}
        </div>
      </div>

      {/* Recovery History */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Riwayat Pemulihan</h3>
        <p className="text-sm text-gray-600 mb-4">Informasi tentang upaya pemulihan sebelumnya</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Pernah Mengikuti Program Pemulihan *</Label>
            <Select
              value={previousTreatmentPrograms ? 'true' : 'false'}
              onValueChange={(val) => setValue('previousTreatmentPrograms', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.previousTreatmentPrograms && (
              <p className="mt-1 text-sm text-red-600">{errors.previousTreatmentPrograms.message}</p>
            )}
          </div>

          <div>
            <Label>Ada Masalah Hukum Terkait *</Label>
            <Select
              value={legalIssuesRelated ? 'true' : 'false'}
              onValueChange={(val) => setValue('legalIssuesRelated', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.legalIssuesRelated && (
              <p className="mt-1 text-sm text-red-600">{errors.legalIssuesRelated.message}</p>
            )}
          </div>
        </div>

        {previousTreatmentPrograms && (
          <div className="mt-6">
            <Label htmlFor="previousTreatmentDetails">Detail Program Pemulihan Sebelumnya *</Label>
            <Textarea 
              id="previousTreatmentDetails" 
              rows={3}
              placeholder="Jelaskan detail program pemulihan yang pernah diikuti"
              {...register('previousTreatmentDetails')} 
            />
            {errors.previousTreatmentDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.previousTreatmentDetails.message}</p>
            )}
          </div>
        )}

        {legalIssuesRelated && (
          <div className="mt-6">
            <Label htmlFor="legalIssuesDetails">Detail Masalah Hukum *</Label>
            <Textarea 
              id="legalIssuesDetails" 
              rows={3}
              placeholder="Jelaskan detail masalah hukum yang terkait"
              {...register('legalIssuesDetails')} 
            />
            {errors.legalIssuesDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.legalIssuesDetails.message}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label htmlFor="currentSobrietyPeriod">Periode Soberness Saat Ini</Label>
            <Input 
              id="currentSobrietyPeriod" 
              placeholder="Contoh: 30 hari, 6 bulan"
              {...register('currentSobrietyPeriod')} 
            />
            {errors.currentSobrietyPeriod && (
              <p className="mt-1 text-sm text-red-600">{errors.currentSobrietyPeriod.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="financialImpact">Dampak Finansial *</Label>
            <Input 
              id="financialImpact" 
              placeholder="Contoh: Banyak hutang, kehilangan pekerjaan"
              {...register('financialImpact')} 
            />
            {errors.financialImpact && (
              <p className="mt-1 text-sm text-red-600">{errors.financialImpact.message}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Minor Consultation specific fields
const MinorConsultationFields: React.FC<{
  form: UseFormReturn<ConsultationFormData>;
  guardianPresent: boolean;
  schoolBehaviorIssues: boolean;
  familyConflicts: boolean;
  socialDifficulties: boolean;
  bullyingHistory: boolean;
  attentionConcerns: boolean;
  behavioralConcerns: boolean;
}> = ({ form, guardianPresent, schoolBehaviorIssues, familyConflicts, socialDifficulties, bullyingHistory, attentionConcerns, behavioralConcerns }) => {
  const { register, setValue, watch, formState: { errors } } = form;

  return (
    <>
      {/* Guardian Information */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Wali</h3>
        <p className="text-sm text-gray-600 mb-4">Informasi tentang wali dan kekhawatiran mereka</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Wali Hadir dalam Sesi *</Label>
            <Select
              value={guardianPresent ? 'true' : 'false'}
              onValueChange={(val) => setValue('guardianPresent', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.guardianPresent && (
              <p className="mt-1 text-sm text-red-600">{errors.guardianPresent.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="guardianRelationship">Hubungan dengan Wali *</Label>
            <Input 
              id="guardianRelationship" 
              placeholder="Contoh: Ayah, Ibu, Kakek, Nenek"
              {...register('guardianRelationship')} 
            />
            {errors.guardianRelationship && (
              <p className="mt-1 text-sm text-red-600">{errors.guardianRelationship.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="guardianConcerns">Kekhawatiran Wali *</Label>
          <Textarea 
            id="guardianConcerns" 
            rows={3}
            placeholder="Jelaskan kekhawatiran wali terhadap anak"
            {...register('guardianConcerns')} 
          />
          {errors.guardianConcerns && (
            <p className="mt-1 text-sm text-red-600">{errors.guardianConcerns.message}</p>
          )}
        </div>
      </div>

      {/* School Information */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Sekolah</h3>
        <p className="text-sm text-gray-600 mb-4">Informasi tentang performa akademik dan perilaku di sekolah</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="currentGradeLevel">Tingkat Kelas Saat Ini *</Label>
            <Input 
              id="currentGradeLevel" 
              placeholder="Contoh: Kelas 5 SD, Kelas 2 SMP"
              {...register('currentGradeLevel')} 
            />
            {errors.currentGradeLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.currentGradeLevel.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="academicPerformance">Performa Akademik *</Label>
            <Select
              value={watch('academicPerformance')?.toString() || '3'}
              onValueChange={(val) => setValue('academicPerformance', parseInt(val) as 1|2|3|4|5, { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih performa akademik" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(level => (
                  <SelectItem key={level} value={level.toString()}>
                    {level} - {level === 1 ? 'Buruk' : level === 2 ? 'Kurang' : level === 3 ? 'Cukup' : level === 4 ? 'Baik' : 'Sangat Baik'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.academicPerformance && (
              <p className="mt-1 text-sm text-red-600">{errors.academicPerformance.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label>Ada Masalah Perilaku di Sekolah *</Label>
            <Select
              value={schoolBehaviorIssues ? 'true' : 'false'}
              onValueChange={(val) => setValue('schoolBehaviorIssues', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.schoolBehaviorIssues && (
              <p className="mt-1 text-sm text-red-600">{errors.schoolBehaviorIssues.message}</p>
            )}
          </div>
        </div>

        {schoolBehaviorIssues && (
          <div className="mt-6">
            <Label htmlFor="schoolBehaviorDetails">Detail Masalah Perilaku di Sekolah *</Label>
            <Textarea 
              id="schoolBehaviorDetails" 
              rows={3}
              placeholder="Jelaskan detail masalah perilaku di sekolah"
              {...register('schoolBehaviorDetails')} 
            />
            {errors.schoolBehaviorDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.schoolBehaviorDetails.message}</p>
            )}
          </div>
        )}

        <div className="mt-6">
          <Label htmlFor="teacherConcerns">Kekhawatiran Guru</Label>
          <Textarea 
            id="teacherConcerns" 
            rows={3}
            placeholder="Kekhawatiran yang disampaikan guru (opsional)"
            {...register('teacherConcerns')} 
          />
          {errors.teacherConcerns && (
            <p className="mt-1 text-sm text-red-600">{errors.teacherConcerns.message}</p>
          )}
        </div>
      </div>

      {/* Family Dynamics */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dinamika Keluarga</h3>
        <p className="text-sm text-gray-600 mb-4">Informasi tentang struktur dan hubungan keluarga</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="familyStructure">Struktur Keluarga *</Label>
            <Input 
              id="familyStructure" 
              placeholder="Contoh: Keluarga inti, single parent, blended"
              {...register('familyStructure')} 
            />
            {errors.familyStructure && (
              <p className="mt-1 text-sm text-red-600">{errors.familyStructure.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="siblingRelationships">Hubungan dengan Saudara *</Label>
            <Input 
              id="siblingRelationships" 
              placeholder="Contoh: Baik, sering bertengkar, anak tunggal"
              {...register('siblingRelationships')} 
            />
            {errors.siblingRelationships && (
              <p className="mt-1 text-sm text-red-600">{errors.siblingRelationships.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label>Ada Konflik dalam Keluarga *</Label>
            <Select
              value={familyConflicts ? 'true' : 'false'}
              onValueChange={(val) => setValue('familyConflicts', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.familyConflicts && (
              <p className="mt-1 text-sm text-red-600">{errors.familyConflicts.message}</p>
            )}
          </div>
        </div>

        {familyConflicts && (
          <div className="mt-6">
            <Label htmlFor="familyConflictsDetails">Detail Konflik Keluarga *</Label>
            <Textarea 
              id="familyConflictsDetails" 
              rows={3}
              placeholder="Jelaskan detail konflik dalam keluarga"
              {...register('familyConflictsDetails')} 
            />
            {errors.familyConflictsDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.familyConflictsDetails.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Social and Peer Relationships */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Hubungan Sosial dan Teman Sebaya</h3>
        <p className="text-sm text-gray-600 mb-4">Informasi tentang hubungan sosial anak</p>
        
        <div>
          <Label htmlFor="peerRelationships">Hubungan dengan Teman Sebaya *</Label>
          <Input 
            id="peerRelationships" 
            placeholder="Contoh: Mudah berteman, pemalu, populer"
            {...register('peerRelationships')} 
          />
          {errors.peerRelationships && (
            <p className="mt-1 text-sm text-red-600">{errors.peerRelationships.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label>Ada Kesulitan Sosial *</Label>
            <Select
              value={socialDifficulties ? 'true' : 'false'}
              onValueChange={(val) => setValue('socialDifficulties', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.socialDifficulties && (
              <p className="mt-1 text-sm text-red-600">{errors.socialDifficulties.message}</p>
            )}
          </div>

          <div>
            <Label>Ada Riwayat Bullying *</Label>
            <Select
              value={bullyingHistory ? 'true' : 'false'}
              onValueChange={(val) => setValue('bullyingHistory', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.bullyingHistory && (
              <p className="mt-1 text-sm text-red-600">{errors.bullyingHistory.message}</p>
            )}
          </div>
        </div>

        {socialDifficulties && (
          <div className="mt-6">
            <Label htmlFor="socialDifficultiesDetails">Detail Kesulitan Sosial *</Label>
            <Textarea 
              id="socialDifficultiesDetails" 
              rows={3}
              placeholder="Jelaskan detail kesulitan sosial yang dialami"
              {...register('socialDifficultiesDetails')} 
            />
            {errors.socialDifficultiesDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.socialDifficultiesDetails.message}</p>
            )}
          </div>
        )}

        {bullyingHistory && (
          <div className="mt-6">
            <Label htmlFor="bullyingDetails">Detail Riwayat Bullying *</Label>
            <Textarea 
              id="bullyingDetails" 
              rows={3}
              placeholder="Jelaskan detail riwayat bullying"
              {...register('bullyingDetails')} 
            />
            {errors.bullyingDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.bullyingDetails.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Developmental Considerations */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pertimbangan Perkembangan</h3>
        <p className="text-sm text-gray-600 mb-4">Informasi tentang perkembangan anak</p>
        
        <div>
          <Label htmlFor="developmentalMilestones">Pencapaian Perkembangan *</Label>
          <Textarea 
            id="developmentalMilestones" 
            rows={3}
            placeholder="Jelaskan pencapaian perkembangan anak"
            {...register('developmentalMilestones')} 
          />
          {errors.developmentalMilestones && (
            <p className="mt-1 text-sm text-red-600">{errors.developmentalMilestones.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label>Ada Masalah Perhatian *</Label>
            <Select
              value={attentionConcerns ? 'true' : 'false'}
              onValueChange={(val) => setValue('attentionConcerns', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.attentionConcerns && (
              <p className="mt-1 text-sm text-red-600">{errors.attentionConcerns.message}</p>
            )}
          </div>

          <div>
            <Label>Ada Masalah Perilaku *</Label>
            <Select
              value={behavioralConcerns ? 'true' : 'false'}
              onValueChange={(val) => setValue('behavioralConcerns', val === 'true', { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jawaban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {errors.behavioralConcerns && (
              <p className="mt-1 text-sm text-red-600">{errors.behavioralConcerns.message}</p>
            )}
          </div>
        </div>

        {attentionConcerns && (
          <div className="mt-6">
            <Label htmlFor="attentionDetails">Detail Masalah Perhatian *</Label>
            <Textarea 
              id="attentionDetails" 
              rows={3}
              placeholder="Jelaskan detail masalah perhatian"
              {...register('attentionDetails')} 
            />
            {errors.attentionDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.attentionDetails.message}</p>
            )}
          </div>
        )}

        {behavioralConcerns && (
          <div className="mt-6">
            <Label htmlFor="behavioralDetails">Detail Masalah Perilaku *</Label>
            <Textarea 
              id="behavioralDetails" 
              rows={3}
              placeholder="Jelaskan detail masalah perilaku"
              {...register('behavioralDetails')} 
            />
            {errors.behavioralDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.behavioralDetails.message}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultationForm;