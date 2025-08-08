// System constants and subscription limits
export const SUBSCRIPTION_TIERS = {
  beta: {
    name: 'Beta',
    price: 50000,
    currency: 'IDR',
    limits: {
      therapists: 1,
      clientsPerDay: 4,
      scriptsPerDay: 10
    },
    features: [
      'Basic AI assessment',
      'Script generation', 
      'Email support'
    ],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  alpha: {
    name: 'Alpha',
    price: 100000,
    currency: 'IDR',
    limits: {
      therapists: 3,
      clientsPerDay: 15,
      scriptsPerDay: 50
    },
    features: [
      'Advanced analytics',
      'Priority support',
      'All Beta features'
    ],
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  theta: {
    name: 'Theta',
    price: 150000,
    currency: 'IDR',
    limits: {
      therapists: 5,
      clientsPerDay: 30,
      scriptsPerDay: 120
    },
    features: [
      'API integration',
      'Phone support',
      'All Alpha features'
    ],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  delta: {
    name: 'Delta',
    price: 200000,
    currency: 'IDR',
    limits: {
      therapists: 10,
      clientsPerDay: 100,
      scriptsPerDay: 500
    },
    features: [
      'Enterprise analytics',
      'Dedicated support',
      'Custom branding',
      'All Theta features'
    ],
    color: 'text-gold-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  }
} as const;

export const TIER_ORDER = ['beta', 'alpha', 'theta', 'delta'] as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// Usage warning thresholds
export const USAGE_THRESHOLDS = {
  WARNING: 0.8, // 80%
  CRITICAL: 0.95 // 95%
} as const;

// Billing configuration
export const BILLING_CONFIG = {
  currency: 'IDR',
  cycle: 'monthly',
  timezone: 'Asia/Jakarta'
} as const;

// System limits
export const SYSTEM_LIMITS = {
  maxTherapistsPerClinic: 50,
  maxClientsPerTherapist: 100,
  maxSessionsPerDay: 20
} as const;

// Format currency helper
export const formatCurrency = (amount: number, currency: string = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
};