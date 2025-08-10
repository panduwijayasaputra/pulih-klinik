import { ClientEducationEnum, ClientGenderEnum, ClientReligionEnum, ClientStatusEnum, ClientMaritalStatusEnum, ClientRelationshipWithSpouseEnum, ClientGuardianRelationshipEnum, ClientGuardianMaritalStatusEnum } from './enums';
import type { StatusTransition } from './clientStatus';

type EnumValue<T> = T[keyof T];

// Re-export StatusTransition for convenience
export type { StatusTransition };

export interface Client {
  id: string;
  fullName: string;
  gender: EnumValue<typeof ClientGenderEnum>;
  birthPlace: string;
  birthDate: string;
  religion: EnumValue<typeof ClientReligionEnum>;
  occupation: string;
  education: EnumValue<typeof ClientEducationEnum>;
  educationMajor?: string;
  address: string;
  phone: string;
  email: string;
  hobbies?: string;
  maritalStatus: EnumValue<typeof ClientMaritalStatusEnum>;
  spouseName?: string;
  relationshipWithSpouse?: EnumValue<typeof ClientRelationshipWithSpouseEnum>;
  emergencyContact?: string;
  firstVisit: boolean;
  previousVisitDetails?: string;
  assignedTherapist?: string | undefined;
  status: EnumValue<typeof ClientStatusEnum>;
  joinDate: string;
  totalSessions: number;
  lastSession?: string | undefined;
  progress: number;
  notes?: string | undefined;
  province?: string | undefined;
  // Legacy fields for backward compatibility
  name?: string;
  age?: number;
  primaryIssue?: string;
  emergencyContactDetails?: {
    name: string;
    phone: string;
    relationship: string;
  } | undefined;
  // Minor-specific fields
  isMinor?: boolean;
  school?: string;
  grade?: string;
  // Guardian information
  guardianFullName?: string;
  guardianRelationship?: EnumValue<typeof ClientGuardianRelationshipEnum>;
  guardianPhone?: string;
  guardianAddress?: string;
  guardianOccupation?: string;
  guardianMaritalStatus?: EnumValue<typeof ClientGuardianMaritalStatusEnum>;
  guardianLegalCustody?: boolean;
  guardianCustodyDocsAttached?: boolean;
}

export interface ClientFilters {
  search?: string;
  status?: Client['status'];
  therapist?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  primaryIssue?: string;
  province?: string;
}

export interface ClientFormData {
  fullName: string;
  gender: Client['gender'];
  birthPlace: string;
  birthDate: string;
  religion: Client['religion'];
  occupation: string;
  education: Client['education'];
  educationMajor?: string;
  address: string;
  phone: string;
  email: string;
  hobbies?: string;
  maritalStatus: Client['maritalStatus'];
  spouseName?: string;
  relationshipWithSpouse?: Client['relationshipWithSpouse'];
  emergencyContact?: string;
  firstVisit: boolean;
  previousVisitDetails?: string;
  province?: Client['province'];
  notes?: string;
  // Legacy fields for backward compatibility
  name?: string;
  emergencyContactDetails?: Client['emergencyContactDetails'];
  // Minor-specific fields
  isMinor?: boolean;
  school?: string;
  grade?: string;
  // Guardian information
  guardianFullName?: string;
  guardianRelationship?: Client['guardianRelationship'];
  guardianPhone?: string;
  guardianAddress?: string;
  guardianOccupation?: string;
  guardianMaritalStatus?: Client['guardianMaritalStatus'];
  guardianLegalCustody?: boolean;
  guardianCustodyDocsAttached?: boolean;
}

export interface UsageMetrics {
  today: {
    clientsAdded: number;
    clientsLimit: number;
    scriptsGenerated: number;
    scriptsLimit: number;
    therapistsActive: number;
    therapistsLimit: number;
  };
  thisMonth: {
    clientsAdded: number;
    scriptsGenerated: number;
    sessionsCompleted: number;
    averageRating: number;
  };
  trends: {
    clientGrowth: number[];
    scriptUsage: number[];
  };
}

// Session & Assessment summary types for SessionHistory views

export type SessionPhase =
  | 'intake'
  | 'induction'
  | 'therapy'
  | 'post';

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface AssessmentSummary {
  tool: string; // e.g., GAD-7, PHQ-9
  preScore?: number;
  postScore?: number;
  scoreUnit?: string; // e.g., 'points'
  notes?: string;
}

export interface SessionSummary {
  id: string;
  clientId: string;
  therapistId: string;
  therapistName?: string;
  date: string; // ISO date string
  phase: SessionPhase;
  status: SessionStatus;
  durationMinutes?: number;
  notes?: string;
  assessment?: AssessmentSummary;
}