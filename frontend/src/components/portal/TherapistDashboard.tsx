import React from 'react'
import { PageWrapper } from '../layout/PageWrapper'

export const TherapistDashboard = () => {
  return (
    <PageWrapper
      title="Dashboard Therapist"
      description="Kelola klien dan terapi Anda"
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