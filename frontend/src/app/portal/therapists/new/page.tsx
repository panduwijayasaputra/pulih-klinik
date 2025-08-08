'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TherapistForm } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { 
  UserPlusIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function NewTherapistPage() {
  const router = useRouter();

  const handleSuccess = (therapist: any) => {
    console.log('Therapist created:', therapist);
    // Show success toast/notification
    router.push('/portal/therapists');
  };

  const handleCancel = () => {
    router.push('/portal/therapists');
  };

  return (
    <RoleGuard allowedRoles={['clinic_admin']}>
      <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/portal/therapists')}
            className="flex items-center space-x-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Kembali ke Daftar</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <UserPlusIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Therapist Baru</h1>
          <p className="text-gray-600">Lengkapi informasi therapist untuk bergabung dengan tim klinik</p>
        </div>
      </div>

      {/* Form */}
      <TherapistForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
      </div>
    </RoleGuard>
  );
}