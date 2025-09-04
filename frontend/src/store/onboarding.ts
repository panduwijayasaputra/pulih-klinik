import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ClinicFormData,
  SubscriptionData,
  PaymentData,
} from '@/types/registration';
import { apiClient } from '@/lib/http-client';
import { useAuthStore } from '@/store/auth';

export enum OnboardingStepEnum {
  ClinicInfo = 'clinic_info',
  Subscription = 'subscription',
  Payment = 'payment',
  Complete = 'complete',
}

export type OnboardingStep = OnboardingStepEnum;

interface OnboardingData {
  clinic?: ClinicFormData;
  subscription?: SubscriptionData;
  payment?: PaymentData;
}

interface OnboardingState {
  currentStep: OnboardingStep;
  data: OnboardingData;
  isLoading: boolean;
  error: string | null;
  isComplete: boolean;
  justCompletedSubscription: boolean;
}

interface OnboardingStore extends OnboardingState {
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateClinicData: (data: ClinicFormData) => void;
  updateSubscriptionData: (data: SubscriptionData) => void;
  updatePaymentData: (data: PaymentData) => void;
  submitClinicData: (data: ClinicFormData) => Promise<void>;
  submitSubscription: (data: SubscriptionData) => Promise<void>;
  submitPayment: (data: PaymentData) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;
  clearError: () => void;
  clearJustCompletedSubscription: () => void;
}

const stepOrder: OnboardingStep[] = [
  OnboardingStepEnum.ClinicInfo,
  OnboardingStepEnum.Subscription,
  OnboardingStepEnum.Payment,
  OnboardingStepEnum.Complete,
];

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      currentStep: OnboardingStepEnum.ClinicInfo,
      data: {},
      isLoading: false,
      error: null,
      isComplete: false,
      justCompletedSubscription: false,

      setStep: (step: OnboardingStep) => {
        set({ currentStep: step });
      },

      nextStep: () => {
        const { currentStep } = get();
        const currentIndex = stepOrder.indexOf(currentStep);
        const nextIndex = Math.min(currentIndex + 1, stepOrder.length - 1);
        const nextStep = stepOrder[nextIndex];
        if (nextStep) {
          set({ currentStep: nextStep });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        const currentIndex = stepOrder.indexOf(currentStep);
        const prevIndex = Math.max(currentIndex - 1, 0);
        const prevStep = stepOrder[prevIndex];
        if (prevStep) {
          set({ currentStep: prevStep });
        }
      },

      updateClinicData: (clinicData: ClinicFormData) => {
        const { data } = get();
        set({
          data: {
            ...data,
            clinic: clinicData,
          },
        });
      },

      updateSubscriptionData: (subscriptionData: SubscriptionData) => {
        const { data } = get();
        set({
          data: {
            ...data,
            subscription: subscriptionData,
          },
        });
      },

      updatePaymentData: (paymentData: PaymentData) => {
        const { data } = get();
        set({
          data: {
            ...data,
            payment: paymentData,
          },
        });
      },

      submitClinicData: async (clinicData: ClinicFormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post('/onboarding/clinic', clinicData);

          // Update auth store with new user data that includes clinic
          if (response.data?.data?.user) {
            const authStore = useAuthStore.getState();
            authStore.login({
              user: response.data.data.user,
              token: authStore.token || '',
              refreshToken: authStore.refreshToken || '',
            });
          } else {
          }

          get().updateClinicData(clinicData);
          set({
            isLoading: false,
            currentStep: OnboardingStepEnum.Subscription,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to submit clinic data',
            isLoading: false,
          });
          throw error;
        }
      },

      submitSubscription: async (subscriptionData: SubscriptionData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post('/onboarding/subscription', {
            tierCode: subscriptionData.tierCode,
            billingCycle: subscriptionData.billingCycle,
            amount: subscriptionData.amount,
            currency: subscriptionData.currency,
          });

          // Update auth store with new user data that includes subscription
          if (response.data?.data?.user) {
            const authStore = useAuthStore.getState();
            authStore.login({
              user: response.data.data.user,
              token: authStore.token || '',
              refreshToken: authStore.refreshToken || '',
            });
          } else {
          }

          get().updateSubscriptionData(subscriptionData);
          
          // For demo purposes, skip payment and advance to complete step
          // Don't call complete API yet - let user see thank you page first
          set({
            isLoading: false,
            currentStep: OnboardingStepEnum.Complete,
            justCompletedSubscription: true,
          });

        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to select subscription',
            isLoading: false,
          });
          throw error;
        }
      },

      submitPayment: async (paymentData: PaymentData) => {
        set({ isLoading: true, error: null });

        try {
          await apiClient.post('/onboarding/payment', {
            paymentMethod: paymentData.paymentMethod,
            amount: paymentData.amount,
            currency: paymentData.currency,
            transactionId: paymentData.transactionId,
            paymentId: paymentData.paymentId,
          });

          get().updatePaymentData(paymentData);
          set({
            isLoading: false,
            currentStep: OnboardingStepEnum.Complete,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to process payment',
            isLoading: false,
          });
          throw error;
        }
      },

      completeOnboarding: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post('/onboarding/complete');

          // Update auth store with clinic data from response
          const authStore = useAuthStore.getState();
          if (response.data?.data?.user) {
            authStore.login({
              user: response.data.data.user,
              token: authStore.token || '',
              refreshToken: authStore.refreshToken || '',
            });
          }

          set({
            isLoading: false,
            isComplete: true,
            currentStep: OnboardingStepEnum.Complete,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to complete onboarding',
            isLoading: false,
          });
          throw error;
        }
      },

      resetOnboarding: () => {
        set({
          currentStep: OnboardingStepEnum.ClinicInfo,
          data: {},
          isLoading: false,
          error: null,
          isComplete: false,
        });
      },

      clearError: () => set({ error: null }),

      clearJustCompletedSubscription: () => set({ justCompletedSubscription: false }),
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: state.data,
        isComplete: state.isComplete,
      }),
    }
  )
);