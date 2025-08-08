import { ClientEducationEnum, ClientGenderEnum, ClientReligionEnum, ClientStatusEnum } from './enums';

type EnumValue<T> = T[keyof T];

export interface Client {
  id: string;
  name: string;
  age: number;
  gender: EnumValue<typeof ClientGenderEnum>;
  phone: string;
  email: string;
  occupation: string;
  education: EnumValue<typeof ClientEducationEnum>;
  address: string;
  assignedTherapist?: string | undefined;
  status: EnumValue<typeof ClientStatusEnum>;
  joinDate: string;
  totalSessions: number;
  lastSession?: string | undefined;
  primaryIssue: string;
  progress: number;
  notes?: string | undefined;
  religion?: EnumValue<typeof ClientReligionEnum> | undefined;
  province?: string | undefined;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  } | undefined;
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
  name: string;
  age: number;
  gender: Client['gender'];
  phone: string;
  email: string;
  occupation: string;
  education: Client['education'];
  address: string;
  primaryIssue: string;
  religion?: Client['religion'];
  province?: Client['province'];
  emergencyContact?: Client['emergencyContact'];
  notes?: string;
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