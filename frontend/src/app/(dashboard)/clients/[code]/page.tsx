import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

interface ClientDetailPageProps {
  params: {
    code: string;
  };
}

export function generateMetadata({ params }: ClientDetailPageProps): Metadata {
  return {
    title: `Client Detail ${params.code.toUpperCase()} - Smart Therapy`,
    description: `Profile and history of client with code ${params.code.toUpperCase()}`,
  };
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  return (
    <div className="space-content">
      <MainHeader
        title={`Client Detail ${params.code.toUpperCase()}`}
        description="Complete profile and session history"
      />

      <div className="responsive-form-grid gap-responsive">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Client Profile
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Client Code: <span className="font-mono font-semibold">{params.code.toUpperCase()}</span>
          </p>
          <p className="text-responsive-xs text-muted-foreground mt-2">
            Profile details will be implemented in the next task
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Assessment History
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Assessment history and AI recommendations
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Hypnotherapy Sessions
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Session history and client progress
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Generated Scripts
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Hypnotherapy scripts that have been created
          </p>
        </div>
      </div>
    </div>
  );
}