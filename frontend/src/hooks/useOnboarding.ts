import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStore, OnboardingStepEnum } from '@/store/onboarding';
import { validateOnboardingState, UserOnboardingState } from '@/lib/onboarding-validation';

export const useOnboarding = () => {
  const { user, clinic, isAuthenticated } = useAuth();
  const { currentStep, isComplete } = useOnboardingStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine onboarding status based on user and clinic data
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [isAuthenticated, user]);

  // Check if user needs onboarding
  const needsOnboarding = isAuthenticated && user && !isComplete && (
    !clinic || !clinic.subscription
  );

  // Check if user has clinic data
  const userHasClinic = !!clinic;

  // Check if user has active subscription
  const hasActiveSubscription = !!clinic?.subscription;

  // Create user state for validation
  const getUserState = (): UserOnboardingState => {
    return {
      hasClinic: userHasClinic,
      hasSubscription: hasActiveSubscription,
      hasPayment: hasActiveSubscription, // For demo, payment is same as subscription
      ...(clinic && {
        clinicData: {
          name: clinic.name,
          address: '',
          phone: '',
          email: '',
          website: '',
          description: '',
          workingHours: '',
          province: '',
        }
      }),
    };
  };

  // Determine current step based on user state using validation
  const getCurrentStep = (): OnboardingStepEnum => {
    const userState = getUserState();
    const validation = validateOnboardingState(userState);
    return validation.currentStep;
  };

  // Check if user should be redirected to portal
  const shouldRedirectToPortal = isAuthenticated && user && userHasClinic && hasActiveSubscription;

  return {
    // Status flags
    needsOnboarding,
    userHasClinic,
    hasActiveSubscription,
    isLoaded,
    shouldRedirectToPortal,
    
    // Current state
    currentStep: getCurrentStep(),
    isComplete,
    
    // Helper functions
    getCurrentStep,
  };
};