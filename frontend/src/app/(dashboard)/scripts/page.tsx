import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Script Generator - Smart Therapy',
  description: 'Generate 7-phase hypnotherapy scripts based on AI assessment',
};

export default function ScriptsPage() {
  return (
    <div className="space-content">
      <MainHeader
        title="Hypnotherapy Script Generator"
        description="Create AI-based 7-phase hypnotherapy session scripts"
      />

      <div className="glass rounded-lg padding-responsive mb-6">
        <h3 className="text-responsive-lg font-semibold mb-4">
          7-Phase Hypnotherapy System
        </h3>
        <div className="responsive-grid gap-responsive">
          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <h4 className="font-semibold">Preparation</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Creating a comfortable environment and building rapport with the client
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <h4 className="font-semibold">Induction</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Guiding the client to a hypnotic state that matches their preferences
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <h4 className="font-semibold">Deepening</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Deepening the hypnotic state to increase receptivity to suggestions
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">4</span>
              </div>
              <h4 className="font-semibold">Suggestion</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Providing therapeutic suggestions tailored to the client's goals
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">5</span>
              </div>
              <h4 className="font-semibold">Ego Strengthening</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Strengthening the client's confidence and ability to achieve goals
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">6</span>
              </div>
              <h4 className="font-semibold">Future Pacing</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Guiding the client to imagine implementing changes in the future
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">7</span>
              </div>
              <h4 className="font-semibold">Emergence</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Guiding the client back to normal state with fresh and positive feelings
            </p>
          </div>
        </div>
      </div>

      <div className="responsive-form-grid gap-responsive">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            New Script Generator
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Create scripts based on client assessment results
          </p>
          <p className="text-xs text-muted-foreground">
            Feature will be implemented in the next task
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Script Templates
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Collection of templates based on case types
          </p>
          <div className="space-form">
            <div className="text-xs text-muted-foreground">
              ✓ Anxiety & Stress<br />
              ✓ Smoking Cessation<br />
              ✓ Weight Management<br />
              ✓ Confidence Building<br />
              ✓ Sleep Disorders<br />
              ✓ Pain Management
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}