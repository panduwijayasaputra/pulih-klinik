import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

interface ClientScriptsPageProps {
  params: {
    code: string;
  };
}

export function generateMetadata({ params }: ClientScriptsPageProps): Metadata {
  return {
    title: `Client Scripts ${params.code.toUpperCase()} - Smart Therapy`,
    description: `Collection of hypnotherapy scripts created for client ${params.code.toUpperCase()}`,
  };
}

export default function ClientScriptsPage({ params }: ClientScriptsPageProps) {
  return (
    <div className="space-content">
      <MainHeader
        title={`Client Scripts ${params.code.toUpperCase()}`}
        description="Collection of specially created hypnotherapy scripts"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Active Script
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Script currently being used in therapy
          </p>
          <div className="space-form">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-primary">Progressive Relaxation Script</h4>
                  <p className="text-sm text-muted-foreground">Created: January 15, 2024</p>
                </div>
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                  Active
                </span>
              </div>
              <p className="text-sm mb-2">
                7-phase script adapted to Indonesian cultural profile and client's religious preferences.
              </p>
              <div className="text-xs text-muted-foreground">
                Duration: 45 minutes • Level: Intermediate • AI Score: 92%
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Script Statistics
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Performance data of scripts that have been used
          </p>
          <div className="space-form">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-xs text-muted-foreground">Total Scripts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">87%</div>
                <div className="text-xs text-muted-foreground">Effectiveness</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">Used</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">8.5</div>
                <div className="text-xs text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Cultural Adaptation
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Indonesian cultural elements in scripts
          </p>
          <div className="space-form">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Language:</span>
                <span className="font-medium">Formal Indonesian</span>
              </div>
              <div className="flex justify-between">
                <span>Religious Context:</span>
                <span className="font-medium">Islam - Conservative</span>
              </div>
              <div className="flex justify-between">
                <span>Imagery:</span>
                <span className="font-medium">Indonesian Nature</span>
              </div>
              <div className="flex justify-between">
                <span>Cultural Values:</span>
                <span className="font-medium">Communal & Harmony</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Script Collection
        </h3>
        <div className="space-form">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Progressive Relaxation Script</h4>
                  <p className="text-sm text-muted-foreground">January 15, 2024 • 45 minutes</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded mb-1 block">
                    Active
                  </span>
                  <div className="text-xs text-muted-foreground">AI Score: 92%</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Progressive relaxation script with complete 7 phases, adapted for clients with 
                high anxiety and traditional Indonesian cultural background.
              </p>
              <div className="text-xs text-muted-foreground">
                Technique: Progressive Relaxation • Used: 2x • Rating: 9/10
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Guided Imagery - Bali Beach</h4>
                  <p className="text-sm text-muted-foreground">January 10, 2024 • 40 minutes</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded mb-1 block">
                    Completed
                  </span>
                  <div className="text-xs text-muted-foreground">AI Score: 87%</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Guided imagery script with Bali beach setting familiar to the client. 
                Integrates appropriate Hindu-Bali spiritual elements.
              </p>
              <div className="text-xs text-muted-foreground">
                Technique: Guided Imagery • Used: 1x • Rating: 8/10
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Confidence Building Script</h4>
                  <p className="text-sm text-muted-foreground">January 8, 2024 • 50 minutes</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded mb-1 block">
                    Draft
                  </span>
                  <div className="text-xs text-muted-foreground">AI Score: 84%</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Script for building self-confidence with references to leadership values 
                and courage in Javanese culture.
              </p>
              <div className="text-xs text-muted-foreground">
                Technique: Ego Strengthening • Not used yet • Estimated: 8/10
              </div>
            </div>

            <div className="border rounded-lg p-4 opacity-60">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Sleep Improvement Script</h4>
                  <p className="text-sm text-muted-foreground">January 5, 2024 • 35 minutes</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded mb-1 block">
                    Archived
                  </span>
                  <div className="text-xs text-muted-foreground">AI Score: 78%</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Initial script for addressing sleep disorders. Archived because therapy focus 
                changed to anxiety management.
              </p>
              <div className="text-xs text-muted-foreground">
                Technique: Sleep Induction • Not used • -
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}