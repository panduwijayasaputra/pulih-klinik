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
    // Redirect to clinic management page after successful creation
    router.push('/portal/clinic/manage');
  };

  // If clinic already exists, redirect to manage page
  React.useEffect(() => {
    if (!isLoading && clinic) {
      router.push('/portal/clinic/manage');
    }
  }, [clinic, isLoading, router]);

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

  // If clinic exists, don't render anything (redirect will happen)
  if (clinic) {
    return null;
  }

  return <ClinicOnboarding onComplete={handleOnboardingComplete} />;
}

export default function OnboardingPage() {
  return <OnboardingPageContent />;
}
