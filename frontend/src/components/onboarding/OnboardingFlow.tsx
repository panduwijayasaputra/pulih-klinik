'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore, OnboardingStepEnum } from '@/store/onboarding';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth';
import { OnboardingClinicForm } from './OnboardingClinicForm';
import { OnboardingSubscriptionForm } from './OnboardingSubscriptionForm';
import { OnboardingPaymentForm } from './OnboardingPaymentForm';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

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
  const { user, isAuthenticated } = useAuth();
  const { 
    needsOnboarding, 
    userHasClinic, 
    hasActiveSubscription, 
    isLoaded,
    shouldRedirectToPortal,
    getCurrentStep 
  } = useOnboarding();
  
  const { 
    currentStep, 
    setStep,
    prevStep, 
    error, 
    clearError,
    isLoading,
    completeOnboarding,
    clearJustCompletedSubscription,
    justCompletedSubscription,
    resetOnboarding,
  } = useOnboardingStore();

  // Redirect to portal if user has completed onboarding
  useEffect(() => {
    if (isLoaded && shouldRedirectToPortal) {
      router.push('/portal');
    }
  }, [isLoaded, shouldRedirectToPortal, router]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoaded, isAuthenticated, router]);

  // Sync current step with user state
  useEffect(() => {
    if (isLoaded && needsOnboarding) {
      const serverStep = getCurrentStep(); // Call function directly, don't include in dependencies
      
      // Debug: Onboarding flow sync (can be removed in production)
      console.log('🔍 OnboardingFlow sync:', {
        currentStep,
        serverStep,
        userHasClinic,
        hasActiveSubscription,
      });
      
      // If current step is complete but user needs onboarding, reset the store
      if (currentStep === OnboardingStepEnum.Complete && serverStep !== OnboardingStepEnum.Complete) {
        console.log('🔄 Resetting onboarding store');
        resetOnboarding();
        setStep(serverStep);
      } else if (serverStep !== currentStep) {
        console.log('🔄 Updating step from', currentStep, 'to', serverStep);
        setStep(serverStep);
      }
    }
  }, [isLoaded, needsOnboarding, currentStep, setStep, resetOnboarding, userHasClinic, hasActiveSubscription]); // Removed getCurrentStep dependency

  // Smart validation trigger for clinic deletion detection - only on page load
  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      console.log('🔄 Onboarding page loaded - checking if validation needed...');
      
      const authState = useAuthStore.getState();
      const isDataStale = authState.isDataStale();
      const isValidating = authState.isValidating;
      
      // Only validate if data is stale and not already validating
      // Remove the currentStep dependency to prevent infinite loops
      if (isDataStale && !isValidating) {
        console.log('🔄 Smart validation triggered - data is stale');
        if ((window as any).forceAuthValidation) {
          (window as any).forceAuthValidation();
        }
      } else {
        console.log('✅ No validation needed');
      }
    }
  }, [isLoaded, isAuthenticated]); // Removed currentStep dependency

  // Enhanced stale data validation with periodic checks
  useEffect(() => {
    if (!isLoaded || !isAuthenticated) return;

    // Set up periodic stale data validation every 2 minutes
    const staleDataCheckInterval = setInterval(() => {
      const authState = useAuthStore.getState();
      const isDataStale = authState.isDataStale();
      const isValidating = authState.isValidating;
      
      if (isDataStale && !isValidating) {
        console.log('🔄 Periodic stale data validation triggered');
        if ((window as any).forceAuthValidation) {
          (window as any).forceAuthValidation();
        }
      }
    }, 2 * 60 * 1000); // Check every 2 minutes

    return () => clearInterval(staleDataCheckInterval);
  }, [isLoaded, isAuthenticated]);

  // Smart validation trigger for subscription step entry
  useEffect(() => {
    if (isLoaded && isAuthenticated && currentStep === OnboardingStepEnum.Subscription) {
      console.log('🔄 Subscription step entered - checking if validation needed...');
      
      const authState = useAuthStore.getState();
      const isValidating = authState.isValidating;
      
      // Validate when entering subscription step to ensure clinic data is current
      // This helps detect if clinic was deleted while user was on previous step
      if (!isValidating) {
        console.log('🔄 Smart validation triggered - subscription step entry');
        if ((window as any).forceAuthValidation) {
          (window as any).forceAuthValidation();
        }
      } else {
        console.log('✅ Validation already in progress, skipping');
      }
    }
  }, [isLoaded, isAuthenticated, currentStep]);

  // Smart validation trigger for payment step entry
  useEffect(() => {
    if (isLoaded && isAuthenticated && currentStep === OnboardingStepEnum.Payment) {
      console.log('🔄 Payment step entered - checking if validation needed...');
      
      const authState = useAuthStore.getState();
      const isValidating = authState.isValidating;
      
      // Validate when entering payment step to ensure subscription data is current
      // This helps detect if subscription was deleted while user was on previous step
      if (!isValidating) {
        console.log('🔄 Smart validation triggered - payment step entry');
        if ((window as any).forceAuthValidation) {
          (window as any).forceAuthValidation();
        }
      } else {
        console.log('✅ Validation already in progress, skipping');
      }
    }
  }, [isLoaded, isAuthenticated, currentStep]);

  // Handle complete onboarding redirect
  useEffect(() => {
    if (justCompletedSubscription) {
      const timer = setTimeout(() => {
        completeOnboarding();
        clearJustCompletedSubscription();
        router.push('/portal');
      }, 5000); // 5 second delay

      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [justCompletedSubscription, completeOnboarding, clearJustCompletedSubscription, router]);

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show redirect message if user should be redirected
  if (shouldRedirectToPortal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Mengarahkan ke portal...</p>
        </div>
      </div>
    );
  }

  // Show not authenticated message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Anda perlu masuk terlebih dahulu</p>
          <Button 
            onClick={() => router.push('/login')}
            className="mt-4"
          >
            Masuk
          </Button>
        </div>
      </div>
    );
  }

  // If user doesn't need onboarding, redirect to portal
  if (!needsOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Mengarahkan ke portal...</p>
        </div>
      </div>
    );
  }

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
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Setup Berhasil!
              </h2>
              <p className="text-gray-600">
                Klinik Anda telah berhasil dikonfigurasi dan siap digunakan.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Selamat!
              </h3>
              <p className="text-green-700 text-sm">
                Anda akan diarahkan ke portal dalam beberapa detik...
              </p>
            </div>
          </div>
        );
      default:
        return <OnboardingClinicForm />;
    }
  };

  const canGoBack = currentStep !== OnboardingStepEnum.ClinicInfo;
  const showBackButton = canGoBack && currentStep !== OnboardingStepEnum.Complete;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {stepTitles[currentStep]}
          </h1>
          <p className="text-muted-foreground">
            {stepDescriptions[currentStep]}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {Object.values(OnboardingStepEnum).map((step, index) => {
              const isActive = step === currentStep;
              const isCompleted = index < Object.values(OnboardingStepEnum).indexOf(currentStep);
              
              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < Object.values(OnboardingStepEnum).length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Back Button */}
        {showBackButton && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isLoading}
              className="flex items-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearError}
              className="mt-2"
            >
              Tutup
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-card rounded-lg border p-6">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};