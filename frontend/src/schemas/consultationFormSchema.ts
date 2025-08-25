import { z } from 'zod';
import { ConsultationFormTypeEnum, ConsultationStatusEnum } from '@/types/enums';

// Simplified consultation form schema for React Hook Form
export const consultationFormSchema = z.object({
  clientId: z.string().min(1, 'Client ID wajib diisi'),
  therapistId: z.string().min(1, 'Therapist ID wajib diisi'),
  formTypes: z.array(z.nativeEnum(ConsultationFormTypeEnum)).min(1, 'Pilih minimal satu jenis konsultasi'),
  status: z.nativeEnum(ConsultationStatusEnum),
  
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
    .max(5, 'Tingkat keparahan maksimal 5'),
  symptomDuration: z.string().min(1, 'Durasi gejala wajib diisi'),
  
  // Emotion scale (simplified)
  emotionScale: z.any().optional(),
  
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
  consentAgreement: z.boolean(),
  clientSignatureName: z.string().optional(),
  clientSignatureDate: z.string().optional(),
  therapistName: z.string().optional(),
  registrationDate: z.string().optional(),
  initialRecommendation: z.array(z.string()).optional(),
  
  // Additional fields for comprehensive schema compatibility
  currentLifeStressors: z.array(z.string()).optional(),
  supportSystem: z.string().optional(),
  workLifeBalance: z.number().optional(),
  
  // Drug addiction fields (optional)
  substanceHistory: z.any().optional(),
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
  
  // Minor consultation fields (optional)
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
  consultationReasons: z.any().optional(),
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

// Export the type
export type ConsultationFormSchemaType = z.infer<typeof consultationFormSchema>;
