import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStore, OnboardingStepEnum } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import { validateOnboardingState, UserOnboardingState } from '@/lib/onboarding-validation';

export const useOnboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const { clinic } = useAuthStore(); // Get clinic directly from store for immediate updates
  const { currentStep, isComplete, data } = useOnboardingStore();
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

  // Debug: Log clinic data changes (can be removed in production)
  useEffect(() => {
    console.log('🔍 useOnboarding clinic data changed:', {
      clinic: clinic ? { id: clinic.id, name: clinic.name, subscription: clinic.subscription } : null,
      userHasClinic,
      hasActiveSubscription,
    });
  }, [clinic, userHasClinic, hasActiveSubscription]);

  // Create user state for validation
  const getUserState = (): UserOnboardingState => {
    const state = {
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
    
    // Debug: User state (can be removed in production)
    console.log('🔍 getUserState:', {
      userHasClinic,
      hasActiveSubscription,
      clinic: clinic ? { id: clinic.id, name: clinic.name } : null,
    });
    
    return state;
  };

  // Determine current step based on user state using validation
  const getCurrentStep = (): OnboardingStepEnum => {
    const userState = getUserState();
    const validation = validateOnboardingState(userState);
    
    // Debug: Current step validation (can be removed in production)
    console.log('🔍 getCurrentStep:', {
      hasClinic: userState.hasClinic,
      hasSubscription: userState.hasSubscription,
      currentStep: validation.currentStep,
    });
    
    return validation.currentStep;
  };

  // Check if user should be redirected to portal
  const shouldRedirectToPortal = isAuthenticated && user && userHasClinic && hasActiveSubscription;

  // Calculate current step based on user state
  const currentStepFromState = getCurrentStep();

  return {
    // Status flags
    needsOnboarding,
    userHasClinic,
    hasActiveSubscription,
    isLoaded,
    shouldRedirectToPortal,
    
    // Current state
    currentStep: currentStepFromState,
    isComplete,
    
    // Helper functions
    getCurrentStep,
  };
};