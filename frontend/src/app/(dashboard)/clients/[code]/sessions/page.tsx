import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

interface ClientSessionsPageProps {
  params: {
    code: string;
  };
}

export function generateMetadata({ params }: ClientSessionsPageProps): Metadata {
  return {
    title: `Client Sessions ${params.code.toUpperCase()} - Smart Therapy`,
    description: `History and schedule of hypnotherapy sessions for client ${params.code.toUpperCase()}`,
  };
}

export default function ClientSessionsPage({ params }: ClientSessionsPageProps) {
  return (
    <div className="space-content">
      <MainHeader
        title={`Client Sessions ${params.code.toUpperCase()}`}
        description="History and management of hypnotherapy sessions"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Upcoming Sessions
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Next hypnotherapy session schedule
          </p>
          <div className="space-form">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-primary">Session #4</h4>
                  <p className="text-sm text-muted-foreground">January 20, 2024</p>
                </div>
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                  Scheduled
                </span>
              </div>
              <p className="text-sm mb-2">
                Follow-up session focusing on Progressive Relaxation technique
              </p>
              <div className="text-xs text-muted-foreground">
                Time: 14:00 - 15:30 • Duration: 90 minutes
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Therapy Progress
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Progress in achieving therapy goals
          </p>
          <div className="space-form">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Anxiety Level</span>
                  <span className="text-primary font-medium">65% ↓</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sleep Quality</span>
                  <span className="text-secondary font-medium">80% ↑</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Self Confidence</span>
                  <span className="text-secondary font-medium">70% ↑</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Session Statistics
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Summary of completed session data
          </p>
          <div className="space-form">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">Sessions Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">270</div>
                <div className="text-xs text-muted-foreground">Total Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">8.5</div>
                <div className="text-xs text-muted-foreground">Average Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">2</div>
                <div className="text-xs text-muted-foreground">Sessions Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Session History
        </h3>
        <div className="space-form">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Session #3 - Progressive Relaxation</h4>
                  <p className="text-sm text-muted-foreground">January 15, 2024, 14:00</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded mb-1 block">
                    Completed
                  </span>
                  <div className="text-xs text-muted-foreground">Rating: 9/10</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Session focused on progressive relaxation technique with Indonesian cultural adaptation. 
                Client showed excellent response.
              </p>
              <div className="text-xs text-muted-foreground">
                Duration: 90 minutes • Technique: Progressive Relaxation • Feedback: Very Positive
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Session #2 - Guided Imagery</h4>
                  <p className="text-sm text-muted-foreground">January 10, 2024, 15:30</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded mb-1 block">
                    Completed
                  </span>
                  <div className="text-xs text-muted-foreground">Rating: 8/10</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Implementation of guided imagery technique with Indonesian nature themes. 
                Client began showing improvement in anxiety management.
              </p>
              <div className="text-xs text-muted-foreground">
                Duration: 90 minutes • Technique: Guided Imagery • Feedback: Positive
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Session #1 - Intake & Assessment</h4>
                  <p className="text-sm text-muted-foreground">January 5, 2024, 10:00</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded mb-1 block">
                    Completed
                  </span>
                  <div className="text-xs text-muted-foreground">Rating: 8/10</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Initial intake session with comprehensive assessment. Building rapport 
                and understanding client's cultural background.
              </p>
              <div className="text-xs text-muted-foreground">
                Duration: 90 minutes • Technique: Assessment • Feedback: Good
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}