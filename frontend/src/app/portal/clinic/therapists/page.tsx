'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TherapistList } from '@/components/therapists/TherapistList';
import { UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { UserRoleEnum } from '@/types/enums';

function TherapistsPageContent() {
  return (
    <PageWrapper
      title="Therapist Management"
      description="Manage and monitor therapists in your clinic"
    >
      <TherapistList />
    </PageWrapper>
  );
}

export default function TherapistsPage() {
  // Clinic admin access control
  const { user, isLoading, hasRole } = useAuth();

  // Access control check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!user || !hasRole(UserRoleEnum.ClinicAdmin)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            Only clinic administrators can access therapist management.
          </p>
          <Link href="/portal">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <TherapistsPageContent />;
}