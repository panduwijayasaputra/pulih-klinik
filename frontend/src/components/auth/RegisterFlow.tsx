'use client';

import { useRegistrationStore } from '@/store/registration';
import { EmailCheck } from './EmailCheck';
import { UserForm } from './UserForm';
import { EmailVerification } from './EmailVerification';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { RegistrationStepEnum } from '@/types/enums';

const stepDescriptions = {
  [RegistrationStepEnum.EmailCheck]: 'Periksa ketersediaan email Anda',
  [RegistrationStepEnum.UserForm]: 'Masukkan informasi admin klinik Anda',
  [RegistrationStepEnum.EmailVerification]: 'Verifikasi email Anda untuk melanjutkan',
  [RegistrationStepEnum.Complete]: 'Registrasi berhasil diselesaikan',
};

export const RegisterFlow: React.FC = () => {
  const { 
    currentStep, 
    prevStep, 
    error, 
    clearError,
    resetRegistration,
    data,
    isLoading
  } = useRegistrationStore();

  const stepOrder = [
    RegistrationStepEnum.EmailCheck,
    RegistrationStepEnum.UserForm,
    RegistrationStepEnum.EmailVerification,
    RegistrationStepEnum.Complete,
  ];

  const getStepNumber = () => {
    return stepOrder.indexOf(currentStep) + 1;
  };

  const handleStartOver = () => {
    resetRegistration();
  };

  const handleGoToLogin = () => {
    resetRegistration();
    window.location.href = '/login';
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case RegistrationStepEnum.EmailCheck:
        return <EmailCheck />;
      case RegistrationStepEnum.UserForm:
        return <UserForm />;
      case RegistrationStepEnum.EmailVerification:
        return (
          <EmailVerification
            email={data.user?.email || ''}
          />
        );
      case RegistrationStepEnum.Complete:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrasi Berhasil!</h2>
            <p className="text-gray-600 mb-6">
              Akun Anda telah berhasil dibuat. Silakan login untuk melengkapi setup klinik dan memulai menggunakan Pulih Klinik.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleGoToLogin}
                className="w-full"
              >
                Masuk ke Akun
              </Button>
              <Button
                onClick={handleStartOver}
                variant="outline"
                className="w-full"
              >
                Daftar Akun Lain
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
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar Klinik
          </h1>
          <p className="text-gray-600">
            {stepDescriptions[currentStep as keyof typeof stepDescriptions] || ''}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Progress Steps */}
        {currentStep !== RegistrationStepEnum.Complete && (
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

        </div>

        {/* Footer */}
        <div className="mt-8 text-center flex flex-col justify-center items-center gap-2">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Masuk di sini
            </a>
          </p>
          <p className="text-sm text-gray-600">
            atau{' '}
            <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
              Kembali ke Beranda
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};