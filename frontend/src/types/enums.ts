// Centralized enums mirroring literal string unions across the codebase.
// Note: These enums do not change existing types; they are provided for
// developer convenience and stronger autocomplete at call sites.

// Auth / Roles / Subscription
export enum UserRoleEnum {
  Administrator = 'administrator',
  ClinicAdmin = 'clinic_admin',
  Therapist = 'therapist',
}

export enum SubscriptionTierEnum {
  Beta = 'beta',
  Alpha = 'alpha',
  Theta = 'theta',
}

// Aliases for backward compatibility
export const AuthSubscriptionTierEnum = SubscriptionTierEnum;
export const ClinicSubscriptionTierEnum = SubscriptionTierEnum;

// Client
export enum ClientGenderEnum {
  Male = 'Male',
  Female = 'Female',
}

export const ClientGenderLabels: Record<ClientGenderEnum, string> = {
  [ClientGenderEnum.Male]: 'Laki-laki',
  [ClientGenderEnum.Female]: 'Perempuan',
};

export enum ClientEducationEnum {
  Elementary = 'Elementary',
  Middle = 'Middle',
  HighSchool = 'High School',
  Associate = 'Associate',
  Bachelor = 'Bachelor',
  Master = 'Master',
  Doctorate = 'Doctorate',
}

// Education labels for UI display
export const ClientEducationLabels: Record<ClientEducationEnum, string> = {
  [ClientEducationEnum.Elementary]: 'SD',
  [ClientEducationEnum.Middle]: 'SMP',
  [ClientEducationEnum.HighSchool]: 'SMA/SMK',
  [ClientEducationEnum.Associate]: 'D3',
  [ClientEducationEnum.Bachelor]: 'S1',
  [ClientEducationEnum.Master]: 'S2',
  [ClientEducationEnum.Doctorate]: 'S3',
};

export enum ClientStatusEnum {
  New = 'new',
  Assigned = 'assigned', 
  Consultation = 'consultation',
  Therapy = 'therapy',
  Done = 'done',
}

export const ClientStatusLabels: Record<ClientStatusEnum, string> = {
  [ClientStatusEnum.New]: 'Baru',
  [ClientStatusEnum.Assigned]: 'Telah Ditugaskan',
  [ClientStatusEnum.Consultation]: 'Konsultasi',
  [ClientStatusEnum.Therapy]: 'Terapi',
  [ClientStatusEnum.Done]: 'Selesai',
};

export enum ClientReligionEnum {
  Islam = 'Islam',
  Christianity = 'Christianity',
  Catholicism = 'Catholicism',
  Hinduism = 'Hinduism',
  Buddhism = 'Buddhism',
  Konghucu = 'Konghucu',
  Other = 'Other',
}

export const ClientReligionLabels: Record<ClientReligionEnum, string> = {
  [ClientReligionEnum.Islam]: 'Islam',
  [ClientReligionEnum.Christianity]: 'Kristen',
  [ClientReligionEnum.Catholicism]: 'Katolik',
  [ClientReligionEnum.Hinduism]: 'Hindu',
  [ClientReligionEnum.Buddhism]: 'Buddha',
  [ClientReligionEnum.Konghucu]: 'Konghucu',
  [ClientReligionEnum.Other]: 'Lainnya',
};

export enum ClientMaritalStatusEnum {
  Single = 'Single',
  Married = 'Married',
  Widowed = 'Widowed',
}

export const ClientMaritalStatusLabels: Record<ClientMaritalStatusEnum, string> = {
  [ClientMaritalStatusEnum.Single]: 'Belum Menikah',
  [ClientMaritalStatusEnum.Married]: 'Menikah',
  [ClientMaritalStatusEnum.Widowed]: 'Janda/Duda',
};

export enum ClientRelationshipWithSpouseEnum {
  Good = 'Good',
  Average = 'Average',
  Bad = 'Bad',
}

export const ClientRelationshipWithSpouseLabels: Record<ClientRelationshipWithSpouseEnum, string> = {
  [ClientRelationshipWithSpouseEnum.Good]: 'Baik',
  [ClientRelationshipWithSpouseEnum.Average]: 'Sedang',
  [ClientRelationshipWithSpouseEnum.Bad]: 'Buruk',
};

// Guardian-related enums
export enum ClientGuardianRelationshipEnum {
  Father = 'Father',
  Mother = 'Mother',
  LegalGuardian = 'Legal guardian',
  Other = 'Other',
}

export const ClientGuardianRelationshipLabels: Record<ClientGuardianRelationshipEnum, string> = {
  [ClientGuardianRelationshipEnum.Father]: 'Ayah',
  [ClientGuardianRelationshipEnum.Mother]: 'Ibu',
  [ClientGuardianRelationshipEnum.LegalGuardian]: 'Wali Hukum',
  [ClientGuardianRelationshipEnum.Other]: 'Lainnya',
};

export enum ClientGuardianMaritalStatusEnum {
  Married = 'Married',
  Divorced = 'Divorced',
  Widowed = 'Widowed',
  Other = 'Other',
}

export const ClientGuardianMaritalStatusLabels: Record<ClientGuardianMaritalStatusEnum, string> = {
  [ClientGuardianMaritalStatusEnum.Married]: 'Menikah',
  [ClientGuardianMaritalStatusEnum.Divorced]: 'Cerai',
  [ClientGuardianMaritalStatusEnum.Widowed]: 'Janda/Duda',
  [ClientGuardianMaritalStatusEnum.Other]: 'Lainnya',
};

// Clinic
export enum ClinicDocumentTypeEnum {
  License = 'license',
  Certificate = 'certificate',
  Insurance = 'insurance',
  Tax = 'tax',
  Other = 'other',
}

export enum ClinicDocumentStatusEnum {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

// Subscription tier labels for display purposes
export const SubscriptionTierLabels: Record<SubscriptionTierEnum, string> = {
  [SubscriptionTierEnum.Beta]: 'Beta',
  [SubscriptionTierEnum.Alpha]: 'Alpha',
  [SubscriptionTierEnum.Theta]: 'Theta',
};

export enum ClinicLanguageEnum {
  Indonesian = 'id',
  English = 'en',
}

// Therapist
export enum TherapistLicenseTypeEnum {
  Psychologist = 'psychologist',
  Psychiatrist = 'psychiatrist',
  Counselor = 'counselor',
  Hypnotherapist = 'hypnotherapist',
}

// TherapistStatusEnum moved to unified UserStatusEnum in ./status.ts

export enum EmploymentTypeEnum {
  FullTime = 'full_time',
  PartTime = 'part_time',
  Contract = 'contract',
  Freelance = 'freelance',
}

export enum TherapistCertificationStatusEnum {
  Active = 'active',
  Expired = 'expired',
  Pending = 'pending',
}

export enum TherapistAssignmentStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Transferred = 'transferred',
  Cancelled = 'cancelled',
}

export enum TherapistSortByEnum {
  Name = 'name',
  JoinDate = 'joinDate',
  ClientCount = 'clientCount',
}

export enum SortOrderEnum {
  Asc = 'asc',
  Desc = 'desc',
}

// Registration
export enum RegistrationStepEnum {
  EmailCheck = 'email_check',
  UserForm = 'user_form',
  EmailVerification = 'email_verification',
  Complete = 'complete',
}


export enum BillingCycleEnum {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

// Therapy
export enum TherapyStatusEnum {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Completed = 'completed',
  OnHold = 'on_hold',
  Cancelled = 'cancelled',
}

export enum TherapyTypeEnum {
  Individual = 'individual',
  Group = 'group',
  Family = 'family',
  Couple = 'couple',
}

export enum TherapyPriorityEnum {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent',
}

export enum MentalHealthIssueEnum {
  Anxiety = 'anxiety',
  Depression = 'depression',
  Stress = 'stress',
  Trauma = 'trauma',
  Phobia = 'phobia',
  SleepDisorder = 'sleep_disorder',
  AddictionRecovery = 'addiction_recovery',
  SelfConfidence = 'self_confidence',
  Relationship = 'relationship',
  Career = 'career',
  Other = 'other',
}

// Zod-compatible enum arrays for validation schemas
// These correspond to the TypeScript enums above but are arrays for Zod
export const ClientGenderValues = ['Male', 'Female'] as const;
export const ClientEducationValues = [
  'Elementary', 'Middle', 'High School', 'Associate', 'Bachelor', 'Master', 'Doctorate'
] as const;
export const ClientReligionValues = [
  'Islam', 'Christianity', 'Catholicism', 'Hinduism', 'Buddhism', 'Konghucu', 'Other'
] as const;
export const ClientMaritalStatusValues = ['Single', 'Married', 'Widowed'] as const;
export const ClientRelationshipWithSpouseValues = ['Good', 'Average', 'Bad'] as const;
export const ClientStatusValues = ['new', 'assigned', 'consultation', 'therapy', 'done'] as const;
export const ClientGuardianRelationshipValues = ['Father', 'Mother', 'Legal guardian', 'Other'] as const;
export const ClientGuardianMaritalStatusValues = ['Married', 'Divorced', 'Widowed', 'Other'] as const;

// Clinic document enum values
export const ClinicDocumentTypeValues = ['license', 'certificate', 'insurance', 'tax', 'other'] as const;

// Consultation
export enum ConsultationStatusEnum {
  Draft = 'draft',
  InProgress = 'in_progress',
  Completed = 'completed',
  Archived = 'archived',
}

export enum ConsultationFormTypeEnum {
  General = 'general',
  DrugAddiction = 'drug_addiction',
  Minor = 'minor',
}

// Consultation Form Selection Enums
export enum SymptomDurationEnum {
  LessThanOneMonth = '<1 month',
  OneToThreeMonths = '1-3 months',
  ThreeToSixMonths = '3-6 months',
  MoreThanSixMonths = '>6 months',
}

export const SymptomDurationLabels: Record<SymptomDurationEnum, string> = {
  [SymptomDurationEnum.LessThanOneMonth]: 'Kurang dari 1 bulan',
  [SymptomDurationEnum.OneToThreeMonths]: '1-3 bulan',
  [SymptomDurationEnum.ThreeToSixMonths]: '3-6 bulan',
  [SymptomDurationEnum.MoreThanSixMonths]: 'Lebih dari 6 bulan',
};

export enum ProblemFrequencyEnum {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Rare = 'Rare',
}

export const ProblemFrequencyLabels: Record<ProblemFrequencyEnum, string> = {
  [ProblemFrequencyEnum.Daily]: 'Harian',
  [ProblemFrequencyEnum.Weekly]: 'Mingguan',
  [ProblemFrequencyEnum.Monthly]: 'Bulanan',
  [ProblemFrequencyEnum.Rare]: 'Jarang',
};

export enum SymptomSeverityEnum {
  NotDisturbing = 'not_disturbing',
  SlightlyDisturbing = 'slightly_disturbing',
  ModeratelyDisturbing = 'moderately_disturbing',
  VeryDisturbing = 'very_disturbing',
  ExtremelyDisturbing = 'extremely_disturbing',
}

export const SymptomSeverityLabels: Record<SymptomSeverityEnum, string> = {
  [SymptomSeverityEnum.NotDisturbing]: 'Tidak mengganggu',
  [SymptomSeverityEnum.SlightlyDisturbing]: 'Sedikit mengganggu',
  [SymptomSeverityEnum.ModeratelyDisturbing]: 'Cukup mengganggu',
  [SymptomSeverityEnum.VeryDisturbing]: 'Sangat mengganggu',
  [SymptomSeverityEnum.ExtremelyDisturbing]: 'Sangat sangat mengganggu',
};

// Zod-compatible enum values for validation
export const SymptomSeverityValues = ['not_disturbing', 'slightly_disturbing', 'moderately_disturbing', 'very_disturbing', 'extremely_disturbing'] as const;

export enum SleepQualityEnum {
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
  Disturbed = 'Disturbed',
}

export const SleepQualityLabels: Record<SleepQualityEnum, string> = {
  [SleepQualityEnum.Good]: 'Baik',
  [SleepQualityEnum.Fair]: 'Lumayan',
  [SleepQualityEnum.Poor]: 'Buruk',
  [SleepQualityEnum.Disturbed]: 'Terganggu',
};

export enum SelfHarmFrequencyEnum {
  Never = 'Never',
  Sometimes = 'Sometimes',
  Often = 'Often',
}

export const SelfHarmFrequencyLabels: Record<SelfHarmFrequencyEnum, string> = {
  [SelfHarmFrequencyEnum.Never]: 'Tidak pernah',
  [SelfHarmFrequencyEnum.Sometimes]: 'Kadang-kadang',
  [SelfHarmFrequencyEnum.Often]: 'Sering',
};

export enum RecentMoodStateEnum {
  Excellent = 'excellent',
  Good = 'good',
  Neutral = 'neutral',
  Bad = 'bad',
  VeryBad = 'very_bad',
}

export const RecentMoodStateLabels: Record<RecentMoodStateEnum, string> = {
  [RecentMoodStateEnum.Excellent]: 'Sangat baik',
  [RecentMoodStateEnum.Good]: 'Baik',
  [RecentMoodStateEnum.Neutral]: 'Biasa saja',
  [RecentMoodStateEnum.Bad]: 'Buruk',
  [RecentMoodStateEnum.VeryBad]: 'Sangat buruk',
};

export enum SelfHarmThoughtsEnum {
  Often = 'often',
  Sometimes = 'sometimes',
  Never = 'never',
}

export const SelfHarmThoughtsLabels: Record<SelfHarmThoughtsEnum, string> = {
  [SelfHarmThoughtsEnum.Often]: 'Ya, sering',
  [SelfHarmThoughtsEnum.Sometimes]: 'Kadang-kadang',
  [SelfHarmThoughtsEnum.Never]: 'Tidak pernah',
};

export enum DailyStressFrequencyEnum {
  Never = 'never',
  Rarely = 'rarely',
  Sometimes = 'sometimes',
  Often = 'often',
  VeryOften = 'very_often',
}

export const DailyStressFrequencyLabels: Record<DailyStressFrequencyEnum, string> = {
  [DailyStressFrequencyEnum.Never]: 'Tidak pernah',
  [DailyStressFrequencyEnum.Rarely]: 'Jarang',
  [DailyStressFrequencyEnum.Sometimes]: 'Kadang-kadang',
  [DailyStressFrequencyEnum.Often]: 'Sering',
  [DailyStressFrequencyEnum.VeryOften]: 'Sangat sering',
};

export enum FrequentEmotionsEnum {
  ProlongedSadness = 'prolonged_sadness',
  AnxietyWithoutReason = 'anxiety_without_reason',
  LossOfInterest = 'loss_of_interest',
  Irritability = 'irritability',
  SleepProblems = 'sleep_problems',
  WorthlessnessGuilt = 'worthlessness_guilt',
}

export const FrequentEmotionsLabels: Record<FrequentEmotionsEnum, string> = {
  [FrequentEmotionsEnum.ProlongedSadness]: 'Sedih berkepanjangan',
  [FrequentEmotionsEnum.AnxietyWithoutReason]: 'Cemas atau takut tanpa alasan yang jelas',
  [FrequentEmotionsEnum.LossOfInterest]: 'Kehilangan minat terhadap hal-hal yang dulu disukai',
  [FrequentEmotionsEnum.Irritability]: 'Mudah marah atau tersinggung',
  [FrequentEmotionsEnum.SleepProblems]: 'Sulit tidur atau terlalu banyak tidur',
  [FrequentEmotionsEnum.WorthlessnessGuilt]: 'Merasa tidak berharga atau bersalah secara berlebihan',
};

export enum SubstanceTypeEnum {
  Alcohol = 'alcohol',
  Marijuana = 'marijuana',
  Methamphetamine = 'methamphetamine',
  Cocaine = 'cocaine',
  Heroin = 'heroin',
  Ecstasy = 'ecstasy',
  Inhalants = 'inhalants',
  PrescriptionDrugs = 'prescription_drugs',
  OtherSubstances = 'other_substances',
}

export const SubstanceTypeLabels: Record<SubstanceTypeEnum, string> = {
  [SubstanceTypeEnum.Alcohol]: 'Alkohol',
  [SubstanceTypeEnum.Marijuana]: 'Ganja',
  [SubstanceTypeEnum.Methamphetamine]: 'Shabu-shabu',
  [SubstanceTypeEnum.Cocaine]: 'Kokain',
  [SubstanceTypeEnum.Heroin]: 'Heroin',
  [SubstanceTypeEnum.Ecstasy]: 'Ekstasi',
  [SubstanceTypeEnum.Inhalants]: 'Inhalansia',
  [SubstanceTypeEnum.PrescriptionDrugs]: 'Obat resep (disalahgunakan)',
  [SubstanceTypeEnum.OtherSubstances]: 'Lainnya',
};

export enum PrimarySubstanceEnum {
  Alcohol = 'alcohol',
  Marijuana = 'marijuana',
  Methamphetamine = 'methamphetamine',
  Cocaine = 'cocaine',
  Heroin = 'heroin',
  Ecstasy = 'ecstasy',
  Inhalants = 'inhalants',
  PrescriptionDrugs = 'prescription_drugs',
  Other = 'other',
}

export const PrimarySubstanceLabels: Record<PrimarySubstanceEnum, string> = {
  [PrimarySubstanceEnum.Alcohol]: 'Alkohol',
  [PrimarySubstanceEnum.Marijuana]: 'Ganja',
  [PrimarySubstanceEnum.Methamphetamine]: 'Shabu-shabu',
  [PrimarySubstanceEnum.Cocaine]: 'Kokain',
  [PrimarySubstanceEnum.Heroin]: 'Heroin',
  [PrimarySubstanceEnum.Ecstasy]: 'Ekstasi',
  [PrimarySubstanceEnum.Inhalants]: 'Inhalansia',
  [PrimarySubstanceEnum.PrescriptionDrugs]: 'Obat Resep',
  [PrimarySubstanceEnum.Other]: 'Lainnya',
};

export enum ToleranceLevelEnum {
  VeryLow = 1,
  Low = 2,
  Medium = 3,
  High = 4,
  VeryHigh = 5,
}

export const ToleranceLevelLabels: Record<ToleranceLevelEnum, string> = {
  [ToleranceLevelEnum.VeryLow]: 'Sangat rendah',
  [ToleranceLevelEnum.Low]: 'Rendah',
  [ToleranceLevelEnum.Medium]: 'Sedang',
  [ToleranceLevelEnum.High]: 'Tinggi',
  [ToleranceLevelEnum.VeryHigh]: 'Sangat tinggi',
};

export enum DesireToQuitEnum {
  Yes = 'Yes',
  YesButUnsure = 'Yes, but unsure',
  No = 'No',
}

export const DesireToQuitLabels: Record<DesireToQuitEnum, string> = {
  [DesireToQuitEnum.Yes]: 'Ya, sangat ingin berhenti',
  [DesireToQuitEnum.YesButUnsure]: 'Ya, tapi masih ragu',
  [DesireToQuitEnum.No]: 'Belum yakin ingin berhenti',
};

export enum ConsultationReasonEnum {
  LearningDifficulties = 'learning_difficulties',
  EmotionalProblems = 'emotional_problems',
  SocialProblems = 'social_problems',
  BehavioralProblems = 'behavioral_problems',
  Trauma = 'trauma',
  SleepEatingDisorders = 'sleep_eating_disorders',
  Other = 'other',
}

export const ConsultationReasonLabels: Record<ConsultationReasonEnum, string> = {
  [ConsultationReasonEnum.LearningDifficulties]: 'Kesulitan belajar',
  [ConsultationReasonEnum.EmotionalProblems]: 'Masalah emosi (cemas, sedih, marah berlebihan, dll.)',
  [ConsultationReasonEnum.SocialProblems]: 'Masalah sosial (kesulitan bergaul, bullying, dll.)',
  [ConsultationReasonEnum.BehavioralProblems]: 'Gangguan perilaku (agresif, tidak patuh, dll.)',
  [ConsultationReasonEnum.Trauma]: 'Trauma atau pengalaman buruk',
  [ConsultationReasonEnum.SleepEatingDisorders]: 'Gangguan tidur/makan',
  [ConsultationReasonEnum.Other]: 'Lainnya',
};

export enum AcademicPerformanceEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  VeryPoor = 'very_poor',
}

export const AcademicPerformanceLabels: Record<AcademicPerformanceEnum, string> = {
  [AcademicPerformanceEnum.Excellent]: 'Sangat baik',
  [AcademicPerformanceEnum.Good]: 'Baik',
  [AcademicPerformanceEnum.Fair]: 'Cukup',
  [AcademicPerformanceEnum.Poor]: 'Kurang',
  [AcademicPerformanceEnum.VeryPoor]: 'Sangat kurang',
};

export enum TherapyPreferenceEnum {
  CBT = 'CBT',
  GeneralCounseling = 'General counseling',
  Undecided = 'Undecided',
}

export const TherapyPreferenceLabels: Record<TherapyPreferenceEnum, string> = {
  [TherapyPreferenceEnum.CBT]: 'Cognitive Behavioral Therapy (CBT)',
  [TherapyPreferenceEnum.GeneralCounseling]: 'Konseling Umum',
  [TherapyPreferenceEnum.Undecided]: 'Belum yakin',
};

// ClinicStatusEnum moved to unified ClinicStatusEnum in ./status.ts






