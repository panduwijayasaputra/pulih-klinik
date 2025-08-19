import { z } from 'zod';
import { ConsultationFormTypeEnum, ConsultationStatusEnum } from '@/types/consultation';

// Emotion scale schema
const emotionScaleSchema = z.object({
  happiness: z.number().min(0).max(10).default(0),
  sadness: z.number().min(0).max(10).default(0),
  anger: z.number().min(0).max(10).default(0),
  fear: z.number().min(0).max(10).default(0),
  anxiety: z.number().min(0).max(10).default(0),
  worry: z.number().min(0).max(10).default(0),
  stress: z.number().min(0).max(10).default(0),
  depression: z.number().min(0).max(10).default(0),
  frustration: z.number().min(0).max(10).default(0),
  disappointment: z.number().min(0).max(10).default(0),
  guilt: z.number().min(0).max(10).default(0),
  shame: z.number().min(0).max(10).default(0),
  envy: z.number().min(0).max(10).default(0),
  jealousy: z.number().min(0).max(10).default(0),
  hatred: z.number().min(0).max(10).default(0),
  loneliness: z.number().min(0).max(10).default(0),
  calmness: z.number().min(0).max(10).default(0),
  confidence: z.number().min(0).max(10).default(0),
  optimism: z.number().min(0).max(10).default(0),
  despair: z.number().min(0).max(10).default(0),
});

// Substance history schema
const substanceHistorySchema = z.object({
  alcohol: z.boolean().default(false),
  marijuana: z.boolean().default(false),
  methamphetamine: z.boolean().default(false),
  cocaine: z.boolean().default(false),
  heroin: z.boolean().default(false),
  ecstasy: z.boolean().default(false),
  inhalants: z.boolean().default(false),
  prescription_drugs: z.boolean().default(false),
  other_substances: z.boolean().default(false),
});

// Consultation reasons schema for minors
const consultationReasonsSchema = z.object({
  learning_difficulties: z.boolean().default(false),
  emotional_problems: z.boolean().default(false),
  social_problems: z.boolean().default(false),
  behavioral_problems: z.boolean().default(false),
  trauma: z.boolean().default(false),
  sleep_eating_disorders: z.boolean().default(false),
});

// Base consultation schema with common fields
const baseConsultationSchema = z.object({
  clientId: z.string().min(1, 'Client ID wajib diisi'),
  therapistId: z.string().min(1, 'Therapist ID wajib diisi'),
  formTypes: z.array(z.nativeEnum(ConsultationFormTypeEnum, {
    errorMap: () => ({ message: 'Jenis konsultasi tidak valid' }),
  })).min(1, 'Minimal satu jenis konsultasi harus dipilih'),
  status: z.nativeEnum(ConsultationStatusEnum, {
    errorMap: () => ({ message: 'Status konsultasi tidak valid' }),
  }).default(ConsultationStatusEnum.Draft),
  
  // Session information
  sessionDate: z.string().min(1, 'Tanggal sesi wajib diisi'),
  sessionDuration: z.number()
    .min(15, 'Durasi sesi minimal 15 menit')
    .max(180, 'Durasi sesi maksimal 180 menit'),
  consultationNotes: z.string().optional(),
  
  // Client background information
  previousTherapyExperience: z.boolean({
    errorMap: () => ({ message: 'Pilih apakah klien pernah terapi sebelumnya' }),
  }),
  previousTherapyDetails: z.string().optional(),
  currentMedications: z.boolean({
    errorMap: () => ({ message: 'Pilih apakah klien sedang mengonsumsi obat' }),
  }),
  currentMedicationsDetails: z.string().optional(),
  
  // Additional psychological history
  previousPsychologicalDiagnosis: z.boolean(),
  previousPsychologicalDiagnosisDetails: z.string().optional(),
  significantPhysicalIllness: z.boolean(),
  significantPhysicalIllnessDetails: z.string().optional(),
  traumaticExperience: z.boolean(),
  traumaticExperienceDetails: z.string().optional(),
  familyPsychologicalHistory: z.boolean(),
  familyPsychologicalHistoryDetails: z.string().optional(),
  
  // Presenting concerns
  primaryConcern: z.string().min(10, 'Keluhan utama minimal 10 karakter'),
  secondaryConcerns: z.array(z.string()).optional(),
  symptomSeverity: z.number()
    .min(1, 'Tingkat keparahan minimal 1')
    .max(5, 'Tingkat keparahan maksimal 5') as z.ZodType<1 | 2 | 3 | 4 | 5>,
  symptomDuration: z.string().min(1, 'Durasi gejala wajib diisi'),
  
  // Emotion scale
  emotionScale: emotionScaleSchema.optional(),
  
  // Goals and expectations
  treatmentGoals: z.array(z.string().min(1, 'Tujuan terapi tidak boleh kosong'))
    .min(1, 'Minimal satu tujuan terapi wajib diisi'),
  clientExpectations: z.string().optional(),
  
  // Assessment results
  initialAssessment: z.string().optional(),
  recommendedTreatmentPlan: z.string().optional(),
  
  // Consent and signature
  consentAgreement: z.boolean().default(false),
  clientSignatureName: z.string().optional(),
  clientSignatureDate: z.string().optional(),
  therapistName: z.string().optional(),
  registrationDate: z.string().optional(),
  initialRecommendation: z.array(z.string()).optional(),
}).refine((data) => {
  // If previous therapy experience is true, details must be provided
  if (data.previousTherapyExperience && !data.previousTherapyDetails?.trim()) {
    return false;
  }
  // If currently taking medications, details must be provided
  if (data.currentMedications && !data.currentMedicationsDetails?.trim()) {
    return false;
  }
  // If previous psychological diagnosis is true, details must be provided
  if (data.previousPsychologicalDiagnosis && !data.previousPsychologicalDiagnosisDetails?.trim()) {
    return false;
  }
  // If significant physical illness is true, details must be provided
  if (data.significantPhysicalIllness && !data.significantPhysicalIllnessDetails?.trim()) {
    return false;
  }
  // If traumatic experience is true, details must be provided
  if (data.traumaticExperience && !data.traumaticExperienceDetails?.trim()) {
    return false;
  }
  // If family psychological history is true, details must be provided
  if (data.familyPsychologicalHistory && !data.familyPsychologicalHistoryDetails?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Detail wajib diisi jika jawaban "Ya" dipilih',
  path: ['previousTherapyDetails', 'currentMedicationsDetails', 'previousPsychologicalDiagnosisDetails', 'significantPhysicalIllnessDetails', 'traumaticExperienceDetails', 'familyPsychologicalHistoryDetails'],
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
    errorMap: () => ({ message: 'Pilih apakah ada riwayat gangguan mental dalam keluarga' }),
  }),
  familyMentalHealthDetails: z.string().optional(),
  previousMentalHealthDiagnosis: z.boolean({
    errorMap: () => ({ message: 'Pilih apakah pernah didiagnosis gangguan mental' }),
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
  substanceHistory: substanceHistorySchema.optional(),
  otherSubstancesDetails: z.string().optional(),
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
    errorMap: () => ({ message: 'Pilih apakah lingkungan sosial menggunakan zat' }),
  }),
  triggerSituations: z.array(z.string().min(1, 'Situasi pemicu tidak boleh kosong'))
    .min(0, 'Minimal satu situasi pemicu'),
  environmentalFactors: z.array(z.string().min(1, 'Faktor lingkungan tidak boleh kosong'))
    .default([]),
  
  // Recovery history
  previousTreatmentPrograms: z.boolean({
    errorMap: () => ({ message: 'Pilih apakah pernah mengikuti program pemulihan' }),
  }),
  previousTreatmentDetails: z.string().optional(),
  currentSobrietyPeriod: z.string().optional(),
  
  // Legal and financial impact
  legalIssuesRelated: z.boolean({
    errorMap: () => ({ message: 'Pilih apakah ada masalah hukum terkait' }),
  }),
  legalIssuesDetails: z.string().optional(),
  financialImpact: z.string().min(5, 'Dampak finansial minimal 5 karakter'),
  
  // Recovery goals and motivation
  desireToQuit: z.string().optional(),
  recoveryGoals: z.array(z.string()).optional(),
  willingForFollowUp: z.boolean().optional(),
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
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianOccupation: z.string().optional(),
  parentalMaritalStatus: z.string().optional(),
  legalCustody: z.boolean().optional(),
  guardianAddress: z.string().optional(),
  
  // Guardian signature
  guardianSignatureName: z.string().optional(),
  guardianSignatureDate: z.string().optional(),
  clientCanSign: z.boolean().optional(),
  
  // Consultation reasons for minors
  consultationReasons: consultationReasonsSchema.optional(),
  otherConsultationReason: z.string().optional(),
  problemOnset: z.string().optional(),
  previousPsychologicalHelp: z.boolean().optional(),
  previousPsychologicalHelpDetails: z.string().optional(),
  
  // School information
  currentGradeLevel: z.string().optional(),
  academicPerformance: z.number()
    .min(1, 'Performa akademik minimal 1')
    .max(5, 'Performa akademik maksimal 5') as z.ZodType<1 | 2 | 3 | 4 | 5>,
  schoolBehaviorIssues: z.boolean().optional(),
  schoolBehaviorDetails: z.string().optional(),
  teacherConcerns: z.string().optional(),
  bullyingHistory: z.boolean().optional(),
  bullyingDetails: z.string().optional(),
  
  // Family and social
  familyStructure: z.string().optional(),
  siblingRelationships: z.string().optional(),
  peerRelationships: z.string().optional(),
  familyConflicts: z.boolean().optional(),
  familyConflictsDetails: z.string().optional(),
  socialDifficulties: z.boolean().optional(),
  socialDifficultiesDetails: z.string().optional(),
  
  // Developmental assessment
  developmentalMilestones: z.string().optional(),
  attentionConcerns: z.boolean().optional(),
  attentionDetails: z.string().optional(),
  behavioralConcerns: z.boolean().optional(),
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