import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

interface ClientAssessmentPageProps {
  params: {
    code: string;
  };
}

export function generateMetadata({ params }: ClientAssessmentPageProps): Metadata {
  return {
    title: `Client Assessment ${params.code.toUpperCase()} - Smart Therapy`,
    description: `Assessment history and AI analysis results for client ${params.code.toUpperCase()}`,
  };
}

export default function ClientAssessmentPage({ params }: ClientAssessmentPageProps) {
  return (
    <div className="space-content">
      <MainHeader
        title={`Client Assessment ${params.code.toUpperCase()}`}
        description="Assessment history and AI analysis"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Latest Assessment
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Current AI assessment results for this client
          </p>
          <div className="space-form">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
              <div>
                <p className="font-medium">General Assessment</p>
                <p className="text-sm text-muted-foreground">January 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">Score: 85/100</p>
                <p className="text-xs text-muted-foreground">High Compatibility</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Technique Recommendations
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            AI-recommended hypnotherapy techniques
          </p>
          <div className="space-form">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Progressive Relaxation</span>
                <span className="text-sm font-medium text-primary">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Guided Imagery</span>
                <span className="text-sm font-medium text-primary">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cognitive Restructuring</span>
                <span className="text-sm font-medium text-secondary">78%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Assessment Profile
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Summary of client profile analysis results
          </p>
          <div className="space-form">
            <div className="text-sm space-y-2">
              <div><strong>Primary Goal:</strong> Overcoming anxiety</div>
              <div><strong>Receptivity Level:</strong> High (8/10)</div>
              <div><strong>Cultural Preference:</strong> Traditional Indonesian</div>
              <div><strong>Religious Factor:</strong> Islam - Conservative</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Assessment History
        </h3>
        <div className="space-form">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">General Assessment</h4>
                  <p className="text-sm text-muted-foreground">January 15, 2024, 14:30</p>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  Active
                </span>
              </div>
              <p className="text-sm mb-2">
                Comprehensive evaluation for anxiety therapy with Indonesian cultural approach.
              </p>
              <div className="text-xs text-muted-foreground">
                Duration: 45 minutes • Compatibility Score: 85/100
              </div>
            </div>

            <div className="border rounded-lg p-4 opacity-60">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Initial Assessment</h4>
                  <p className="text-sm text-muted-foreground">January 10, 2024, 10:15</p>
                </div>
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                  Completed
                </span>
              </div>
              <p className="text-sm mb-2">
                Preliminary assessment to understand client background and needs.
              </p>
              <div className="text-xs text-muted-foreground">
                Duration: 30 minutes • Compatibility Score: 72/100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}