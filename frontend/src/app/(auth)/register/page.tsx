'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RegisterFlow } from '@/components/auth/RegisterFlow';
import { useRegistrationStore } from '@/store/registration';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const { 
    registrationId, 
    getRegistrationStatus, 
    setStep, 
    currentStep 
  } = useRegistrationStore();

  // Handle URL-based state management
  useEffect(() => {
    const urlRegistrationId = searchParams.get('registrationId');
    const urlStep = searchParams.get('step');

    // If we have a registration ID in URL but not in store, fetch status
    if (urlRegistrationId && !registrationId) {
      getRegistrationStatus(urlRegistrationId).catch(console.error);
    }

    // If we have a step in URL, set it
    if (urlStep) {
      setStep(urlStep as any);
    }
  }, [searchParams, registrationId, getRegistrationStatus, setStep]);

  return <RegisterFlow />;
}