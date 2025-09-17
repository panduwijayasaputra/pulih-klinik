import { z } from 'zod';
import { ConsultationFormTypeEnum, ConsultationStatusEnum } from '@/types/enums';

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
  formTypes: z.array(z.nativeEnum(ConsultationFormTypeEnum)).min(1, 'Pilih minimal satu jenis konsultasi'),
  status: z.nativeEnum(ConsultationStatusEnum).default(ConsultationStatusEnum.Draft),
  
  // Session information
  sessionDate: z.string().min(1, 'Tanggal sesi wajib diisi'),
  sessionDuration: z.number()
    .min(15, 'Durasi sesi minimal 15 menit')
    .max(180, 'Durasi sesi maksimal 180 menit'),
  consultationNotes: z.string().optional(),
  scriptGenerationPreferences: z.string().optional(),
  
  // Client background information
  previousTherapyExperience: z.boolean(),
  previousTherapyDetails: z.string().optional(),
  currentMedications: z.boolean(),
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
  
  // Recent mood and emotions
  recentMoodState: z.enum(['excellent', 'good', 'neutral', 'bad', 'very_bad']).optional(),
  recentMoodStateDetails: z.string().optional(),
  frequentEmotions: z.array(z.string()).optional(),
  
  // Self-harm and stress assessment
  selfHarmThoughts: z.enum(['never', 'rarely', 'sometimes', 'often', 'very_often']).optional(),
  selfHarmDetails: z.string().optional(),
  dailyStressFrequency: z.enum(['never', 'rarely', 'sometimes', 'often', 'always', 'very_often']).optional(),
  
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
  formTypes: z.array(z.literal(ConsultationFormTypeEnum.General)).min(1),
  
  // Life circumstances
  currentLifeStressors: z.array(z.string().min(1, 'Stressor tidak boleh kosong'))
    .min(0, 'Minimal satu stressor hidup wajib diisi'),
  supportSystem: z.string().min(5, 'Sistem dukungan minimal 5 karakter'),
  workLifeBalance: z.number()
    .min(1, 'Keseimbangan hidup-kerja minimal 1')
    .max(5, 'Keseimbangan hidup-kerja maksimal 5') as z.ZodType<1 | 2 | 3 | 4 | 5>,
  
  // Mental health history
  familyMentalHealthHistory: z.boolean(),
  familyMentalHealthDetails: z.string().optional(),
  previousMentalHealthDiagnosis: z.boolean(),
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
  formTypes: z.array(z.literal(ConsultationFormTypeEnum.DrugAddiction)).min(1),
  
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
  socialCircleSubstanceUse: z.boolean(),
  triggerSituations: z.array(z.string().min(1, 'Situasi pemicu tidak boleh kosong'))
    .min(0, 'Minimal satu situasi pemicu'),
  environmentalFactors: z.array(z.string().min(1, 'Faktor lingkungan tidak boleh kosong'))
    .default([]),
  
  // Recovery history
  previousTreatmentPrograms: z.boolean(),
  previousTreatmentDetails: z.string().optional(),
  currentSobrietyPeriod: z.string().optional(),
  
  // Legal and financial impact
  legalIssuesRelated: z.boolean(),
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
  formTypes: z.array(z.literal(ConsultationFormTypeEnum.Minor)).min(1),
  
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

// Comprehensive consultation schema that includes all fields from all types
export const consultationSchema = baseConsultationSchema.extend({
  // General consultation fields
  currentLifeStressors: z.array(z.string().min(1, 'Stressor tidak boleh kosong')).optional(),
  supportSystem: z.string().optional(),
  workLifeBalance: z.number().optional(),
  
  // Drug addiction fields
  substanceHistory: substanceHistorySchema.optional(),
  otherSubstancesDetails: z.string().optional(),
  primarySubstance: z.string().optional(),
  additionalSubstances: z.array(z.string()).optional(),
  ageOfFirstUse: z.number().optional(),
  frequencyOfUse: z.string().optional(),
  quantityPerUse: z.string().optional(),
  lastUseDate: z.string().optional(),
  withdrawalSymptoms: z.array(z.string()).optional(),
  toleranceLevel: z.number().optional(),
  impactOnDailyLife: z.string().optional(),
  attemptsToQuit: z.number().optional(),
  socialCircleSubstanceUse: z.boolean().optional(),
  triggerSituations: z.array(z.string()).optional(),
  environmentalFactors: z.array(z.string()).optional(),
  previousTreatmentPrograms: z.boolean().optional(),
  previousTreatmentDetails: z.string().optional(),
  currentSobrietyPeriod: z.string().optional(),
  legalIssuesRelated: z.boolean().optional(),
  legalIssuesDetails: z.string().optional(),
  financialImpact: z.string().optional(),
  desireToQuit: z.string().optional(),
  recoveryGoals: z.array(z.string()).optional(),
  willingForFollowUp: z.boolean().optional(),
  
  // Minor consultation fields
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianOccupation: z.string().optional(),
  parentalMaritalStatus: z.string().optional(),
  legalCustody: z.boolean().optional(),
  guardianAddress: z.string().optional(),
  guardianSignatureName: z.string().optional(),
  guardianSignatureDate: z.string().optional(),
  clientCanSign: z.boolean().optional(),
  consultationReasons: consultationReasonsSchema.optional(),
  otherConsultationReason: z.string().optional(),
  problemOnset: z.string().optional(),
  previousPsychologicalHelp: z.boolean().optional(),
  previousPsychologicalHelpDetails: z.string().optional(),
  currentGradeLevel: z.string().optional(),
  academicPerformance: z.number().optional(),
  schoolBehaviorIssues: z.boolean().optional(),
  schoolBehaviorDetails: z.string().optional(),
  teacherConcerns: z.string().optional(),
  bullyingHistory: z.boolean().optional(),
  bullyingDetails: z.string().optional(),
  familyStructure: z.string().optional(),
  siblingRelationships: z.string().optional(),
  peerRelationships: z.string().optional(),
  familyConflicts: z.boolean().optional(),
  familyConflictsDetails: z.string().optional(),
  socialDifficulties: z.boolean().optional(),
  socialDifficultiesDetails: z.string().optional(),
  developmentalMilestones: z.string().optional(),
  attentionConcerns: z.boolean().optional(),
  attentionDetails: z.string().optional(),
  behavioralConcerns: z.boolean().optional(),
  behavioralDetails: z.string().optional(),
  
  // Script generation preferences (added to comprehensive schema for consistency)
  scriptGenerationPreferences: z.string().optional(),

  // Separate form data sections
  generalFormData: z.object({
    stressLevel: z.number().min(1).max(10).optional(),
    primaryStressors: z.array(z.string()).optional(),
    supportSystem: z.string().optional(),
    dailyRoutine: z.string().optional(),
    exerciseHabits: z.string().optional(),
    sleepPatterns: z.string().optional(),
    nutritionHabits: z.string().optional(),
    hobbiesInterests: z.array(z.string()).optional(),
    spiritualBeliefs: z.string().optional(),
    culturalFactors: z.string().optional(),
    recentMoodState: z.enum(['excellent', 'good', 'neutral', 'bad', 'very_bad']).optional(),
    recentMoodStateDetails: z.string().optional(),
    frequentEmotions: z.array(z.string()).optional(),
    selfHarmThoughts: z.enum(['never', 'rarely', 'sometimes', 'often', 'very_often']).optional(),
    selfHarmDetails: z.string().optional(),
    dailyStressFrequency: z.enum(['never', 'rarely', 'sometimes', 'often', 'very_often']).optional(),
    emotionScale: z.record(z.string(), z.number().min(0).max(10)).optional(),
  }).optional(),

  drugAddictionFormData: z.object({
    substanceTypes: z.array(z.string()).optional(),
    firstUseAge: z.number().min(1).max(100).optional(),
    usageFrequency: z.string().optional(),
    lastUseDate: z.string().optional(),
    triggersRelapse: z.array(z.string()).optional(),
    previousTreatments: z.array(z.string()).optional(),
    withdrawalSymptoms: z.array(z.string()).optional(),
    motivationToQuit: z.number().min(1).max(10).optional(),
    supportSystemAvailability: z.string().optional(),
    legalIssues: z.boolean().optional(),
    occupationalImpact: z.string().optional(),
    healthComplications: z.array(z.string()).optional(),
    primarySubstance: z.string().optional(),
    quantityPerUse: z.string().optional(),
    attemptsToQuit: z.number().min(0).optional(),
    currentSobrietyPeriod: z.string().optional(),
    financialImpact: z.string().optional(),
    desireToQuit: z.enum(['Yes', 'Yes, but unsure', 'No']).optional(),
    recoveryGoals: z.array(z.string()).optional(),
    willingForFollowUp: z.boolean().optional(),
  }).optional(),

  minorFormData: z.object({
    guardianName: z.string().optional(),
    guardianRelationship: z.string().optional(),
    guardianPhone: z.string().optional(),
    schoolName: z.string().optional(),
    grade: z.string().optional(),
    schoolPerformance: z.string().optional(),
    behaviorAtSchool: z.string().optional(),
    behaviorAtHome: z.string().optional(),
    friendsRelationships: z.string().optional(),
    developmentalMilestones: z.string().optional(),
    familyDynamics: z.string().optional(),
    parentalConcerns: z.array(z.string()).optional(),
    previousProfessionalHelp: z.boolean().optional(),
    medicationsSupplements: z.array(z.string()).optional(),
    specialNeeds: z.array(z.string()).optional(),
    consultationReasons: z.array(z.string()).optional(),
    otherConsultationReason: z.string().optional(),
    problemOnset: z.string().optional(),
    previousPsychologicalHelpDetails: z.string().optional(),
    currentGradeLevel: z.string().optional(),
    academicPerformance: z.number().min(1).max(5).optional(),
    schoolBehaviorIssues: z.boolean().optional(),
    schoolBehaviorDetails: z.string().optional(),
    teacherConcerns: z.string().optional(),
    bullyingHistory: z.boolean().optional(),
    familyStructure: z.string().optional(),
    siblingRelationships: z.string().optional(),
    peerRelationships: z.string().optional(),
    familyConflicts: z.boolean().optional(),
    socialDifficulties: z.boolean().optional(),
    socialDifficultiesDetails: z.string().optional(),
    attentionConcerns: z.boolean().optional(),
    attentionDetails: z.string().optional(),
    behavioralConcerns: z.boolean().optional(),
    behavioralDetails: z.string().optional(),
  }).optional(),
});

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

