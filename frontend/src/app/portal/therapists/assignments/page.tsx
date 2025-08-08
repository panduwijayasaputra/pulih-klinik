'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TherapistAssignment } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { 
  UsersIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function TherapistAssignmentsPage() {
  const router = useRouter();

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
        <div className="p-2 bg-green-100 rounded-lg">
          <UsersIcon className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Penugasan Therapist</h1>
          <p className="text-gray-600">Kelola penugasan therapist ke klien berdasarkan spesialisasi dan beban kerja</p>
        </div>
      </div>

      {/* Assignment Interface */}
      <TherapistAssignment />
      </div>
    </RoleGuard>
  );
}