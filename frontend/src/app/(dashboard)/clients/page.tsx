import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Client Management - Smart Therapy',
  description: 'Manage hypnotherapy client profiles and data',
};

export default function ClientsPage() {
  return (
    <div className="space-content">
      <MainHeader
        title="Client Management"
        description="Manage your hypnotherapy client profiles and history"
      />

      <div className="glass rounded-lg padding-responsive">
        <div className="text-center space-form">
          <h3 className="text-responsive-lg font-semibold">
            Client List
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Client management page will be implemented in the next task
          </p>
        </div>
      </div>
    </div>
  );
}