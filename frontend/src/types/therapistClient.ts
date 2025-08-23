import { ClientStatusEnum } from './enums';
import type { Client } from './client';

export interface TherapistClient extends Client {
  // Additional therapist-specific fields
  assignedDate: string;
  lastSessionDate?: string;
  nextSessionDate?: string;
  sessionCount: number;
  progressNotes?: string;
  therapistNotes?: string;
}

export interface TherapistClientStats {
  total: number;
  assigned: number;
  consultation: number;
  therapy: number;
  done: number;
  upcomingSessions: number;
  overdueSessions: number;
}

export interface TherapistClientFilters {
  status?: ClientStatusEnum | 'all';
  search?: string;
  assignedDate?: {
    from: string;
    to: string;
  };
  lastSessionDate?: {
    from: string;
    to: string;
  };
  sessionCount?: {
    min: number;
    max: number;
  };
  sortBy?: 'name' | 'assignedDate' | 'lastSessionDate' | 'sessionCount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface TherapistClientSummary {
  clientId: string;
  clientName: string;
  status: ClientStatusEnum;
  assignedDate: string;
  lastSessionDate?: string;
  nextSessionDate?: string;
  sessionCount: number;
  progress: number; // 0-100
  isOverdue: boolean;
  needsAttention: boolean;
}

export interface TherapistClientSession {
  id: string;
  clientId: string;
  sessionDate: string;
  sessionType: 'consultation' | 'therapy' | 'follow_up';
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  progress?: number; // 0-100
  nextSessionDate?: string;
}

export interface TherapistClientProgress {
  clientId: string;
  clientName: string;
  startDate: string;
  currentStatus: ClientStatusEnum;
  totalSessions: number;
  completedSessions: number;
  progressPercentage: number;
  milestones: {
    id: string;
    title: string;
    description: string;
    achieved: boolean;
    achievedDate?: string;
  }[];
  recentNotes: {
    id: string;
    date: string;
    content: string;
    type: 'session' | 'progress' | 'emergency';
  }[];
}
