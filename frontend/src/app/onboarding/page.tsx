'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ClinicOnboarding } from '@/components/clinic/ClinicOnboarding';
import { useClinic } from '@/hooks/useClinic';
import { useAuthStore } from '@/store/auth';
import { UserRoleEnum } from '@/types/enums';

function OnboardingPageContent() {
  const router = useRouter();
  const { clinic, isLoading, validateStoredClinicData } = useClinic();
  const { user, isAuthenticated } = useAuthStore();

  // Check if user is authenticated and is a clinic admin
  const isClinicAdmin = user?.roles?.includes(UserRoleEnum.ClinicAdmin);

  // Check if user has clinic data and subscription
  const hasClinic = !!clinic;
  const hasClinicFromUser = !!(user?.clinicId || user?.clinicName);
  const hasSubscription = !!(clinic?.subscriptionTier && clinic.subscriptionTier.trim() !== '');
  const hasSubscriptionFromUser = !!(user?.subscriptionTier && user.subscriptionTier.trim() !== '');

  // Validate stored clinic data on page load to clear any stale data
  React.useEffect(() => {
    if (isAuthenticated && user && isClinicAdmin) {
      validateStoredClinicData();
    }
  }, [isAuthenticated, user, isClinicAdmin, validateStoredClinicData]);

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
    if (!isLoading && hasClinic && hasSubscription) {
      router.push('/portal');
    }
  }, [hasClinic, hasSubscription, isLoading, router]);

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
  if (hasClinic && hasSubscription) {
    return null;
  }

  return (
    <ClinicOnboarding 
      onComplete={handleOnboardingComplete}
      hasClinic={hasClinic || hasClinicFromUser}
      hasSubscription={hasSubscription || hasSubscriptionFromUser}
    />
  );
}

export default function OnboardingPage() {
  return <OnboardingPageContent />;
}
