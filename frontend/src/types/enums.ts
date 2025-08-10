// Centralized enums mirroring literal string unions across the codebase.
// Note: These enums do not change existing types; they are provided for
// developer convenience and stronger autocomplete at call sites.

// Auth / Roles / Subscription
export enum UserRoleEnum {
  Administrator = 'Administrator',
  ClinicAdmin = 'ClinicAdmin',
  Therapist = 'Therapist',
}

export enum AuthSubscriptionTierEnum {
  Alpha = 'alpha',
  Beta = 'beta',
  Gamma = 'gamma',
}

// Client
export enum ClientGenderEnum {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum ClientEducationEnum {
  Elementary = 'Elementary',
  Middle = 'Middle',
  HighSchool = 'High School',
  Associate = 'Associate',
  Bachelor = 'Bachelor',
  Master = 'Master',
  Doctorate = 'Doctorate',
}

export enum ClientStatusEnum {
  Active = 'active',
  Inactive = 'inactive',
  Completed = 'completed',
  Pending = 'pending',
}

export enum ClientReligionEnum {
  Islam = 'Islam',
  Christianity = 'Christianity',
  Catholicism = 'Catholicism',
  Hinduism = 'Hinduism',
  Buddhism = 'Buddhism',
  Konghucu = 'Konghucu',
  Other = 'Other',
}

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


