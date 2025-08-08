import { SubscriptionTier } from '@/lib/constants';

export interface ClinicSubscription {
  clinicId: string;
  tier: SubscriptionTier;
  status: 'active' | 'inactive' | 'suspended' | 'cancelled';
  limits: {
    therapists: number;
    clientsPerDay: number;
    scriptsPerDay: number;
  };
  usage: {
    therapists: number;
    clientsToday: number;
    scriptsToday: number;
    clientsThisMonth: number;
    scriptsThisMonth: number;
  };
  billing: {
    amount: number;
    currency: string;
    nextBilling: string; // ISO date string
    lastPayment?: string; // ISO date string
    paymentMethod?: string;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface UsageMetrics {
  therapists: {
    current: number;
    limit: number;
    percentage: number;
  };
  clientsToday: {
    current: number;
    limit: number;
    percentage: number;
  };
  scriptsToday: {
    current: number;
    limit: number;
    percentage: number;
  };
  clientsThisMonth: {
    current: number;
    estimated: number;
  };
  scriptsThisMonth: {
    current: number;
    estimated: number;
  };
}

export interface ClinicInfo {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  description?: string;
  establishedDate?: string;
  license?: string;
  subscription: ClinicSubscription;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  currency: string;
  limits: {
    therapists: number;
    clientsPerDay: number;
    scriptsPerDay: number;
  };
  features: readonly string[];
  popular?: boolean;
  recommended?: boolean;
}

export interface BillingHistory {
  id: string;
  clinicId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  invoiceDate: string;
  paidDate?: string;
  description: string;
  invoiceUrl?: string;
}

export interface UsageAlert {
  type: 'warning' | 'critical' | 'limit_reached';
  metric: 'therapists' | 'clientsToday' | 'scriptsToday';
  currentUsage: number;
  limit: number;
  percentage: number;
  message: string;
  timestamp: string;
}