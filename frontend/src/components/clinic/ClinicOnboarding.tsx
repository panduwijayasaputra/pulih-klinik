'use client';

import React, { useState } from 'react';
import { ClinicProfileForm } from './ClinicProfileForm';
import { SubscriptionSelector } from '@/components/auth/SubscriptionSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BuildingOfficeIcon, CheckCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useClinic } from '@/hooks/useClinic';
import { useToast } from '@/components/ui/toast';

interface ClinicOnboardingProps {
  onComplete: () => void;
  hasClinic?: boolean;
  hasSubscription?: boolean;
}

type OnboardingStep = 'clinic-info' | 'subscription' | 'complete';

export const ClinicOnboarding: React.FC<ClinicOnboardingProps> = ({
  onComplete,
  hasClinic = false,
  hasSubscription = false 
}) => {
  const { updateSubscription, isLoading } = useClinic();
  const { addToast } = useToast();

  // Debug logging
  console.log('ClinicOnboarding props:', { hasClinic, hasSubscription });

  // Determine initial step based on what's missing
  const getInitialStep = (): OnboardingStep => {
    if (!hasClinic) return 'clinic-info';
    if (!hasSubscription) return 'subscription';
    return 'complete';
  };

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(() => {
    // Only set initial step once when component mounts
    const initialStep = !hasClinic ? 'clinic-info' : (!hasSubscription ? 'subscription' : 'complete');
    console.log('Initial step set to:', initialStep);
    return initialStep;
  });

  // Debug current step changes
  React.useEffect(() => {
    console.log('Current step changed to:', currentStep);
  }, [currentStep]);

  const handleClinicCreated = () => {
    console.log('Clinic created, moving to subscription step');
    setCurrentStep('subscription');
  };

  const handleSubscriptionSelected = async (subscriptionTier: string) => {
    const success = await updateSubscription(subscriptionTier);
    if (success) {
      addToast({
        type: 'success',
        title: 'Subscription Berhasil Dipilih',
        message: `Paket ${subscriptionTier} telah berhasil dipilih dan akan aktif segera.`,
        duration: 5000,
      });
      setCurrentStep('complete');
    } else {
      addToast({
        type: 'error',
        title: 'Gagal Memilih Subscription',
        message: 'Terjadi kesalahan saat memilih paket subscription. Silakan coba lagi.',
        duration: 5000,
      });
    }
  };

  const handleFinalComplete = () => {
    onComplete();
  };

  const getStepNumber = (step: OnboardingStep): number => {
    switch (step) {
      case 'clinic-info': return 1;
      case 'subscription': return 2;
      case 'complete': return 3;
      default: return 1;
    }
  };

  const isStepActive = (step: OnboardingStep): boolean => {
    return currentStep === step;
  };

  const isStepCompleted = (step: OnboardingStep): boolean => {
    const currentStepNumber = getStepNumber(currentStep);
    const stepNumber = getStepNumber(step);
    return stepNumber < currentStepNumber;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <BuildingOfficeIcon className="w-8 h-8 text-white" />
          </div>
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">
                   {currentStep === 'clinic-info' && 'Selamat Datang di Smart Therapy'}
                   {currentStep === 'subscription' && 'Pilih Paket Subscription'}
                   {currentStep === 'complete' && 'Onboarding Selesai!'}
                 </h1>
                 <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                   {currentStep === 'clinic-info' && 'Mari kita mulai dengan membuat profil klinik Anda. Informasi ini akan membantu kami memberikan pengalaman terbaik untuk Anda dan pasien.'}
                   {currentStep === 'subscription' && 'Pilih paket subscription yang sesuai dengan kebutuhan klinik Anda. Anda dapat mengubah paket kapan saja.'}
                   {currentStep === 'complete' && 'Proses onboarding telah selesai. Anda sekarang dapat mengakses semua fitur Smart Therapy.'}
                 </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Step 1: Informasi Klinik */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isStepCompleted('clinic-info') 
                  ? 'bg-green-600' 
                  : isStepActive('clinic-info') 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
              }`}>
                {isStepCompleted('clinic-info') ? (
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${
                    isStepActive('clinic-info') ? 'text-white' : 'text-gray-500'
                  }`}>1</span>
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isStepActive('clinic-info') ? 'text-gray-900' : 'text-gray-500'
              }`}>Informasi Klinik</span>
            </div>
            
                   <div className={`w-8 h-0.5 ${
                     isStepCompleted('subscription') || isStepActive('subscription') ? 'bg-blue-600' : 'bg-gray-300'
                   }`}></div>
                   
                   {/* Step 2: Subscription */}
                   <div className="flex items-center">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                       isStepCompleted('subscription') 
                         ? 'bg-green-600' 
                         : isStepActive('subscription') 
                           ? 'bg-blue-600' 
                           : 'bg-gray-300'
                     }`}>
                       {isStepCompleted('subscription') ? (
                         <CheckCircleIcon className="w-4 h-4 text-white" />
                       ) : (
                         <span className={`text-sm font-medium ${
                           isStepActive('subscription') ? 'text-white' : 'text-gray-500'
                         }`}>2</span>
                       )}
                     </div>
                     <span className={`ml-2 text-sm font-medium ${
                       isStepActive('subscription') ? 'text-gray-900' : 'text-gray-500'
                     }`}>Subscription</span>
                   </div>
            
            <div className={`w-8 h-0.5 ${
              isStepCompleted('complete') || isStepActive('complete') ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
            
            {/* Step 3: Selesai */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isStepCompleted('complete') 
                  ? 'bg-green-600' 
                  : isStepActive('complete') 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
              }`}>
                {isStepCompleted('complete') ? (
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                ) : (
                  <CheckCircleIcon className={`w-4 h-4 ${
                    isStepActive('complete') ? 'text-white' : 'text-gray-500'
                  }`} />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isStepActive('complete') ? 'text-gray-900' : 'text-gray-500'
              }`}>Selesai</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
                 <CardTitle className="text-2xl font-bold text-gray-900">
                   {currentStep === 'clinic-info' && 'Informasi Dasar Klinik'}
                   {currentStep === 'subscription' && 'Pilih Paket Subscription'}
                   {currentStep === 'complete' && 'Selamat! Klinik Anda Siap'}
                 </CardTitle>
                 <CardDescription className="text-gray-600 text-base">
                   {currentStep === 'clinic-info' && 'Lengkapi informasi berikut untuk memulai menggunakan Smart Therapy. Semua informasi dapat diubah nanti di pengaturan.'}
                   {currentStep === 'subscription' && 'Pilih paket subscription yang sesuai dengan kebutuhan klinik Anda. Anda dapat mengubah paket kapan saja.'}
                   {currentStep === 'complete' && 'Proses onboarding telah selesai. Anda sekarang dapat mengakses semua fitur Smart Therapy.'}
                 </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 'clinic-info' && (
              <ClinicProfileForm 
                onSaveSuccess={handleClinicCreated}
                showActions={true}
              />
            )}
            
            {currentStep === 'subscription' && (
              <div className="py-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                    <CreditCardIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Pilih Paket Subscription
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Pilih paket yang sesuai dengan kebutuhan klinik Anda. 
                    Semua paket termasuk fitur dasar Smart Therapy.
                  </p>
                </div>
                
                <SubscriptionSelector 
                  onSubscriptionSelected={handleSubscriptionSelected}
                  isLoading={isLoading}
                />
              </div>
            )}
            
            {currentStep === 'complete' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Onboarding Selesai!
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Klinik Anda telah berhasil dibuat dan siap digunakan. 
                  Anda sekarang dapat mengakses semua fitur Smart Therapy.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 text-sm">
                    <strong>Selamat!</strong> Anda dapat mulai menambahkan terapis, 
                    mengelola klien, dan menggunakan semua fitur Smart Therapy.
                  </p>
                </div>
                <Button 
                  onClick={handleFinalComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Masuk ke Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Dengan melanjutkan, Anda menyetujui{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              Syarat dan Ketentuan
            </a>{' '}
            dan{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              Kebijakan Privasi
            </a>{' '}
            Smart Therapy.
          </p>
        </div>
      </div>
    </div>
  );
};
