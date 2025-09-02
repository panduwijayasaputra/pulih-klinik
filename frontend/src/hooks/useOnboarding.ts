import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStore } from '@/store/onboarding';

export const useOnboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const { isComplete } = useOnboardingStore();

  // User needs onboarding if they're authenticated but don't have clinic data
  const needsOnboarding = isAuthenticated && user && (!user.clinicId && !user.clinicName) && !isComplete;
  
  return {
    needsOnboarding: !!needsOnboarding,
    hasCompletedOnboarding: isComplete,
    userHasClinic: !!(user?.clinicId || user?.clinicName),
  };
};