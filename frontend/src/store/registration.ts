import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  ClinicDataFormData, 
  PaymentFormData, 
  RegistrationState,
  RegistrationStep,
  SubscriptionFormData,
  mockRegistrationResult
} from '@/types/registration';

interface RegistrationStore extends RegistrationState {
  setStep: (step: RegistrationStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateClinicData: (data: ClinicDataFormData) => void;
  updateSubscriptionData: (data: SubscriptionFormData) => void;
  updatePaymentData: (data: PaymentFormData) => void;
  submitRegistration: () => Promise<boolean>;
  resetRegistration: () => void;
  clearError: () => void;
}

const stepOrder: RegistrationStep[] = ['clinic', 'subscription', 'payment', 'complete'];

export const useRegistrationStore = create<RegistrationStore>()(
  persist(
    (set, get) => ({
      currentStep: 'clinic',
      data: {},
      isLoading: false,
      error: null,

      setStep: (step: RegistrationStep) => {
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

      updateClinicData: (clinicData: ClinicDataFormData) => {
        const { data } = get();
        set({
          data: {
            ...data,
            clinic: clinicData,
          },
        });
      },

      updateSubscriptionData: (subscriptionData: SubscriptionFormData) => {
        const { data } = get();
        set({
          data: {
            ...data,
            subscription: subscriptionData,
          },
        });
      },

      updatePaymentData: (paymentData: PaymentFormData) => {
        const { data } = get();
        set({
          data: {
            ...data,
            payment: paymentData,
          },
        });
      },

      submitRegistration: async () => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Mock registration success
          const result = mockRegistrationResult;
          
          if (result.success) {
            set({
              isLoading: false,
              currentStep: 'complete',
            });
            return true;
          } else {
            set({
              error: 'Registrasi gagal. Silakan coba lagi.',
              isLoading: false,
            });
            return false;
          }
        } catch {
          set({
            error: 'Terjadi kesalahan saat registrasi',
            isLoading: false,
          });
          return false;
        }
      },

      resetRegistration: () => {
        set({
          currentStep: 'clinic',
          data: {},
          isLoading: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'registration-storage',
      partialize: (state) => ({ 
        currentStep: state.currentStep,
        data: state.data,
      }),
    }
  )
);