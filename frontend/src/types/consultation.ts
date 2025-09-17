import { ConsultationFormTypeEnum, ConsultationStatusEnum } from './enums';

// Base consultation interface with common fields
export interface BaseConsultation {
  id: string;
  clientId: string;
  therapistId: string;
  formTypes: ConsultationFormTypeEnum[];
  status: ConsultationStatusEnum;
  createdAt: string;
  updatedAt: string;
  
  // Common fields for all consultation types
  sessionDate: string;
  sessionDuration: number; // in minutes
  consultationNotes?: string;
  
  // Client background information
  previousTherapyExperience: boolean;
  previousTherapyDetails?: string;
  currentMedications: boolean;
  currentMedicationsDetails?: string;
  
  // Presenting concerns
  primaryConcern: string;
  secondaryConcerns?: string[];
  symptomSeverity: 1 | 2 | 3 | 4 | 5; // 1 = mild, 5 = severe
  symptomDuration: string; // e.g., "2 weeks", "6 months"
  
  // Goals and expectations
  treatmentGoals: string[];
  clientExpectations?: string;
  
  // Assessment results
  initialAssessment?: string;
  recommendedTreatmentPlan?: string;
  
  // Additional psychological history fields
  previousPsychologicalDiagnosis: boolean;
  previousPsychologicalDiagnosisDetails?: string;
  significantPhysicalIllness: boolean;
  significantPhysicalIllnessDetails?: string;
  traumaticExperience: boolean;
  traumaticExperienceDetails?: string;
  familyPsychologicalHistory: boolean;
  familyPsychologicalHistoryDetails?: string;
  scriptGenerationPreferences?: string;
}

// General consultation interface
export interface GeneralConsultation extends BaseConsultation {
  formTypes: [ConsultationFormTypeEnum.General];
  
  // Life circumstances
  currentLifeStressors: string[];
  supportSystem: string; // family, friends, colleagues, etc.
  workLifeBalance: 1 | 2 | 3 | 4 | 5; // 1 = poor, 5 = excellent
  
  // Mental health history
  familyMentalHealthHistory: boolean;
  familyMentalHealthDetails?: string;
  previousMentalHealthDiagnosis: boolean;
  previousMentalHealthDiagnosisDetails?: string;
  
  // Lifestyle factors
  sleepPatterns: string;
  exerciseFrequency: string;
  dietaryHabits: string;
  socialConnections: string;
}

// Drug addiction consultation interface
export interface DrugAddictionConsultation extends BaseConsultation {
  formTypes: [ConsultationFormTypeEnum.DrugAddiction];
  
  // Substance use history
  primarySubstance: string;
  additionalSubstances: string[];
  ageOfFirstUse: number;
  frequencyOfUse: string;
  quantityPerUse: string;
  lastUseDate: string;
  
  // Addiction severity
  withdrawalSymptoms: string[];
  toleranceLevel: 1 | 2 | 3 | 4 | 5;
  impactOnDailyLife: string;
  attemptsToQuit: number;
  
  // Social and environmental factors
  socialCircleSubstanceUse: boolean;
  triggerSituations: string[];
  environmentalFactors: string[];
  
  // Recovery history
  previousTreatmentPrograms: boolean;
  previousTreatmentDetails?: string;
  currentSobrietyPeriod?: string;
  
  // Legal and financial impact
  legalIssuesRelated: boolean;
  legalIssuesDetails?: string;
  financialImpact: string;
}

// Minor consultation interface (for clients under 18)
export interface MinorConsultation extends BaseConsultation {
  formTypes: [ConsultationFormTypeEnum.Minor];
  
  // Guardian information
  guardianPresent: boolean;
  guardianRelationship: string;
  guardianConcerns: string;
  
  // School and academic information
  currentGradeLevel: string;
  academicPerformance: 1 | 2 | 3 | 4 | 5; // 1 = poor, 5 = excellent
  schoolBehaviorIssues: boolean;
  schoolBehaviorDetails?: string;
  teacherConcerns?: string;
  
  // Family dynamics
  familyStructure: string; // nuclear, single parent, blended, etc.
  siblingRelationships: string;
  parentalConcerns: string[];
  familyConflicts: boolean;
  familyConflictsDetails?: string;
  
  // Social and peer relationships
  peerRelationships: string;
  socialDifficulties: boolean;
  socialDifficultiesDetails?: string;
  bullyingHistory: boolean;
  bullyingDetails?: string;
  
  // Developmental considerations
  developmentalMilestones: string;
  attentionConcerns: boolean;
  attentionDetails?: string;
  behavioralConcerns: boolean;
  behavioralDetails?: string;
}

// Union type for all consultation types
export type Consultation = GeneralConsultation | DrugAddictionConsultation | MinorConsultation;

// API response types
export interface ConsultationResponse {
  success: boolean;
  data?: Consultation;
  message?: string;
}

export interface ConsultationListResponse {
  success: boolean;
  data?: {
    items: Consultation[];
    total: number;
    page: number;
    pageSize: number;
  };
  message?: string;
}

// Form data types for creating/updating consultations
export type CreateGeneralConsultationData = Omit<GeneralConsultation, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateDrugAddictionConsultationData = Omit<DrugAddictionConsultation, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateMinorConsultationData = Omit<MinorConsultation, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateConsultationData = CreateGeneralConsultationData | CreateDrugAddictionConsultationData | CreateMinorConsultationData;

export type UpdateConsultationData = Partial<CreateConsultationData> & { id: string };

// Helper type to get form data based on form type
export type ConsultationFormData<T extends ConsultationFormTypeEnum> = 
  T extends ConsultationFormTypeEnum.General ? CreateGeneralConsultationData :
  T extends ConsultationFormTypeEnum.DrugAddiction ? CreateDrugAddictionConsultationData :
  T extends ConsultationFormTypeEnum.Minor ? CreateMinorConsultationData :
  never;

// Labels for UI display
export const ConsultationFormTypeLabels: Record<ConsultationFormTypeEnum, string> = {
  [ConsultationFormTypeEnum.General]: 'Konsultasi Umum',
  [ConsultationFormTypeEnum.DrugAddiction]: 'Konsultasi Ketergantungan Obat',
  [ConsultationFormTypeEnum.Minor]: 'Konsultasi Anak & Remaja',
};

export const ConsultationStatusLabels: Record<ConsultationStatusEnum, string> = {
  [ConsultationStatusEnum.Draft]: 'Draft',
  [ConsultationStatusEnum.InProgress]: 'Sedang Berlangsung',
  [ConsultationStatusEnum.Completed]: 'Selesai',
  [ConsultationStatusEnum.Archived]: 'Diarsipkan',
};

// Severity level labels
export const SeverityLevelLabels: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Ringan',
  2: 'Ringan-Sedang',
  3: 'Sedang',
  4: 'Sedang-Berat',
  5: 'Berat',
};



// Validation error type
export interface ValidationError {
  path: string[];
  message: string;
}