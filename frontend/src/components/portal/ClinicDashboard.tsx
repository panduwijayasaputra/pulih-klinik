'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';

export const ClinicDashboard: React.FC = () => {
  return (
    <PageWrapper
      title="Dashboard Klinik"
      description="Kelola klinik dan tim therapist Anda"
    >
      {/* Dashboard content will go here */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats cards will be added here */}
        </div>
      </div>
    </PageWrapper>
  );
};