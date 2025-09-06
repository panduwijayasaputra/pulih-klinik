'use client';

import React, { useState } from 'react';
import { ClinicProfileForm } from './ClinicProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BuildingOfficeIcon, CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface ClinicOnboardingProps {
  onComplete: () => void;
}

type OnboardingStep = 'clinic-info' | 'verification' | 'complete';

export const ClinicOnboarding: React.FC<ClinicOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('clinic-info');

  const handleClinicCreated = () => {
    setCurrentStep('verification');
  };

  const handleVerificationComplete = () => {
    setCurrentStep('complete');
  };

  const handleFinalComplete = () => {
    onComplete();
  };

  const getStepNumber = (step: OnboardingStep): number => {
    switch (step) {
      case 'clinic-info': return 1;
      case 'verification': return 2;
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
            Selamat Datang di Smart Therapy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mari kita mulai dengan membuat profil klinik Anda. Informasi ini akan membantu 
            kami memberikan pengalaman terbaik untuk Anda dan pasien.
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
              isStepCompleted('verification') || isStepActive('verification') ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
            
            {/* Step 2: Verifikasi */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isStepCompleted('verification') 
                  ? 'bg-green-600' 
                  : isStepActive('verification') 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
              }`}>
                {isStepCompleted('verification') ? (
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${
                    isStepActive('verification') ? 'text-white' : 'text-gray-500'
                  }`}>2</span>
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isStepActive('verification') ? 'text-gray-900' : 'text-gray-500'
              }`}>Verifikasi</span>
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
              {currentStep === 'verification' && 'Verifikasi Klinik'}
              {currentStep === 'complete' && 'Selamat! Klinik Anda Siap'}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              {currentStep === 'clinic-info' && 'Lengkapi informasi berikut untuk memulai menggunakan Smart Therapy. Semua informasi dapat diubah nanti di pengaturan.'}
              {currentStep === 'verification' && 'Klinik Anda telah dibuat! Tim kami akan memverifikasi informasi klinik Anda dalam 1-2 hari kerja.'}
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
            
            {currentStep === 'verification' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
                  <ShieldCheckIcon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Verifikasi Sedang Berlangsung
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Tim kami akan memverifikasi informasi klinik Anda dalam 1-2 hari kerja. 
                  Anda akan menerima notifikasi email setelah verifikasi selesai.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Catatan:</strong> Anda dapat mulai menggunakan Smart Therapy sekarang, 
                    tetapi beberapa fitur mungkin terbatas hingga verifikasi selesai.
                  </p>
                </div>
                <Button 
                  onClick={handleVerificationComplete}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Lanjutkan ke Dashboard
                </Button>
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
