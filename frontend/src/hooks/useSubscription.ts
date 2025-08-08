import { useCallback, useState } from 'react';
import { useClinicStore } from '@/store/clinic';
import { SUBSCRIPTION_TIERS, SubscriptionTier, TIER_ORDER } from '@/lib/constants';
import { ClinicSubscription, SubscriptionPlan } from '@/types/clinic';

// Mock API functions (will be replaced with real API calls)
const mockApiDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    subscription,
    usageMetrics,
    usageAlerts,
    setSubscription,
    updateUsage,
    getCurrentTierInfo,
    canAddTherapist,
    canAddClientToday,
    canGenerateScriptToday,
    getRemainingQuota,
  } = useClinicStore();

  console.log('useSubscription hook:', { subscription, usageMetrics, usageAlerts });

  // Get available subscription plans
  const getAvailablePlans = useCallback((): SubscriptionPlan[] => {
    return TIER_ORDER.map((tier) => {
      const tierInfo = SUBSCRIPTION_TIERS[tier];
      return {
        tier,
        name: tierInfo.name,
        price: tierInfo.price,
        currency: tierInfo.currency,
        limits: tierInfo.limits,
        features: tierInfo.features,
        popular: tier === 'alpha', // Mark Alpha as popular
        recommended: tier === 'theta', // Mark Theta as recommended
      };
    });
  }, []);

  // Get upgrade options for current tier
  const getUpgradeOptions = useCallback((): SubscriptionPlan[] => {
    if (!subscription) return [];
    
    const currentTierIndex = TIER_ORDER.indexOf(subscription.tier);
    const availableUpgrades = TIER_ORDER.slice(currentTierIndex + 1);
    
    return availableUpgrades.map(tier => {
      const tierInfo = SUBSCRIPTION_TIERS[tier];
      return {
        tier,
        name: tierInfo.name,
        price: tierInfo.price,
        currency: tierInfo.currency,
        limits: tierInfo.limits,
        features: tierInfo.features,
      };
    });
  }, [subscription]);

  // Get downgrade options for current tier
  const getDowngradeOptions = useCallback((): SubscriptionPlan[] => {
    if (!subscription) return [];
    
    const currentTierIndex = TIER_ORDER.indexOf(subscription.tier);
    const availableDowngrades = TIER_ORDER.slice(0, currentTierIndex);
    
    return availableDowngrades.map(tier => {
      const tierInfo = SUBSCRIPTION_TIERS[tier];
      return {
        tier,
        name: tierInfo.name,
        price: tierInfo.price,
        currency: tierInfo.currency,
        limits: tierInfo.limits,
        features: tierInfo.features,
      };
    });
  }, [subscription]);

  // Upgrade subscription
  const upgradeSubscription = useCallback(async (newTier: SubscriptionTier) => {
    if (!subscription) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await mockApiDelay(); // Simulate API call
      
      const newTierInfo = SUBSCRIPTION_TIERS[newTier];
      const updatedSubscription: ClinicSubscription = {
        ...subscription,
        tier: newTier,
        limits: newTierInfo.limits,
        billing: {
          ...subscription.billing,
          amount: newTierInfo.price,
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
      
      setSubscription(updatedSubscription);
      return true;
    } catch {
      setError('Gagal melakukan upgrade subscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription, setSubscription]);

  // Downgrade subscription
  const downgradeSubscription = useCallback(async (newTier: SubscriptionTier) => {
    if (!subscription) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await mockApiDelay(); // Simulate API call
      
      const newTierInfo = SUBSCRIPTION_TIERS[newTier];
      const updatedSubscription: ClinicSubscription = {
        ...subscription,
        tier: newTier,
        limits: newTierInfo.limits,
        billing: {
          ...subscription.billing,
          amount: newTierInfo.price,
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
      
      setSubscription(updatedSubscription);
      return true;
    } catch {
      setError('Gagal melakukan downgrade subscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription, setSubscription]);

  // Update usage (simulates real-time usage tracking)
  const incrementUsage = useCallback(async (metric: 'therapists' | 'clientsToday' | 'scriptsToday', amount: number = 1) => {
    if (!subscription) return false;
    
    const newUsage = { ...subscription.usage };
    
    switch (metric) {
      case 'therapists':
        newUsage.therapists = Math.min(newUsage.therapists + amount, subscription.limits.therapists);
        break;
      case 'clientsToday':
        newUsage.clientsToday = Math.min(newUsage.clientsToday + amount, subscription.limits.clientsPerDay);
        newUsage.clientsThisMonth += amount;
        break;
      case 'scriptsToday':
        newUsage.scriptsToday = Math.min(newUsage.scriptsToday + amount, subscription.limits.scriptsPerDay);
        newUsage.scriptsThisMonth += amount;
        break;
    }
    
    updateUsage(newUsage);
    return true;
  }, [subscription, updateUsage]);

  // Check if action is allowed based on usage limits
  const checkUsageLimit = useCallback((metric: 'therapists' | 'clientsToday' | 'scriptsToday'): { allowed: boolean; reason?: string } => {
    if (!subscription || !usageMetrics) {
      return { allowed: false, reason: 'Subscription data tidak tersedia' };
    }
    
    const usage = usageMetrics[metric];
    
    if (usage.current >= usage.limit) {
      return { 
        allowed: false, 
        reason: `Batas ${metric === 'therapists' ? 'therapist' : metric === 'clientsToday' ? 'klien harian' : 'script harian'} telah tercapai (${usage.current}/${usage.limit})` 
      };
    }
    
    return { allowed: true };
  }, [subscription, usageMetrics]);

  return {
    // State
    subscription,
    usageMetrics,
    usageAlerts,
    isLoading,
    error,
    
    // Current tier info
    currentTierInfo: getCurrentTierInfo(),
    
    // Plans and options
    availablePlans: getAvailablePlans(),
    upgradeOptions: getUpgradeOptions(),
    downgradeOptions: getDowngradeOptions(),
    
    // Actions
    upgradeSubscription,
    downgradeSubscription,
    incrementUsage,
    checkUsageLimit,
    
    // Usage checkers
    canAddTherapist,
    canAddClientToday,
    canGenerateScriptToday,
    getRemainingQuota,
    
    // Utilities
    clearError: () => setError(null),
  };
};