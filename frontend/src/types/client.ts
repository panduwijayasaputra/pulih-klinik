export interface Client {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  occupation: string;
  education: 'Elementary' | 'Middle' | 'High School' | 'Associate' | 'Bachelor' | 'Master' | 'Doctorate';
  address: string;
  assignedTherapist?: string | undefined;
  status: 'active' | 'inactive' | 'completed' | 'pending';
  joinDate: string;
  totalSessions: number;
  lastSession?: string | undefined;
  primaryIssue: string;
  progress: number;
  notes?: string | undefined;
  religion?: 'Islam' | 'Christianity' | 'Catholicism' | 'Hinduism' | 'Buddhism' | 'Konghucu' | undefined;
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