import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'AI Assessment - Smart Therapy',
  description: 'AI assessment system for hypnotherapy technique recommendations',
};

export default function AssessmentPage() {
  return (
    <div className="space-content">
      <MainHeader
        title="AI Assessment"
        description="Client analysis and AI-based hypnotherapy technique recommendations"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            General Assessment
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Comprehensive evaluation of client condition for general therapy
          </p>
          <div className="space-form">
            <div className="text-xs text-muted-foreground">
              ✓ Demographic profile and background<br />
              ✓ Mental health history<br />
              ✓ Preferences and beliefs<br />
              ✓ Therapy goals
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Addiction Assessment
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Specialized evaluation for addiction and compulsive behavior cases
          </p>
          <div className="space-form">
            <div className="text-xs text-muted-foreground">
              ✓ Type and level of addiction<br />
              ✓ Behavioral patterns and triggers<br />
              ✓ Social and environmental factors<br />
              ✓ Motivation for change
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Child Assessment
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Tailored evaluation for clients under 18 years of age
          </p>
          <div className="space-form">
            <div className="text-xs text-muted-foreground">
              ✓ Developmental stage<br />
              ✓ Family environment<br />
              ✓ Parental consent<br />
              ✓ Child-friendly approach
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          AI Assessment Features
        </h3>
        <div className="responsive-form-grid gap-responsive">
          <div>
            <h4 className="font-semibold mb-2">Technique Recommendations</h4>
            <p className="text-sm text-muted-foreground">
              AI analyzes client profile and recommends the best hypnotherapy techniques with 0-100 compatibility scores
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Cultural Adaptation</h4>
            <p className="text-sm text-muted-foreground">
              Adapts approach based on Indonesian client's cultural background, religion, and demographics
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Success Prediction</h4>
            <p className="text-sm text-muted-foreground">
              Estimates therapy success rate based on client profile and chosen techniques
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Session Planning</h4>
            <p className="text-sm text-muted-foreground">
              Provides guidance on recommended number of sessions and progress milestones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}