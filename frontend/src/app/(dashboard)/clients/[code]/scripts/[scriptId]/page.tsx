import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

interface ScriptDetailPageProps {
  params: {
    code: string;
    scriptId: string;
  };
}

export function generateMetadata({ params }: ScriptDetailPageProps): Metadata {
  return {
    title: `Script ${params.scriptId.toUpperCase()} - Client ${params.code.toUpperCase()} - Smart Therapy`,
    description: `Details of hypnotherapy script ${params.scriptId.toUpperCase()} for client ${params.code.toUpperCase()}`,
  };
}

export default function ScriptDetailPage({ params }: ScriptDetailPageProps) {
  return (
    <div className="space-content">
      <MainHeader
        title={`Script ${params.scriptId.toUpperCase()}`}
        description={`Script details for client ${params.code.toUpperCase()}`}
      />

      <div className="responsive-form-grid gap-responsive">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Script Information
          </h3>
          <div className="space-form text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground">Script ID:</span>
                <div className="font-mono font-semibold">{params.scriptId.toUpperCase()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Client:</span>
                <div className="font-mono font-semibold">{params.code.toUpperCase()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Primary Technique:</span>
                <div>Progressive Relaxation</div>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <div>45 minutes</div>
              </div>
              <div>
                <span className="text-muted-foreground">AI Score:</span>
                <div className="text-primary font-semibold">92%</div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Cultural Adaptation
          </h3>
          <div className="space-form text-sm">
            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground block mb-1">Religious Context:</span>
                <div className="bg-muted/20 rounded p-2">
                  Islam - Conservative. Uses references to tranquility and peace 
                  that align with spiritual values.
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Imagery Setting:</span>
                <div className="bg-muted/20 rounded p-2">
                  Parangtritis Beach with sunset atmosphere, gentle breeze, 
                  and soothing wave sounds.
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Language:</span>
                <div className="bg-muted/20 rounded p-2">
                  Formal Indonesian with subtle Javanese language touches to 
                  provide familiar and comfortable nuances.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          7-Phase Hypnotherapy Structure
        </h3>
        <div className="space-form">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Preparation Phase</h4>
                  <p className="text-sm text-muted-foreground">Duration: 5 minutes</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Building rapport and creating a safe environment. Explaining the hypnotherapy 
                process with familiar cultural references.
              </p>
              <div className="text-xs text-muted-foreground">
                • Introduction and building trust<br />
                • Process explanation according to cultural context<br />
                • Confirming comfort and consent
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Induction Phase</h4>
                  <p className="text-sm text-muted-foreground">Duration: 8 minutes</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Guiding the client to a relaxed state using breathing techniques and 
                progressive muscle relaxation adapted to cultural preferences.
              </p>
              <div className="text-xs text-muted-foreground">
                • Breathing technique with counting in Indonesian<br />
                • Progressive muscle relaxation from toes to head<br />
                • Use of Indonesian nature metaphors for relaxation
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Deepening Phase</h4>
                  <p className="text-sm text-muted-foreground">Duration: 7 minutes</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Deepening the hypnotic state using countdown techniques and imagery 
                of descending stairs to a peaceful and calm beach.
              </p>
              <div className="text-xs text-muted-foreground">
                • Countdown from 10 to 1 with each number deepening relaxation<br />
                • Imagery of descending stairs to Parangtritis Beach<br />
                • Strengthening state with Indonesian nature sounds
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Suggestion Phase</h4>
                  <p className="text-sm text-muted-foreground">Duration: 15 minutes</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Providing therapeutic suggestions to overcome anxiety using 
                inner strength and spiritual support.
              </p>
              <div className="text-xs text-muted-foreground">
                • Suggestions for inner peace according to spiritual values<br />
                • Strengthening ability to overcome life challenges<br />
                • Installing anchor state for future stressful situations
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">5</span>
                </div>
                <div>
                  <h4 className="font-semibold">Ego Strengthening Phase</h4>
                  <p className="text-sm text-muted-foreground">Duration: 5 minutes</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Strengthening self-confidence and self-esteem with references 
                to local wisdom values and Indonesian character strength.
              </p>
              <div className="text-xs text-muted-foreground">
                • Strengthening with gotong royong and togetherness values<br />
                • Positive affirmations in Indonesian cultural context<br />
                • Building resilience with ancestral wisdom
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">6</span>
                </div>
                <div>
                  <h4 className="font-semibold">Future Pacing Phase</h4>
                  <p className="text-sm text-muted-foreground">Duration: 3 minutes</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Guiding the client to imagine applying positive changes in 
                daily life within the Indonesian environment.
              </p>
              <div className="text-xs text-muted-foreground">
                • Visualization of future stressful situations with new responses<br />
                • Application of coping techniques in Indonesian social context<br />
                • Reinforcement of positive behavioral changes
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">7</span>
                </div>
                <div>
                  <h4 className="font-semibold">Emergence Phase</h4>
                  <p className="text-sm text-muted-foreground">Duration: 2 minutes</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Guiding the client back to normal state with fresh, energetic, 
                and confident feelings.
              </p>
              <div className="text-xs text-muted-foreground">
                • Counting up from 1 to 5 for emergence<br />
                • Gradual reactivation of body systems<br />
                • Closing with prayer or affirmations according to beliefs
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Usage Data
        </h3>
        <div className="responsive-form-grid gap-responsive">
          <div>
            <h4 className="font-semibold mb-2">Usage History</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-muted/20 rounded">
                <span>Jan 15, 2024, 14:00</span>
                <span className="text-primary font-medium">Rating: 9/10</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/20 rounded">
                <span>Jan 12, 2024, 15:30</span>
                <span className="text-secondary font-medium">Rating: 8/10</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Effectiveness</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Average Rating:</span>
                <span className="font-semibold text-primary">8.5/10</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-semibold text-secondary">92%</span>
              </div>
              <div className="flex justify-between">
                <span>Client Feedback:</span>
                <span className="font-semibold text-primary">Very Positive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}