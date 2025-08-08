'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { TherapistList } from '@/components/dashboard/TherapistList';
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

function TherapistsPageContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Therapist Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor therapists in your clinic
          </p>
        </div>
        <Link href="/portal/therapists/new">
          <Button className="flex items-center">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add New Therapist
          </Button>
        </Link>
      </div>

      {/* Therapist List */}
      <TherapistList />
    </div>
  );
}

export default function TherapistsPage() {
  // Clinic admin access control
  const { user, isLoading } = useAuth();

  // Access control check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!user || !user.roles.includes('clinic_admin')) {
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