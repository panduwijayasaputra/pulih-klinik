import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStore } from '@/store/onboarding';
import { httpClient } from '@/lib/http-client';

export const useOnboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const { isComplete } = useOnboardingStore();
  const [serverStatus, setServerStatus] = useState<{ 
    needsOnboarding?: boolean; 
    hasClinic?: boolean; 
    hasActiveSubscription?: boolean;
    currentStep?: string;
    loaded?: boolean 
  }>({ loaded: false });

  // Fetch onboarding status from server when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const checkServerStatus = async () => {
        try {
          const response = await httpClient.get('/onboarding/status');
          console.log('🌐 Onboarding status API response:', response.data);
          if (response.data?.success) {
            const statusData = {
              needsOnboarding: response.data.data?.needsOnboarding,
              hasClinic: response.data.data?.hasClinic,
              hasActiveSubscription: response.data.data?.hasActiveSubscription,
              currentStep: response.data.data?.currentStep,
              loaded: true,
            };
            console.log('📊 Setting server status:', statusData);
            setServerStatus(statusData);
          } else {
            console.warn('⚠️ API response not successful');
            setServerStatus({ loaded: true });
          }
        } catch (error) {
          console.warn('Failed to fetch onboarding status:', error);
          setServerStatus({ loaded: true });
        }
      };
      checkServerStatus();
    } else {
      setServerStatus({ loaded: true });
    }
  }, [isAuthenticated, user]);

  // Client-side fallback check
  const clientHasClinic = !!(user?.clinicId || user?.clinicName);
  const clientNeedsOnboarding = isAuthenticated && user && (!user.clinicId && !user.clinicName) && !isComplete;

  // Use server status if loaded, otherwise use client-side check
  const userHasClinic = serverStatus.loaded 
    ? (serverStatus.hasClinic ?? clientHasClinic)
    : clientHasClinic;
    
  const needsOnboarding = serverStatus.loaded
    ? (serverStatus.needsOnboarding ?? clientNeedsOnboarding)
    : clientNeedsOnboarding;
  
  return {
    needsOnboarding: !!needsOnboarding,
    hasCompletedOnboarding: isComplete,
    userHasClinic,
    hasActiveSubscription: serverStatus.hasActiveSubscription,
    serverCurrentStep: serverStatus.currentStep,
    isLoaded: serverStatus.loaded,
  };
};