'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TherapistPasswordSetup } from '@/components/auth/TherapistPasswordSetup';
import { 
  ExclamationTriangleIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

function TherapistSetupContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Registration Link</h2>
              <p className="text-gray-600 mb-6">
                The registration link appears to be invalid or incomplete. Please check your email for the correct link.
              </p>
              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full">
                    Go to Login
                  </Button>
                </Link>
                <p className="text-sm text-gray-500">
                  Need help? Contact your clinic administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Registration</h1>
          <p className="text-gray-600">
            Set your password to activate your therapist account
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Password Setup</CardTitle>
            <p className="text-sm text-gray-600">
              Create a secure password for your therapist account
            </p>
          </CardHeader>
          <CardContent>
            <TherapistPasswordSetup token={token} />
          </CardContent>
        </Card>

        {/* Security Note */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Security Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your registration link is secure and can only be used once</li>
                    <li>The link will expire after 24 hours for security</li>
                    <li>After setting your password, you can login normally</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Questions about your account? Contact your clinic administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TherapistSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    }>
      <TherapistSetupContent />
    </Suspense>
  );
}