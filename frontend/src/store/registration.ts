import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  RegistrationState,
  RegistrationStep,
  UserFormData,
  VerificationData,
  RegistrationStatus,
  EmailStatus,
} from '@/types/registration';
import { RegistrationStepEnum } from '@/types/enums';
import { apiClient } from '@/lib/http-client';

interface RegistrationStore extends RegistrationState {
  setStep: (step: RegistrationStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateUserData: (data: UserFormData) => void;
  updateVerificationData: (data: VerificationData) => void;
  validateVerificationCode: (code: string) => boolean;
  resendVerificationEmail: () => Promise<void>;
  clearVerificationData: () => void;
  submitRegistration: () => Promise<boolean>;
  resetRegistration: () => void;
  clearError: () => void;
  clearEmailStatus: () => void;
  markEmailAsVerified: (email: string) => void;
  isEmailVerified: (email: string) => boolean;
  // API methods
  checkEmailStatus: (email: string) => Promise<EmailStatus>;
  startRegistration: (userData: UserFormData) => Promise<RegistrationStatus>;
  verifyEmail: (code: string) => Promise<RegistrationStatus>;
}

const stepOrder: RegistrationStep[] = [
  RegistrationStepEnum.EmailCheck,
  RegistrationStepEnum.UserForm,
  RegistrationStepEnum.EmailVerification,
  RegistrationStepEnum.Complete,
];

export const useRegistrationStore = create<RegistrationStore>()(
  persist(
    (set, get) => ({
      currentStep: RegistrationStepEnum.EmailCheck,
      data: {},
      verificationData: {
        code: '',
        emailSent: false,
        attempts: 0,
        verified: false
      },
      emailStatus: null,
      isLoading: false,
      error: null,
      verifiedEmails: [],

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

      updateUserData: (userData: UserFormData) => {
        const { data } = get();
        set({
          data: {
            ...data,
            user: userData,
          },
        });
      },



      updateVerificationData: (verificationData: VerificationData) => {
        set({ verificationData });
      },

      validateVerificationCode: (code: string) => {
        const { verificationData } = get();
        // In development, accept static code
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

        try {
          await apiClient.post('/registration/resend-code', {
            email: get().data.user?.email
          });

          set({
            verificationData: {
              ...verificationData,
              emailSent: true,
              lastSentAt: new Date()
            }
          });
        } catch (error) {
          console.error('Failed to resend verification email:', error);
        }
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

      submitRegistration: async () => {
        set({ isLoading: true, error: null });

        try {
          // Registration is complete after email verification
          // No additional API call needed since backend automatically activates user
          set({
            isLoading: false,
            currentStep: RegistrationStepEnum.Complete,
          });
          return true;
        } catch (error) {
          set({
            error: 'Terjadi kesalahan saat registrasi',
            isLoading: false,
          });
          return false;
        }
      },

      resetRegistration: () => {
        set({
          currentStep: RegistrationStepEnum.EmailCheck,
          data: {},
          verificationData: {
            code: '',
            emailSent: false,
            attempts: 0,
            verified: false
          },
          emailStatus: null,
          isLoading: false,
          error: null,
          verifiedEmails: [],
        });
      },

      clearError: () => set({ error: null }),

      clearEmailStatus: () => set({ emailStatus: null }),

      markEmailAsVerified: (email: string) => {
        const { verifiedEmails } = get();
        if (!verifiedEmails.includes(email)) {
          set({
            verifiedEmails: [...verifiedEmails, email],
            verificationData: {
              code: '',
              emailSent: false,
              attempts: 0,
              verified: true
            }
          });
        }
      },

      isEmailVerified: (email: string) => {
        const { verifiedEmails } = get();
        return verifiedEmails.includes(email);
      },

      // API Methods
      checkEmailStatus: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post('/registration/check-email', {
            email,
          });

          const emailStatus = response.data.data;
          set({
            emailStatus,
            isLoading: false,
          });

          return emailStatus;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Gagal memeriksa status email',
            isLoading: false,
          });
          throw error;
        }
      },

      startRegistration: async (userData: UserFormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post('/registration/start', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
          });

          const registrationStatus = response.data.data;
          set({
            isLoading: false,
            currentStep: RegistrationStepEnum.EmailVerification,
          });

          return registrationStatus;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Gagal memulai registrasi',
            isLoading: false,
          });
          throw error;
        }
      },

      verifyEmail: async (code: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post('/registration/verify-email', {
            email: get().data.user?.email,
            code: code,
          });

          const verificationResult = response.data.data;
          set({
            isLoading: false,
            currentStep: RegistrationStepEnum.Complete,
            verificationData: {
              code: '',
              emailSent: false,
              attempts: 0,
              verified: true
            }
          });

          return verificationResult;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Gagal memverifikasi email',
            isLoading: false,
          });
          throw error;
        }
      },



    }),
    {
      name: 'registration-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: state.data,
        verificationData: state.verificationData,
        emailStatus: state.emailStatus,
        verifiedEmails: state.verifiedEmails,
      }),
    }
  )
);