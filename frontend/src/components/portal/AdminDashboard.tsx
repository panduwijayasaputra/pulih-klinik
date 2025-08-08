'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';

export const AdminDashboard: React.FC = () => {
  return (
    <PageWrapper
      title="Panel Administrator"
      description="Kelola sistem Terapintar secara keseluruhan"
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