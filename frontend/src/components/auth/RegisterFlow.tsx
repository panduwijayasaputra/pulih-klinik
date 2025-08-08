'use client';

import React from 'react';
import { useRegistrationStore } from '@/store/registration';
import { ClinicForm } from './ClinicForm';
import { EmailVerification } from './EmailVerification';
import { RegistrationSummary } from './RegistrationSummary';
import { PaymentModal } from '../payment/PaymentModal';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const stepTitles = {
  clinic: 'Informasi Klinik',
  verification: 'Verifikasi Email',
  summary: 'Ringkasan Registrasi',
  payment: 'Pembayaran',
  complete: 'Selesai'
};

const stepDescriptions = {
  clinic: 'Masukkan informasi lengkap klinik Anda',
  verification: 'Verifikasi email admin untuk keamanan akun',
  summary: 'Tinjau informasi registrasi dan ketentuan layanan',
  payment: 'Pilih metode pembayaran dan selesaikan transaksi',
  complete: 'Registrasi berhasil! Ikuti langkah selanjutnya'
};

export const RegisterFlow: React.FC = () => {
  const { 
    currentStep, 
    prevStep, 
    error, 
    clearError,
    resetRegistration,
    data,
    nextStep,
    setStep
  } = useRegistrationStore();

  const getStepNumber = () => {
    const steps = ['clinic', 'verification', 'summary', 'payment', 'complete'];
    return steps.indexOf(currentStep) + 1;
  };

  const getProgressPercentage = () => {
    const steps = ['clinic', 'verification', 'summary', 'payment', 'complete'];
    return (steps.indexOf(currentStep) / (steps.length - 1)) * 100;
  };

  const canGoBack = currentStep !== 'clinic' && currentStep !== 'complete';

  const handleBack = () => {
    clearError();
    prevStep();
  };

  const handleStartOver = () => {
    resetRegistration();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'clinic':
        return <ClinicForm />;
      case 'verification':
        return (
          <EmailVerification
            email={data.clinic?.adminEmail || ''}
            onVerificationSuccess={() => nextStep()}
            onResendEmail={async () => {
              // Mock resend email functionality
              await new Promise(resolve => setTimeout(resolve, 1000));
            }}
          />
        );
              case 'summary':
          return (
            <RegistrationSummary
              clinicData={data.clinic}
              onEditClinic={() => setStep('clinic')}
              onProceedToPayment={() => nextStep()}
            />
          );
      case 'payment':
        return <PaymentModal />;
      case 'complete':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrasi Berhasil!</h2>
            <p className="text-gray-600 mb-6">
              Akun klinik Anda telah berhasil dibuat. Silakan login untuk mulai menggunakan Terapintar.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => window.location.href = '/login'}
                className="w-full"
              >
                Masuk ke Akun
              </Button>
              <Button
                onClick={handleStartOver}
                variant="outline"
                className="w-full"
              >
                Daftar Klinik Lain
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="absolute inset-0 bg-white/30" />
      <div className="relative z-10 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Daftar Klinik Baru
            </h1>
            <p className="text-gray-600">
              Bergabunglah dengan Terapintar untuk memulai transformasi digital klinik hipnoterapi Anda
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Langkah {getStepNumber()} dari 5
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(getProgressPercentage())}% selesai
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          {/* Step Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {stepTitles[currentStep]}
            </h2>
            <p className="text-gray-600">
              {stepDescriptions[currentStep]}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="p-6 sm:p-8">
              {/* Back Button */}
              {canGoBack && (
                <div className="mb-6">
                  <Button
                    onClick={handleBack}
                    variant="ghost"
                    className="p-2 h-auto text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Kembali
                  </Button>
                </div>
              )}

              {/* Step Content */}
              {renderCurrentStep()}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>
              Sudah memiliki akun?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Masuk di sini
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};