'use client';

import { useEffect } from 'react';
import { useOnboardingStore, OnboardingStepEnum } from '@/store/onboarding';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingClinicForm } from './OnboardingClinicForm';
import { OnboardingSubscriptionForm } from './OnboardingSubscriptionForm';
import { OnboardingPaymentForm } from './OnboardingPaymentForm';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const stepTitles = {
  [OnboardingStepEnum.ClinicInfo]: 'Informasi Klinik',
  [OnboardingStepEnum.Subscription]: 'Pilih Paket',
  [OnboardingStepEnum.Payment]: 'Pembayaran',
  [OnboardingStepEnum.Complete]: 'Setup Selesai',
};

const stepDescriptions = {
  [OnboardingStepEnum.ClinicInfo]: 'Lengkapi informasi klinik Anda',
  [OnboardingStepEnum.Subscription]: 'Pilih paket berlangganan yang sesuai',
  [OnboardingStepEnum.Payment]: 'Lakukan pembayaran untuk mengaktifkan akun',
  [OnboardingStepEnum.Complete]: 'Setup klinik berhasil diselesaikan',
};

export const OnboardingFlow: React.FC = () => {
  const router = useRouter();
  const { userHasClinic, needsOnboarding, serverCurrentStep, isLoaded } = useOnboarding();
  const { 
    currentStep, 
    setStep,
    prevStep, 
    error, 
    clearError,
    isLoading,
    completeOnboarding,
  } = useOnboardingStore();

  // Handle step synchronization with server status
  useEffect(() => {
    if (!isLoaded) return;


    // Sync current step with server status if provided
    if (serverCurrentStep) {
      const stepMap = {
        'clinic_info': OnboardingStepEnum.ClinicInfo,
        'subscription': OnboardingStepEnum.Subscription,
        'payment': OnboardingStepEnum.Payment,
        'complete': OnboardingStepEnum.Complete,
      };
      const targetStep = stepMap[serverCurrentStep as keyof typeof stepMap];
      if (targetStep && targetStep !== currentStep) {
        setStep(targetStep);
      }
    }
  }, [isLoaded, needsOnboarding, userHasClinic, serverCurrentStep, currentStep, setStep]);

  // Show loading while checking status
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memeriksa status onboarding...</p>
        </div>
      </div>
    );
  }

  const stepOrder = [
    OnboardingStepEnum.ClinicInfo,
    OnboardingStepEnum.Subscription,
    OnboardingStepEnum.Payment,
    OnboardingStepEnum.Complete,
  ];

  const getStepNumber = () => {
    return stepOrder.indexOf(currentStep) + 1;
  };

  const canGoBack = currentStep !== OnboardingStepEnum.ClinicInfo && 
                    currentStep !== OnboardingStepEnum.Subscription &&
                    currentStep !== OnboardingStepEnum.Complete;

  const handleBack = () => {
    clearError();
    prevStep();
  };

  const handleGoToPortal = async () => {
    try {
      // Complete onboarding first to notify server
      await completeOnboarding();
      // Navigate to portal after completion
      router.push('/portal');
    } catch (error) {
      // Navigate anyway
      router.push('/portal');
    }
  };


  const renderCurrentStep = () => {
    switch (currentStep) {
      case OnboardingStepEnum.ClinicInfo:
        return <OnboardingClinicForm />;
      case OnboardingStepEnum.Subscription:
        return <OnboardingSubscriptionForm />;
      case OnboardingStepEnum.Payment:
        return <OnboardingPaymentForm />;
      case OnboardingStepEnum.Complete:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Klinik Selesai!</h2>
            <p className="text-gray-600 mb-6">
              Klinik Anda telah berhasil dikonfigurasi. Sekarang Anda dapat mulai menggunakan Smart Therapy untuk mengelola sesi hipnoterapi.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleGoToPortal}
                className="w-full"
              >
                Mulai Menggunakan Smart Therapy
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Setup Klinik
          </h1>
          <p className="text-gray-600">
            {stepDescriptions[currentStep]}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Progress Steps */}
        {currentStep !== OnboardingStepEnum.Complete && (
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {stepOrder.slice(0, -1).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepOrder.indexOf(currentStep) >= index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < stepOrder.length - 2 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        stepOrder.indexOf(currentStep) > index
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-center">
              <span className="text-sm text-gray-600">
                Langkah {getStepNumber()} dari {stepOrder.length - 1}
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {renderCurrentStep()}

          {/* Back Button */}
          {canGoBack && (
            <div className="mt-6">
              <Button
                onClick={handleBack}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Butuh bantuan?{' '}
            <a href="/support" className="font-medium text-blue-600 hover:text-blue-500">
              Hubungi Tim Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};