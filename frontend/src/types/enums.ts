// Centralized enums mirroring literal string unions across the codebase.
// Note: These enums do not change existing types; they are provided for
// developer convenience and stronger autocomplete at call sites.

// Auth / Roles / Subscription
export enum UserRoleEnum {
  Administrator = 'administrator',
  ClinicAdmin = 'clinic_admin',
  Therapist = 'therapist',
}

export enum AuthSubscriptionTierEnum {
  Alpha = 'alpha',
  Beta = 'beta',
  Gamma = 'gamma',
}

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

export enum ClinicSubscriptionTierEnum {
  Alpha = 'alpha',
  Beta = 'beta',
  Theta = 'theta',
  Delta = 'delta',
}

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

export enum TherapistStatusEnum {
  Active = 'active',
  Inactive = 'inactive',
  OnLeave = 'on_leave',
  Suspended = 'suspended',
  PendingSetup = 'pending_setup',
}

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
  Clinic = 'clinic',
  Verification = 'verification',
  Summary = 'summary',
  Payment = 'payment',
  Complete = 'complete',
}

export enum PaymentMethodEnum {
  BankTransfer = 'bank_transfer',
  CreditCard = 'credit_card',
  Ewallet = 'ewallet',
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

// Clinic status enum values
export enum ClinicStatusEnum {
  Active = 'active',
  Suspended = 'suspended',
  Pending = 'pending',
  Inactive = 'inactive',
}





