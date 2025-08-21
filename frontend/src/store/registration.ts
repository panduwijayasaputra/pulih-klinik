import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ClinicDataFormData,
  PaymentFormData,
  RegistrationState,
  RegistrationStep,
  VerificationData,
  mockRegistrationResult
} from '@/types/registration';
import { RegistrationStepEnum } from '@/types/enums';

interface RegistrationStore extends RegistrationState {
  setStep: (step: RegistrationStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateClinicData: (data: ClinicDataFormData) => void;
  updateVerificationData: (data: VerificationData) => void;
  updatePaymentData: (data: PaymentFormData) => void;
  validateVerificationCode: (code: string) => boolean;
  resendVerificationEmail: () => Promise<void>;
  clearVerificationData: () => void;
  submitRegistration: () => Promise<boolean>;
  resetRegistration: () => void;
  clearError: () => void;
}

const stepOrder: RegistrationStep[] = [RegistrationStepEnum.Clinic, RegistrationStepEnum.Verification, RegistrationStepEnum.Summary, RegistrationStepEnum.Payment, RegistrationStepEnum.Complete];

export const useRegistrationStore = create<RegistrationStore>()(
  persist(
    (set, get) => ({
      currentStep: RegistrationStepEnum.Clinic,
      data: {},
      verificationData: {
        code: '',
        emailSent: false,
        attempts: 0,
        verified: false
      },
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

      updateVerificationData: (verificationData: VerificationData) => {
        set({ verificationData });
      },

      validateVerificationCode: (code: string) => {
        const { verificationData } = get();
        // Mock validation - in real implementation, this would call an API
        const isValid = code === '123456';
        if (isValid) {
          set({
            verificationData: {
              ...verificationData,
              verified: true,
              code
            }
          });
        } else {
          set({
            verificationData: {
              ...verificationData,
              attempts: verificationData.attempts + 1
            }
          });
        }
        return isValid;
      },

      resendVerificationEmail: async () => {
        const { verificationData } = get();
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({
          verificationData: {
            ...verificationData,
            emailSent: true,
            lastSentAt: new Date()
          }
        });
      },

      clearVerificationData: () => {
        set({
          verificationData: {
            code: '',
            emailSent: false,
            attempts: 0,
            verified: false
          }
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
              currentStep: RegistrationStepEnum.Complete,
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
          currentStep: RegistrationStepEnum.Clinic,
          data: {},
          verificationData: {
            code: '',
            emailSent: false,
            attempts: 0,
            verified: false
          },
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