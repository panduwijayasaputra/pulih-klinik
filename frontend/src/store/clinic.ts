import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClinicInfo, ClinicSubscription, UsageAlert, UsageMetrics } from '@/types/clinic';
import { SUBSCRIPTION_TIERS, USAGE_THRESHOLDS } from '@/lib/constants';

interface ClinicStore {
  // State
  clinic: ClinicInfo | null;
  subscription: ClinicSubscription | null;
  usageMetrics: UsageMetrics | null;
  usageAlerts: UsageAlert[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setClinic: (clinic: ClinicInfo) => void;
  setSubscription: (subscription: ClinicSubscription) => void;
  updateUsage: (usage: ClinicSubscription['usage']) => void;
  calculateUsageMetrics: () => void;
  checkUsageAlerts: () => void;
  clearError: () => void;
  reset: () => void;

  // Getters
  getCurrentTierInfo: () => typeof SUBSCRIPTION_TIERS.beta | null;
  canAddTherapist: () => boolean;
  canAddClientToday: () => boolean;
  canGenerateScriptToday: () => boolean;
  getRemainingQuota: (metric: 'therapists' | 'clientsToday' | 'scriptsToday') => number;
}

const initialState = {
  clinic: null,
  subscription: null,
  usageMetrics: null,
  usageAlerts: [],
  isLoading: false,
  error: null,
};

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setClinic: (clinic) => {
        set({ clinic, error: null });
        // Update subscription from clinic data
        if (clinic.subscription) {
          get().setSubscription(clinic.subscription);
        }
      },

      setSubscription: (subscription) => {
        set({ subscription, error: null });
        get().calculateUsageMetrics();
        get().checkUsageAlerts();
      },

      updateUsage: (usage) => {
        const { subscription } = get();
        if (!subscription) return;

        const updatedSubscription = {
          ...subscription,
          usage,
          updatedAt: new Date().toISOString(),
        };

        set({ subscription: updatedSubscription });
        get().calculateUsageMetrics();
        get().checkUsageAlerts();
      },

      calculateUsageMetrics: () => {
        const { subscription } = get();
        if (!subscription) return;

        const { usage, limits } = subscription;

        const usageMetrics: UsageMetrics = {
          therapists: {
            current: usage.therapists,
            limit: limits.therapists,
            percentage: Math.round((usage.therapists / limits.therapists) * 100),
          },
          clientsToday: {
            current: usage.clientsToday,
            limit: limits.clientsPerDay,
            percentage: Math.round((usage.clientsToday / limits.clientsPerDay) * 100),
          },
          scriptsToday: {
            current: usage.scriptsToday,
            limit: limits.scriptsPerDay,
            percentage: Math.round((usage.scriptsToday / limits.scriptsPerDay) * 100),
          },
          clientsThisMonth: {
            current: usage.clientsThisMonth,
            estimated: Math.round(usage.clientsThisMonth * (30 / new Date().getDate())),
          },
          scriptsThisMonth: {
            current: usage.scriptsThisMonth,
            estimated: Math.round(usage.scriptsThisMonth * (30 / new Date().getDate())),
          },
        };

        set({ usageMetrics });
      },

      checkUsageAlerts: () => {
        const { usageMetrics, subscription } = get();
        if (!usageMetrics || !subscription) return;

        const alerts: UsageAlert[] = [];
        const timestamp = new Date().toISOString();

        // Check each metric for alerts
        const metrics = [
          { key: 'therapists' as const, data: usageMetrics.therapists },
          { key: 'clientsToday' as const, data: usageMetrics.clientsToday },
          { key: 'scriptsToday' as const, data: usageMetrics.scriptsToday },
        ];

        metrics.forEach(({ key, data }) => {
          const percentage = data.percentage / 100;

          if (percentage >= 1) {
            alerts.push({
              type: 'limit_reached',
              metric: key,
              currentUsage: data.current,
              limit: data.limit,
              percentage: data.percentage,
              message: `Batas ${key === 'therapists' ? 'therapist' : key === 'clientsToday' ? 'klien harian' : 'script harian'} telah tercapai`,
              timestamp,
            });
          } else if (percentage >= USAGE_THRESHOLDS.CRITICAL) {
            alerts.push({
              type: 'critical',
              metric: key,
              currentUsage: data.current,
              limit: data.limit,
              percentage: data.percentage,
              message: `Penggunaan ${key === 'therapists' ? 'therapist' : key === 'clientsToday' ? 'klien harian' : 'script harian'} hampir mencapai batas (${data.percentage}%)`,
              timestamp,
            });
          } else if (percentage >= USAGE_THRESHOLDS.WARNING) {
            alerts.push({
              type: 'warning',
              metric: key,
              currentUsage: data.current,
              limit: data.limit,
              percentage: data.percentage,
              message: `Penggunaan ${key === 'therapists' ? 'therapist' : key === 'clientsToday' ? 'klien harian' : 'script harian'} mendekati batas (${data.percentage}%)`,
              timestamp,
            });
          }
        });

        set({ usageAlerts: alerts });
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),

      // Getters
      getCurrentTierInfo: () => {
        const { subscription } = get();
        if (!subscription) return null;
        return SUBSCRIPTION_TIERS[subscription.tier];
      },

      canAddTherapist: () => {
        const { usageMetrics } = get();
        return usageMetrics ? usageMetrics.therapists.current < usageMetrics.therapists.limit : false;
      },

      canAddClientToday: () => {
        const { usageMetrics } = get();
        return usageMetrics ? usageMetrics.clientsToday.current < usageMetrics.clientsToday.limit : false;
      },

      canGenerateScriptToday: () => {
        const { usageMetrics } = get();
        return usageMetrics ? usageMetrics.scriptsToday.current < usageMetrics.scriptsToday.limit : false;
      },

      getRemainingQuota: (metric) => {
        const { usageMetrics } = get();
        if (!usageMetrics) return 0;
        
        const data = usageMetrics[metric];
        return Math.max(0, data.limit - data.current);
      },
    }),
    {
      name: 'clinic-store',
      partialize: (state) => ({ 
        clinic: state.clinic,
        subscription: state.subscription,
      }),
    }
  )
);