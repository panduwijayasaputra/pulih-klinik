'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { TherapistForm } from '@/components/dashboard/TherapistForm';
import { ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';

export default function NewTherapistPage() {
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
            Only clinic administrators can register new therapists.
          </p>
          <Link href="/portal/therapists">
            <Button variant="outline">Back to Therapist Management</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center space-x-4">
        <Link href="/portal/therapists">
          <Button variant="ghost" size="sm" className="flex items-center">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Therapist Management
          </Button>
        </Link>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Register New Therapist</h1>
        <p className="text-gray-600 mt-2">
          Create a new therapist account. The therapist will receive an email to set their password.
        </p>
      </div>

      {/* Registration Form */}
      <TherapistForm />

      {/* Information Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Registration Process
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Complete the form above with therapist details</li>
                  <li>System will create the account with "pending setup" status</li>
                  <li>Therapist receives registration email with secure link</li>
                  <li>Therapist clicks link to set password and activate account</li>
                  <li>Account becomes active and therapist can login</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}