import { z } from 'zod';
import { ConsultationFormTypeEnum, ConsultationStatusEnum } from '@/types/consultation';

// Base consultation schema with common fields
const baseConsultationSchema = z.object({
  clientId: z.string().min(1, 'Client ID wajib diisi'),
  therapistId: z.string().min(1, 'Therapist ID wajib diisi'),
  formType: z.nativeEnum(ConsultationFormTypeEnum, {
    invalid_type_error: 'Jenis konsultasi tidak valid',
  }),
  status: z.nativeEnum(ConsultationStatusEnum, {
    invalid_type_error: 'Status konsultasi tidak valid',
  }).default(ConsultationStatusEnum.Draft),
  
  // Session information
  sessionDate: z.string().min(1, 'Tanggal sesi wajib diisi'),
  sessionDuration: z.number()
    .min(15, 'Durasi sesi minimal 15 menit')
    .max(180, 'Durasi sesi maksimal 180 menit'),
  consultationNotes: z.string().optional(),
  
  // Client background information
  previousTherapyExperience: z.boolean({
    invalid_type_error: 'Pilih apakah klien pernah terapi sebelumnya',
  }),
  previousTherapyDetails: z.string().optional(),
  currentMedications: z.boolean({
    invalid_type_error: 'Pilih apakah klien sedang mengonsumsi obat',
  }),
  currentMedicationsDetails: z.string().optional(),
  
  // Presenting concerns
  primaryConcern: z.string().min(10, 'Keluhan utama minimal 10 karakter'),
  secondaryConcerns: z.array(z.string()).optional(),
  symptomSeverity: z.number()
    .min(1, 'Tingkat keparahan minimal 1')
    .max(5, 'Tingkat keparahan maksimal 5') as z.ZodType<1 | 2 | 3 | 4 | 5>,
  symptomDuration: z.string().min(1, 'Durasi gejala wajib diisi'),
  
  // Goals and expectations
  treatmentGoals: z.array(z.string().min(1, 'Tujuan terapi tidak boleh kosong'))
    .min(1, 'Minimal satu tujuan terapi wajib diisi'),
  clientExpectations: z.string().optional(),
  
  // Assessment results
  initialAssessment: z.string().optional(),
  recommendedTreatmentPlan: z.string().optional(),
}).refine((data) => {
  // If previous therapy experience is true, details must be provided
  if (data.previousTherapyExperience && !data.previousTherapyDetails?.trim()) {
    return false;
  }
  // If currently taking medications, details must be provided
  if (data.currentMedications && !data.currentMedicationsDetails?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Detail wajib diisi jika jawaban "Ya" dipilih',
  path: ['previousTherapyDetails', 'currentMedicationsDetails'],
});

// General consultation schema
export const generalConsultationSchema = baseConsultationSchema.extend({
  formType: z.literal(ConsultationFormTypeEnum.General),
  
  // Life circumstances
  currentLifeStressors: z.array(z.string().min(1, 'Stressor tidak boleh kosong'))
    .min(0, 'Minimal satu stressor hidup wajib diisi'),
  supportSystem: z.string().min(5, 'Sistem dukungan minimal 5 karakter'),
  workLifeBalance: z.number()
    .min(1, 'Keseimbangan hidup-kerja minimal 1')
    .max(5, 'Keseimbangan hidup-kerja maksimal 5') as z.ZodType<1 | 2 | 3 | 4 | 5>,
  
  // Mental health history
  familyMentalHealthHistory: z.boolean({
    invalid_type_error: 'Pilih apakah ada riwayat gangguan mental dalam keluarga',
  }),
  familyMentalHealthDetails: z.string().optional(),
  previousMentalHealthDiagnosis: z.boolean({
    invalid_type_error: 'Pilih apakah pernah didiagnosis gangguan mental',
  }),
  previousMentalHealthDiagnosisDetails: z.string().optional(),
  
  // Lifestyle factors
  sleepPatterns: z.string().min(5, 'Pola tidur minimal 5 karakter'),
  exerciseFrequency: z.string().min(3, 'Frekuensi olahraga minimal 3 karakter'),
  dietaryHabits: z.string().min(5, 'Kebiasaan makan minimal 5 karakter'),
  socialConnections: z.string().min(5, 'Koneksi sosial minimal 5 karakter'),
}).refine((data) => {
  // If family mental health history is true, details must be provided
  if (data.familyMentalHealthHistory && !data.familyMentalHealthDetails?.trim()) {
    return false;
  }
  // If previous mental health diagnosis is true, details must be provided
  if (data.previousMentalHealthDiagnosis && !data.previousMentalHealthDiagnosisDetails?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Detail wajib diisi jika jawaban "Ya" dipilih',
  path: ['familyMentalHealthDetails', 'previousMentalHealthDiagnosisDetails'],
});

// Drug addiction consultation schema
export const drugAddictionConsultationSchema = baseConsultationSchema.extend({
  formType: z.literal(ConsultationFormTypeEnum.DrugAddiction),
  
  // Substance use history
  primarySubstance: z.string().min(2, 'Zat utama minimal 2 karakter'),
  additionalSubstances: z.array(z.string()).default([]),
  ageOfFirstUse: z.number()
    .min(5, 'Usia pertama kali menggunakan tidak valid')
    .max(100, 'Usia pertama kali menggunakan tidak valid'),
  frequencyOfUse: z.string().min(3, 'Frekuensi penggunaan minimal 3 karakter'),
  quantityPerUse: z.string().min(2, 'Jumlah per penggunaan minimal 2 karakter'),
  lastUseDate: z.string().min(1, 'Tanggal terakhir penggunaan wajib diisi'),
  
  // Addiction severity
  withdrawalSymptoms: z.array(z.string().min(1, 'Gejala putus zat tidak boleh kosong'))
    .default([]),
  toleranceLevel: z.number()
    .min(1, 'Tingkat toleransi minimal 1')
    .max(5, 'Tingkat toleransi maksimal 5') as z.ZodType<1 | 2 | 3 | 4 | 5>,
  impactOnDailyLife: z.string().min(10, 'Dampak pada kehidupan sehari-hari minimal 10 karakter'),
  attemptsToQuit: z.number()
    .min(0, 'Jumlah percobaan berhenti tidak boleh negatif')
    .max(50, 'Jumlah percobaan berhenti tidak realistis'),
  
  // Social and environmental factors
  socialCircleSubstanceUse: z.boolean({
    invalid_type_error: 'Pilih apakah lingkungan sosial menggunakan zat',
  }),
  triggerSituations: z.array(z.string().min(1, 'Situasi pemicu tidak boleh kosong'))
    .min(0, 'Minimal satu situasi pemicu'),
  environmentalFactors: z.array(z.string().min(1, 'Faktor lingkungan tidak boleh kosong'))
    .default([]),
  
  // Recovery history
  previousTreatmentPrograms: z.boolean({
    invalid_type_error: 'Pilih apakah pernah mengikuti program pemulihan',
  }),
  previousTreatmentDetails: z.string().optional(),
  currentSobrietyPeriod: z.string().optional(),
  
  // Legal and financial impact
  legalIssuesRelated: z.boolean({
    invalid_type_error: 'Pilih apakah ada masalah hukum terkait',
  }),
  legalIssuesDetails: z.string().optional(),
  financialImpact: z.string().min(5, 'Dampak finansial minimal 5 karakter'),
}).refine((data) => {
  // If previous treatment programs is true, details must be provided
  if (data.previousTreatmentPrograms && !data.previousTreatmentDetails?.trim()) {
    return false;
  }
  // If legal issues related is true, details must be provided
  if (data.legalIssuesRelated && !data.legalIssuesDetails?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Detail wajib diisi jika jawaban "Ya" dipilih',
  path: ['previousTreatmentDetails', 'legalIssuesDetails'],
});

// Minor consultation schema
export const minorConsultationSchema = baseConsultationSchema.extend({
  formType: z.literal(ConsultationFormTypeEnum.Minor),
  
  // Guardian information
  guardianPresent: z.boolean({
    invalid_type_error: 'Pilih apakah wali hadir dalam sesi',
  }),
  guardianRelationship: z.string().min(3, 'Hubungan dengan wali minimal 3 karakter'),
  guardianConcerns: z.string().min(10, 'Kekhawatiran wali minimal 10 karakter'),
  
  // School and academic information
  currentGradeLevel: z.string().min(1, 'Tingkat kelas wajib diisi'),
  academicPerformance: z.number()
    .min(1, 'Performa akademik minimal 1')
    .max(5, 'Performa akademik maksimal 5') as z.ZodType<1 | 2 | 3 | 4 | 5>,
  schoolBehaviorIssues: z.boolean({
    invalid_type_error: 'Pilih apakah ada masalah perilaku di sekolah',
  }),
  schoolBehaviorDetails: z.string().optional(),
  teacherConcerns: z.string().optional(),
  
  // Family dynamics
  familyStructure: z.string().min(5, 'Struktur keluarga minimal 5 karakter'),
  siblingRelationships: z.string().min(5, 'Hubungan dengan saudara minimal 5 karakter'),
  parentalConcerns: z.array(z.string().min(1, 'Kekhawatiran orangtua tidak boleh kosong'))
    .min(1, 'Minimal satu kekhawatiran orangtua wajib diisi'),
  familyConflicts: z.boolean({
    invalid_type_error: 'Pilih apakah ada konflik dalam keluarga',
  }),
  familyConflictsDetails: z.string().optional(),
  
  // Social and peer relationships
  peerRelationships: z.string().min(5, 'Hubungan dengan teman sebaya minimal 5 karakter'),
  socialDifficulties: z.boolean({
    invalid_type_error: 'Pilih apakah ada kesulitan sosial',
  }),
  socialDifficultiesDetails: z.string().optional(),
  bullyingHistory: z.boolean({
    invalid_type_error: 'Pilih apakah ada riwayat bullying',
  }),
  bullyingDetails: z.string().optional(),
  
  // Developmental considerations
  developmentalMilestones: z.string().min(10, 'Pencapaian perkembangan minimal 10 karakter'),
  attentionConcerns: z.boolean({
    invalid_type_error: 'Pilih apakah ada masalah perhatian',
  }),
  attentionDetails: z.string().optional(),
  behavioralConcerns: z.boolean({
    invalid_type_error: 'Pilih apakah ada masalah perilaku',
  }),
  behavioralDetails: z.string().optional(),
}).refine((data) => {
  // If school behavior issues is true, details must be provided
  if (data.schoolBehaviorIssues && !data.schoolBehaviorDetails?.trim()) {
    return false;
  }
  // If family conflicts is true, details must be provided
  if (data.familyConflicts && !data.familyConflictsDetails?.trim()) {
    return false;
  }
  // If social difficulties is true, details must be provided
  if (data.socialDifficulties && !data.socialDifficultiesDetails?.trim()) {
    return false;
  }
  // If bullying history is true, details must be provided
  if (data.bullyingHistory && !data.bullyingDetails?.trim()) {
    return false;
  }
  // If attention concerns is true, details must be provided
  if (data.attentionConcerns && !data.attentionDetails?.trim()) {
    return false;
  }
  // If behavioral concerns is true, details must be provided
  if (data.behavioralConcerns && !data.behavioralDetails?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Detail wajib diisi jika jawaban "Ya" dipilih',
  path: ['schoolBehaviorDetails', 'familyConflictsDetails', 'socialDifficultiesDetails', 'bullyingDetails', 'attentionDetails', 'behavioralDetails'],
});

// Union schema for all consultation types
export const consultationSchema = z.discriminatedUnion('formType', [
  generalConsultationSchema,
  drugAddictionConsultationSchema,
  minorConsultationSchema,
]);

// Create a base update schema
const baseUpdateSchema = z.object({
  id: z.string().min(1, 'ID konsultasi wajib diisi'),
});

// Update consultation schema (with optional id and timestamps)
export const updateConsultationSchema = z.union([
  generalConsultationSchema.extend(baseUpdateSchema.shape).partial().required({ id: true }),
  drugAddictionConsultationSchema.extend(baseUpdateSchema.shape).partial().required({ id: true }),
  minorConsultationSchema.extend(baseUpdateSchema.shape).partial().required({ id: true }),
]);

// Form validation schemas for step-by-step validation
export const consultationStepSchemas = {
  // Step 1: Basic information
  basicInfo: z.object({
    formType: z.nativeEnum(ConsultationFormTypeEnum),
    sessionDate: z.string().min(1, 'Tanggal sesi wajib diisi'),
    sessionDuration: z.number().min(15).max(180),
  }),
  
  // Step 2: Client background
  clientBackground: z.object({
    previousTherapyExperience: z.boolean(),
    previousTherapyDetails: z.string().optional(),
    currentMedications: z.boolean(),
    currentMedicationsDetails: z.string().optional(),
  }),
  
  // Step 3: Presenting concerns
  presentingConcerns: z.object({
    primaryConcern: z.string().min(10),
    secondaryConcerns: z.array(z.string()).optional(),
    symptomSeverity: z.number().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
    symptomDuration: z.string().min(1),
  }),
  
  // Step 4: Treatment goals
  treatmentGoals: z.object({
    treatmentGoals: z.array(z.string().min(1)).min(1),
    clientExpectations: z.string().optional(),
  }),
};

// Export types inferred from schemas
export type GeneralConsultationFormData = z.infer<typeof generalConsultationSchema>;
export type DrugAddictionConsultationFormData = z.infer<typeof drugAddictionConsultationSchema>;
export type MinorConsultationFormData = z.infer<typeof minorConsultationSchema>;
export type ConsultationFormData = z.infer<typeof consultationSchema>;
export type UpdateConsultationFormData = z.infer<typeof updateConsultationSchema>;