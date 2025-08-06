import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dashboard - Smart Therapy',
  description: 'Main dashboard of the Indonesian AI Hypnotherapy system',
};

export default function DashboardPage() {
  return (
    <div className="space-content">
      <MainHeader
        title="Dashboard"
        description="Welcome to the Indonesian AI Hypnotherapy system"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-2">
            Active Clients
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Manage your client profiles and history
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-2">
            AI Assessment
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Analyze and recommend hypnotherapy techniques
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-2">
            Session Scripts
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Generate 7-phase hypnotherapy scripts
          </p>
        </div>
      </div>
    </div>
  );
}