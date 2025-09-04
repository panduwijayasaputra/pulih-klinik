import { OnboardingStepEnum } from '@/store/onboarding';
import { ClinicFormData, SubscriptionData, PaymentData } from '@/types/registration';

// Cache for validation results to avoid repeated computations
const validationCache = new Map<string, OnboardingValidationResult>();

export interface OnboardingValidationResult {
  isValid: boolean;
  currentStep: OnboardingStepEnum;
  missingFields: string[];
  canProceed: boolean;
}

export interface UserOnboardingState {
  hasClinic: boolean;
  hasSubscription: boolean;
  hasPayment: boolean;
  clinicData?: ClinicFormData | undefined;
  subscriptionData?: SubscriptionData | undefined;
  paymentData?: PaymentData | undefined;
}

/**
 * Validates the current onboarding state and determines the appropriate step
 */
export const validateOnboardingState = (userState: UserOnboardingState): OnboardingValidationResult => {
  // Create cache key from user state
  const cacheKey = `${userState.hasClinic}-${userState.hasSubscription}-${userState.hasPayment}-${!!userState.clinicData}-${!!userState.subscriptionData}-${!!userState.paymentData}`;
  
  // Return cached result if available
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!;
  }
  
  const { hasClinic, hasSubscription, hasPayment, clinicData, subscriptionData, paymentData } = userState;
  
  // Determine current step based on what's missing
  let currentStep: OnboardingStepEnum;
  let missingFields: string[] = [];
  let canProceed = false;

  if (!hasClinic || !clinicData) {
    currentStep = OnboardingStepEnum.ClinicInfo;
    missingFields = ['clinic'];
    canProceed = false;
  } else if (!hasSubscription || !subscriptionData) {
    currentStep = OnboardingStepEnum.Subscription;
    missingFields = ['subscription'];
    canProceed = true; // Can proceed from clinic to subscription
  } else if (!hasPayment || !paymentData) {
    currentStep = OnboardingStepEnum.Payment;
    missingFields = ['payment'];
    canProceed = true; // Can proceed from subscription to payment
  } else {
    currentStep = OnboardingStepEnum.Complete;
    missingFields = [];
    canProceed = true;
  }

  const result = {
    isValid: missingFields.length === 0,
    currentStep,
    missingFields,
    canProceed,
  };
  
  // Cache the result
  validationCache.set(cacheKey, result);
  
  return result;
};

/**
 * Validates if a specific step is complete
 */
export const isStepComplete = (step: OnboardingStepEnum, userState: UserOnboardingState): boolean => {
  const { hasClinic, hasSubscription, hasPayment, clinicData, subscriptionData, paymentData } = userState;

  switch (step) {
    case OnboardingStepEnum.ClinicInfo:
      return hasClinic && !!clinicData;
    case OnboardingStepEnum.Subscription:
      return hasSubscription && !!subscriptionData;
    case OnboardingStepEnum.Payment:
      return hasPayment && !!paymentData;
    case OnboardingStepEnum.Complete:
      return hasClinic && hasSubscription && hasPayment;
    default:
      return false;
  }
};

/**
 * Gets the next step in the onboarding flow
 */
export const getNextStep = (currentStep: OnboardingStepEnum): OnboardingStepEnum | null => {
  const stepOrder = [
    OnboardingStepEnum.ClinicInfo,
    OnboardingStepEnum.Subscription,
    OnboardingStepEnum.Payment,
    OnboardingStepEnum.Complete,
  ];

  const currentIndex = stepOrder.indexOf(currentStep);
  if (currentIndex === -1) return null;
  
  const nextIndex = currentIndex + 1;
  return nextIndex < stepOrder.length ? (stepOrder[nextIndex] as OnboardingStepEnum) : null;
};

/**
 * Gets the previous step in the onboarding flow
 */
export const getPreviousStep = (currentStep: OnboardingStepEnum): OnboardingStepEnum | null => {
  const stepOrder = [
    OnboardingStepEnum.ClinicInfo,
    OnboardingStepEnum.Subscription,
    OnboardingStepEnum.Payment,
    OnboardingStepEnum.Complete,
  ];

  const currentIndex = stepOrder.indexOf(currentStep);
  if (currentIndex === -1) return null;
  
  const prevIndex = currentIndex - 1;
  return prevIndex >= 0 ? (stepOrder[prevIndex] as OnboardingStepEnum) : null;
};

/**
 * Checks if user can skip to a specific step
 */
export const canSkipToStep = (targetStep: OnboardingStepEnum, userState: UserOnboardingState): boolean => {
  const { hasClinic, hasSubscription, hasPayment } = userState;

  switch (targetStep) {
    case OnboardingStepEnum.ClinicInfo:
      return true; // Always can go to first step
    case OnboardingStepEnum.Subscription:
      return hasClinic;
    case OnboardingStepEnum.Payment:
      return hasClinic && hasSubscription;
    case OnboardingStepEnum.Complete:
      return hasClinic && hasSubscription && hasPayment;
    default:
      return false;
  }
};

/**
 * Gets the progress percentage for the onboarding flow
 */
export const getOnboardingProgress = (userState: UserOnboardingState): number => {
  const { hasClinic, hasSubscription, hasPayment } = userState;
  
  let completedSteps = 0;
  if (hasClinic) completedSteps++;
  if (hasSubscription) completedSteps++;
  if (hasPayment) completedSteps++;
  
  return (completedSteps / 3) * 100; // 3 main steps before complete
};

/**
 * Clears the validation cache (useful for testing or when state changes significantly)
 */
export const clearValidationCache = (): void => {
  validationCache.clear();
};
