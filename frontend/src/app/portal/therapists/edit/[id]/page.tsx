'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TherapistForm } from '@/components/dashboard/TherapistForm';
import { ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { UserRoleEnum } from '@/types/enums';
import { useParams } from 'next/navigation';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { useRouter } from 'next/navigation';

export default function EditTherapistPage() {
  const router = useRouter();
  // Clinic admin access control
  const { user, isLoading } = useAuth();
  const params = useParams();
  const therapistId = params.id as string;

  // Access control check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Access control
  const isAuthorized = !!(user && user.roles.includes(UserRoleEnum.ClinicAdmin));
  
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            Only clinic administrators can edit therapist information.
          </p>
          <div className="space-y-2">
            <Link href="/portal/therapists">
              <Button variant="outline">Back to Therapist Management</Button>
            </Link>

          </div>
        </div>
      </div>
    );
  }

  return (
    <PortalPageWrapper
      title="Edit Therapist"
      description="Update therapist information. Changes will be reflected immediately."
      showBackButton={true}
      backButtonLabel="Back to Therapist Management"
      onBackClick={() => router.back()}
    > 

      {/* Edit Form */}
      <TherapistForm therapistId={therapistId} mode="edit" />

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
                Edit Process
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Update the therapist information in the form above</li>
                  <li>All changes will be saved immediately</li>
                  <li>The therapist will be notified of any important changes</li>
                  <li>Account status and permissions remain unchanged</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PortalPageWrapper>
  );
}
