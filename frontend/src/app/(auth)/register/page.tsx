'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RegisterFlow } from '@/components/auth/RegisterFlow';
import { useRegistrationStore } from '@/store/registration';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const { 
    setStep, 
    currentStep,
    updateUserData,
    data,
    resetRegistration
  } = useRegistrationStore();

  // Handle URL-based state management
  useEffect(() => {
    const urlStep = searchParams.get('step');
    const urlEmail = searchParams.get('email');

    // Clear entire registration store when page loads to ensure fresh start
    resetRegistration();

    // If we have an email in URL, pre-fill it
    if (urlEmail) {
      updateUserData({ 
        email: urlEmail,
        name: '',
        password: '',
        confirmPassword: ''
      });
    }

    // If we have a step in URL, set it
    if (urlStep) {
      setStep(urlStep as any);
    }
  }, [searchParams, setStep, updateUserData, resetRegistration]);

  return (
    <RouteGuard>
      <RegisterFlow />
    </RouteGuard>
  );
}