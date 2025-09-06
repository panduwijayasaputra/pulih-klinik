'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ClinicOnboarding } from '@/components/clinic/ClinicOnboarding';
import { useClinic } from '@/hooks/useClinic';
import { useAuthStore } from '@/store/auth';
import { UserRoleEnum } from '@/types/enums';

function OnboardingPageContent() {
  const router = useRouter();
  const { clinic, isLoading } = useClinic();
  const { user, isAuthenticated } = useAuthStore();

  // Check if user is authenticated and is a clinic admin
  const isClinicAdmin = user?.roles?.includes(UserRoleEnum.ClinicAdmin);

  // Check if user has clinic data and subscription (use API data as source of truth)
  const hasClinic = !!clinic;
  const hasClinicFromUser = !!(user?.clinicId || user?.clinicName);
  const hasSubscription = !!(clinic?.subscriptionTier && clinic.subscriptionTier.trim() !== '');
  const hasSubscriptionFromUser = !!(user?.subscriptionTier && user.subscriptionTier.trim() !== '');

  // Use API data as source of truth, but fallback to user data if API is still loading
  const effectiveHasClinic = isLoading ? hasClinicFromUser : hasClinic;
  const effectiveHasSubscription = isLoading ? hasSubscriptionFromUser : hasSubscription;

  // Clear stale stored data if there's a mismatch between API and stored data
  React.useEffect(() => {
    if (!isLoading && user && !clinic && hasClinicFromUser) {
      console.log('Clearing stale clinic data from storage - clinic exists in user data but not in API');
      const { setUser, setClinic } = useAuthStore.getState();
      setUser({
        ...user,
        clinicId: '',
        clinicName: '',
        subscriptionTier: ''
      });
      setClinic(null);
    }
  }, [isLoading, user, clinic, hasClinicFromUser]);

  // Redirect if not authenticated or not a clinic admin
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    
    if (!isClinicAdmin) {
      router.push('/portal');
      return;
    }
  }, [isAuthenticated, user, isClinicAdmin, router]);

  const handleOnboardingComplete = () => {
    // Redirect to clinic management page after successful completion
    router.push('/portal');
  };

  // If clinic exists and has subscription, redirect to manage page
  React.useEffect(() => {
    if (!isLoading && effectiveHasClinic && effectiveHasSubscription) {
      router.push('/portal');
    }
  }, [effectiveHasClinic, effectiveHasSubscription, isLoading, router]);

  // Show loading state while checking authentication and clinic data
  if (!isAuthenticated || !user || !isClinicAdmin || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // If clinic exists and has subscription, don't render anything (redirect will happen)
  if (effectiveHasClinic && effectiveHasSubscription) {
    return null;
  }

  return (
    <ClinicOnboarding 
      onComplete={handleOnboardingComplete}
      hasClinic={effectiveHasClinic}
      hasSubscription={effectiveHasSubscription}
    />
  );
}

export default function OnboardingPage() {
  return <OnboardingPageContent />;
}
