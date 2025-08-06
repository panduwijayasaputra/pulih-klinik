import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Session Management - Smart Therapy',
  description: 'Manage hypnotherapy sessions and track client progress',
};

export default function SessionsPage() {
  return (
    <div className="space-content">
      <MainHeader
        title="Session Management"
        description="Manage hypnotherapy sessions and monitor client progress"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Session Schedule
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Manage upcoming sessions with clients
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Session History
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Review previous sessions and client progress
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Analytics
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Analyze session data and therapy success rates
          </p>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Progress Tracking
        </h3>
        <div className="responsive-form-grid gap-responsive">
          <div>
            <h4 className="font-semibold mb-2">Before & After Assessment</h4>
            <p className="text-sm text-muted-foreground">
              Compare client condition before and after therapy to measure progress
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Session Notes</h4>
            <p className="text-sm text-muted-foreground">
              Record observations and client feedback for each session for ongoing evaluation
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Goal Achievement</h4>
            <p className="text-sm text-muted-foreground">
              Track achievement of therapy goals set at the beginning of treatment
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Success Metrics</h4>
            <p className="text-sm text-muted-foreground">
              Success metrics based on Indonesian hypnotherapy standards
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-responsive-xs text-muted-foreground">
            Session management features will be implemented in the next task
          </p>
        </div>
      </div>
    </div>
  );
}