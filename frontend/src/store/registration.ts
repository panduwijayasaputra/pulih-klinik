import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  RegistrationState,
  RegistrationStep,
  UserFormData,
  ClinicFormData,
  SubscriptionData,
  PaymentData,
  VerificationData,
  RegistrationStatus,
  SUBSCRIPTION_TIERS,
} from '@/types/registration';
import { RegistrationStepEnum } from '@/types/enums';
import { apiClient } from '@/lib/http-client';

interface RegistrationStore extends RegistrationState {
  setStep: (step: RegistrationStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateUserData: (data: UserFormData) => void;
  updateClinicData: (data: ClinicFormData) => void;
  updateSubscriptionData: (data: SubscriptionData) => void;
  updatePaymentData: (data: PaymentData) => void;
  updateVerificationData: (data: VerificationData) => void;
  validateVerificationCode: (code: string) => boolean;
  resendVerificationEmail: () => Promise<void>;
  clearVerificationData: () => void;
  submitRegistration: () => Promise<boolean>;
  resetRegistration: () => void;
  clearError: () => void;
  markEmailAsVerified: (email: string) => void;
  isEmailVerified: (email: string) => boolean;
  // API methods
  startRegistration: (userData: UserFormData) => Promise<RegistrationStatus>;
  verifyEmail: (registrationId: string, code: string) => Promise<RegistrationStatus>;
  submitClinicData: (registrationId: string, clinicData: ClinicFormData) => Promise<RegistrationStatus>;
  selectSubscription: (registrationId: string, subscriptionData: SubscriptionData) => Promise<RegistrationStatus>;
  processPayment: (registrationId: string, paymentData: PaymentData) => Promise<RegistrationStatus>;
  completeRegistration: (registrationId: string) => Promise<RegistrationStatus>;
  getRegistrationStatus: (registrationId: string) => Promise<RegistrationStatus>;
}

const stepOrder: RegistrationStep[] = [
  RegistrationStepEnum.UserForm,
  RegistrationStepEnum.EmailVerification,
  RegistrationStepEnum.Complete,
];

export const useRegistrationStore = create<RegistrationStore>()(
  persist(
    (set, get) => ({
      currentStep: RegistrationStepEnum.UserForm,
      data: {},
      verificationData: {
        code: '',
        emailSent: false,
        attempts: 0,
        verified: false
      },
      registrationId: undefined,
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
        const { verificationData, registrationId } = get();
        if (!registrationId) return;

        try {
          await apiClient.post(`/registration/resend-verification`, {
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
          const { data, registrationId } = get();
          
          if (!registrationId) {
            throw new Error('No registration ID found');
          }

          // Complete registration
          const result = await get().completeRegistration(registrationId);

          if (result) {
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
          currentStep: RegistrationStepEnum.UserForm,
          data: {},
          verificationData: {
            code: '',
            emailSent: false,
            attempts: 0,
            verified: false
          },
          registrationId: undefined,
          isLoading: false,
          error: null,
          verifiedEmails: [],
        });
      },

      clearError: () => set({ error: null }),

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
            registrationId: registrationStatus.id,
            isLoading: false,
            currentStep: RegistrationStepEnum.EmailVerification,
          });

          return registrationStatus;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to start registration',
            isLoading: false,
          });
          throw error;
        }
      },

      verifyEmail: async (registrationId: string, code: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post(`/registration/${registrationId}/verify-email`, {
            verificationCode: code,
          });

          const registrationStatus = response.data.data;
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

          return registrationStatus;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to verify email',
            isLoading: false,
          });
          throw error;
        }
      },

      submitClinicData: async (registrationId: string, clinicData: ClinicFormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.put(`/registration/${registrationId}/clinic-data`, clinicData);

          const registrationStatus = response.data.data;
          set({
            isLoading: false,
            currentStep: RegistrationStepEnum.Subscription,
          });

          return registrationStatus;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to submit clinic data',
            isLoading: false,
          });
          throw error;
        }
      },

      selectSubscription: async (registrationId: string, subscriptionData: SubscriptionData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post(`/registration/${registrationId}/subscription`, {
            tierCode: subscriptionData.tierCode,
            billingCycle: subscriptionData.billingCycle,
            amount: subscriptionData.amount,
            currency: subscriptionData.currency,
          });

          const registrationStatus = response.data.data;
          set({
            isLoading: false,
            currentStep: RegistrationStepEnum.Payment,
          });

          return registrationStatus;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to select subscription',
            isLoading: false,
          });
          throw error;
        }
      },

      processPayment: async (registrationId: string, paymentData: PaymentData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post(`/registration/${registrationId}/payment`, {
            paymentMethod: paymentData.paymentMethod,
            amount: paymentData.amount,
            currency: paymentData.currency,
            transactionId: paymentData.transactionId,
            paymentId: paymentData.paymentId,
          });

          const registrationStatus = response.data.data;
          set({
            isLoading: false,
            currentStep: RegistrationStepEnum.Complete,
          });

          return registrationStatus;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to process payment',
            isLoading: false,
          });
          throw error;
        }
      },

      completeRegistration: async (registrationId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post(`/registration/${registrationId}/complete`, {
            confirm: true,
          });

          const registrationStatus = response.data.data;
          set({
            isLoading: false,
            currentStep: RegistrationStepEnum.Complete,
          });

          return registrationStatus;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to complete registration',
            isLoading: false,
          });
          throw error;
        }
      },

      getRegistrationStatus: async (registrationId: string) => {
        try {
          const response = await apiClient.get(`/registration/${registrationId}/status`);
          return response.data.data;
        } catch (error: any) {
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
        registrationId: state.registrationId,
        verifiedEmails: state.verifiedEmails,
      }),
    }
  )
);