# Indonesian Hypnotherapy AI System
## Project Context & Development Plan for Cursor AI

---

## 🎯 PROJECT OVERVIEW

### What We're Building
AI-powered web platform for Indonesian hypnotherapists to:
- Assess clients using digital forms
- Get technique recommendations 
- Generate complete printable session scripts
- Track client progress

### Core Value
Transform 2-hour manual planning into 15-minute AI-assisted workflow with culturally-appropriate Indonesian content.

### Tech Stack (Simple & Unified)
```
Frontend: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + Zod + Zustand + React Query
Backend: NestJS + TypeScript + MikroORM + Zod + PostgreSQL
Database: PostgreSQL + Redis (caching)
AI: OpenAI API + Custom TypeScript algorithms + Rule-based systems
File Storage: AWS S3 / Google Cloud Storage
Deployment: Docker + Vercel (Frontend) + Railway/AWS (Backend)
Code Quality: ESLint + Prettier (per project)
```

### Application Flow

**1. Therapist Registration & Setup**
```
Register → Login → Setup Profile → Add License Info → Dashboard
```

**2. Client Management Flow**
```
Add New Client → Fill Client Details → Save Profile → View Client Dashboard
```

**3. Assessment Flow**
```
Select Client → Choose Assessment Type (General/Addiction/Minor) → 
Complete Multi-Step Form → Submit Assessment → View Results
```

**4. AI Recommendation Flow**
```
Completed Assessment → AI Analysis → Mental Health Classification → 
Technique Scoring → Multi-Technique Selection → Cultural Adaptation → 
Display Recommendations with Rationale
```

**5. Script Generation Flow**
```
Accept Recommendations → Generate 7-Phase Script → Preview Script → 
Add Cultural Notes → Export PDF → Print for Session Use
```

**6. Session Management Flow**
```
Schedule Session → Use Printed Script → Complete Manual Checkboxes → 
Post-Session Assessment → Update Client Progress → Plan Next Session
```

**Our AI Strategy:**

1. **Rule-Based Intelligence** for technique scoring and recommendations
2. **OpenAI API** for complex text analysis and script generation
3. **Statistical algorithms** in TypeScript for progress tracking
4. **Cultural adaptation rules** based on Indonesian data

This provides 85%+ accuracy for our specific domain without ML complexity.

---

## 📋 CORE DATA MODELS

### Client Model
```typescript
interface Client {
  id: string;
  therapistId: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female';
  religion: string; // Islam, Kristen, Hindu, Buddha, Katolik
  province: string; // Indonesian provinces
  occupation?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: Date;
}
```

### Assessment Model (3 Types)
```typescript
interface Assessment {
  id: string;
  clientId: string;
  type: 'general' | 'addiction' | 'minor';
  data: GeneralAssessment | AddictionAssessment | MinorAssessment;
  completionTime: number; // minutes
  createdAt: Date;
}

// General Assessment (100+ fields)
interface GeneralAssessment {
  primaryReason: string;
  problemDuration: '<1_month' | '1-3_months' | '3-6_months' | '>6_months';
  dailyImpact: 'not_disturbing' | 'slightly_disturbing' | 'quite_disturbing' | 'very_disturbing';
  
  // Emotional scale (0-10 each, 20 emotions total)
  emotionalScales: {
    anxiety: number;
    depression: number;
    anger: number;
    fear: number;
    shame: number;
    loneliness: number;
    // ... 14 more emotions
  };
  
  traumaticExperiences: boolean;
  selfHarmThoughts: 'never' | 'not_serious' | 'frequent_need_help';
  sleepQuality: 'good_7-8h' | 'adequate_5-6h' | '<5h' | 'frequent_disturbances';
  familyRelationship: 'harmonious' | 'neutral' | 'light_conflict' | 'heavy_conflict';
  socialSupport: 'many' | 'some' | 'none';
  stressLevel: 'never' | 'rarely' | 'sometimes' | 'often' | 'very_often';
}
```

### Technique & Recommendation Models
```typescript
interface HypnotherapyTechnique {
  id: string;
  name: string;
  nameIndonesian: string;
  category: 'progressive_relaxation' | 'guided_imagery' | 'cognitive_behavioral' | 'pain_management' | 'ericksonian' | 'indonesian_traditional';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  indications: string[]; // ['anxiety', 'depression', 'trauma']
  contraindications: string[]; // ['psychosis', 'severe_depression']
  culturalScore: number; // 0-100, appropriateness for Indonesian culture
  religiousConsiderations?: {
    islam?: { highly_appropriate?: boolean; same_gender_only?: boolean };
    christian?: { appropriate_with_consent?: boolean };
  };
}

interface TechniqueRecommendation {
  primary: { technique: HypnotherapyTechnique; score: number; reasoning: string[] };
  supporting: { technique: HypnotherapyTechnique; score: number; reasoning: string[] };
  integration: { technique: HypnotherapyTechnique; score: number; reasoning: string[] };
  rationale: string; // AI explanation in Indonesian
  culturalNotes: string[]; // Cultural considerations
  confidence: number; // 0-1
}
```

### Session Script Model
```typescript
interface SessionScript {
  id: string;
  clientId: string;
  techniques: [HypnotherapyTechnique, HypnotherapyTechnique, HypnotherapyTechnique];
  
  phases: {
    preparation: PhaseScript;     // 5 minutes
    preinduction: PhaseScript;    // 8 minutes
    induction: PhaseScript;       // 15 minutes
    deepening: PhaseScript;       // 10 minutes
    therapeutic: PhaseScript;     // 20 minutes
    ego_strengthening: PhaseScript; // 8 minutes
    reorientation: PhaseScript;   // 8 minutes
  };
  
  totalDuration: number; // Total session time
  culturalNotes: string[];
  safetyProtocols: string[];
  createdAt: Date;
}

interface PhaseScript {
  title: string;
  duration: number;
  objectives: string[];
  script: string; // Complete script for therapist to read
  checklist: string[]; // Manual checkboxes for evaluation
  highlights: string; // Technique markers and instructions
  timingBoxes: { start: string; end: string }; // For manual time tracking
}
```

---

## 🤖 AI RECOMMENDATION ALGORITHM (TypeScript)

### Core Scoring Function
```typescript
function calculateTechniqueScore(
  technique: HypnotherapyTechnique,
  assessment: Assessment,
  client: Client,
  sessionContext: 'initial' | 'follow_up' | 'crisis' = 'initial'
): number {
  let score = 0;
  
  // Issue Compatibility (0-40 points)
  const primaryIssue = detectPrimaryIssue(assessment);
  if (technique.indications.includes(primaryIssue)) {
    score += 35;
  } else if (isRelatedIssue(primaryIssue, technique.indications)) {
    score += 25;
  } else {
    score += 10; // Base applicability
  }
  
  // Cultural Appropriateness (0-25 points)
  score += calculateCulturalScore(technique, client);
  
  // Client Factors (0-20 points)
  if (client.age >= 18 && client.age <= 65) score += 10;
  if (assessment.data.dailyImpact === 'very_disturbing' && technique.difficulty === 'beginner') score += 10;
  
  // Session Context (0-15 points)
  if (sessionContext === 'initial' && technique.difficulty === 'beginner') score += 15;
  if (sessionContext === 'crisis' && ['breathing_technique', 'progressive_relaxation'].includes(technique.id)) score += 15;
  
  return Math.max(0, Math.min(100, score));
}

function detectPrimaryIssue(assessment: Assessment): string {
  const { emotionalScales, dailyImpact, traumaticExperiences, selfHarmThoughts } = assessment.data;
  
  // High anxiety indicators
  if (emotionalScales.anxiety >= 7 || emotionalScales.fear >= 7) {
    return 'anxiety';
  }
  
  // Depression indicators  
  if (emotionalScales.depression >= 7 || emotionalScales.hopelessness >= 6) {
    return 'depression';
  }
  
  // Trauma indicators
  if (traumaticExperiences && (emotionalScales.fear >= 6 || emotionalScales.anxiety >= 6)) {
    return 'trauma';
  }
  
  // Mixed anxiety-depression
  if (emotionalScales.anxiety >= 5 && emotionalScales.depression >= 5) {
    return 'mixed_anxiety_depression';
  }
  
  // General stress
  if (dailyImpact === 'very_disturbing') {
    return 'stress_disorder';
  }
  
  return 'adjustment_disorder';
}

function calculateCulturalScore(technique: HypnotherapyTechnique, client: Client): number {
  let score = 15; // Base cultural score
  
  const religion = client.religion?.toLowerCase();
  
  // Religious considerations
  if (technique.religiousConsiderations?.[religion]?.highly_appropriate) {
    score += 10;
  }
  
  // Gender considerations for touch techniques
  if (technique.name === 'touch_technique' && religion === 'islam') {
    score -= 15; // Assume cross-gender for safety
  }
  
  // Indonesian traditional techniques bonus
  if (technique.category === 'indonesian_traditional') {
    score += 5;
  }
  
  return Math.max(0, score);
}
```

### Multi-Technique Selection
```typescript
function selectOptimalCombination(
  techniques: HypnotherapyTechnique[],
  assessment: Assessment,
  client: Client
): TechniqueRecommendation {
  // Calculate scores for all techniques
  const scores = techniques.map(technique => ({
    technique,
    score: calculateTechniqueScore(technique, assessment, client),
    reasoning: generateReasoning(technique, assessment, client)
  }));
  
  // Sort by score
  const sortedScores = scores.sort((a, b) => b.score - a.score);
  
  // Apply combination bonuses
  const optimizedCombination = optimizeCombination(sortedScores.slice(0, 6));
  
  return {
    primary: optimizedCombination[0],
    supporting: optimizedCombination[1], 
    integration: optimizedCombination[2],
    rationale: generateRationale(optimizedCombination, client, assessment),
    culturalNotes: generateCulturalNotes(client, optimizedCombination),
    confidence: calculateConfidence(optimizedCombination)
  };
}

// Technique synergy bonuses
const SYNERGY_BONUSES = {
  'progressive_relaxation+guided_imagery+breathing': 15,
  'ericksonian_metaphor+body_technique+inner_adviser': 15,
  'hypno_cbt+reality_verification+timeline_therapy': 8
};
```

---

## 📝 SCRIPT GENERATION (OpenAI + Templates)

### Script Generation Service
```typescript
class ScriptGenerationService {
  async generateSessionScript(
    techniques: HypnotherapyTechnique[],
    client: Client,
    sessionNumber: number = 1
  ): Promise<SessionScript> {
    const script: SessionScript = {
      id: generateId(),
      clientId: client.id,
      techniques: techniques as [HypnotherapyTechnique, HypnotherapyTechnique, HypnotherapyTechnique],
      phases: {} as any,
      totalDuration: 0,
      culturalNotes: generateCulturalNotes(client, techniques),
      safetyProtocols: SAFETY_PROTOCOLS,
      createdAt: new Date()
    };
    
    // Generate each phase
    for (const [phaseName, phaseConfig] of Object.entries(PHASE_CONFIGS)) {
      script.phases[phaseName] = await this.generatePhaseScript(
        phaseName,
        phaseConfig,
        techniques,
        client,
        sessionNumber
      );
      script.totalDuration += script.phases[phaseName].duration;
    }
    
    return script;
  }
  
  private async generatePhaseScript(
    phaseName: string,
    phaseConfig: any,
    techniques: HypnotherapyTechnique[],
    client: Client,
    sessionNumber: number
  ): Promise<PhaseScript> {
    const clientTitle = client.gender === 'male' ? 'Bapak' : 'Ibu';
    const greeting = this.getCulturalGreeting(client);
    
    // Use OpenAI for script generation
    const prompt = `Generate ${phaseName} phase script for Indonesian hypnotherapy session.

Client: ${clientTitle} ${client.fullName}, ${client.age} years old, ${client.religion}
Techniques: ${techniques.map(t => t.nameIndonesian).join(', ')}
Session: ${sessionNumber}

Requirements:
- Use formal Indonesian language
- Include cultural considerations for ${client.religion}
- Duration: ${phaseConfig.duration} minutes
- Objectives: ${phaseConfig.objectives.join(', ')}

Format: Professional script that therapist can read directly.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const script = response.choices[0].message.content || '';

    return {
      title: phaseConfig.title,
      duration: phaseConfig.duration,
      objectives: phaseConfig.objectives,
      script: this.addTechniqueHighlights(script, techniques),
      checklist: phaseConfig.checklist,
      highlights: this.generateHighlights(techniques),
      timingBoxes: { start: '____:____', end: '____:____' }
    };
  }
  
  private addTechniqueHighlights(script: string, techniques: HypnotherapyTechnique[]): string {
    // Add color-coded highlighting for different techniques
    let highlightedScript = script;
    
    techniques.forEach((technique, index) => {
      const colors = ['🟦', '🟨', '🟩']; // Blue, Yellow, Green
      const marker = colors[index];
      
      // Add technique markers (simplified)
      if (technique.category === 'progressive_relaxation') {
        highlightedScript = highlightedScript.replace(
          /(relaksasi|otot|kencangkan|lepaskan)/gi,
          `${marker} **$1**`
        );
      }
    });
    
    return highlightedScript;
  }
}
```

---

## 🗄️ DATABASE SCHEMA (PostgreSQL)

### Core Tables
```sql
-- Users (Therapists)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50),
    province VARCHAR(50), -- Indonesian province
    city VARCHAR(100),
    clinic_name VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_code VARCHAR(20) UNIQUE NOT NULL, -- Auto-generated: CLT001, CLT002
    full_name VARCHAR(200) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    birth_date DATE,
    age INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM AGE(birth_date))) STORED,
    religion VARCHAR(50), -- Islam, Kristen, Hindu, Buddha, Katolik
    province VARCHAR(50), -- Indonesian provinces
    occupation VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments (Polymorphic for 3 types)
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES users(id),
    assessment_type VARCHAR(20) NOT NULL CHECK (assessment_type IN ('general', 'addiction', 'minor')),
    data JSONB NOT NULL, -- Store all form responses
    completion_time_minutes INTEGER,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Analysis Results
CREATE TABLE ai_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    primary_mental_health_issue VARCHAR(200),
    confidence DECIMAL(3,2), -- 0.00 to 1.00
    severity_level VARCHAR(20) CHECK (severity_level IN ('mild', 'moderate', 'severe', 'critical')),
    secondary_issues JSONB, -- Array of secondary issues
    risk_factors JSONB, -- Structured risk data
    recommended_techniques TEXT[],
    ai_model_version VARCHAR(50) DEFAULT '1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session Scripts
CREATE TABLE session_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    session_number INTEGER DEFAULT 1,
    primary_technique_id VARCHAR(50),
    supporting_technique_id VARCHAR(50),
    integration_technique_id VARCHAR(50),
    phases JSONB NOT NULL, -- All 7 phase scripts
    total_duration INTEGER, -- Total session minutes
    cultural_notes TEXT[],
    safety_protocols TEXT[],
    therapist_approved BOOLEAN DEFAULT FALSE,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Techniques Library (Seeded Data)
CREATE TABLE hypnotherapy_techniques (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_indonesian VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    indications TEXT[], -- JSON array of conditions
    contraindications TEXT[], -- JSON array of conditions to avoid
    cultural_score INTEGER DEFAULT 95 CHECK (cultural_score >= 0 AND cultural_score <= 100),
    religious_considerations JSONB, -- Cultural adaptation rules
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🎨 FRONTEND STRUCTURE (Next.js 14)

### App Router Structure
```
src/app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── dashboard/page.tsx
│   ├── clients/
│   │   ├── page.tsx              # Client list
│   │   ├── new/page.tsx          # Add new client
│   │   └── [id]/
│   │       ├── page.tsx          # Client profile
│   │       ├── assessment/page.tsx # New assessment
│   │       └── sessions/page.tsx  # Session history
│   ├── assessments/
│   │   ├── [id]/page.tsx         # Assessment details
│   │   └── [id]/recommendations/page.tsx # AI recommendations
│   └── scripts/
│       ├── [id]/page.tsx         # Script preview
│       └── [id]/pdf/route.ts     # PDF generation
├── api/
│   ├── auth/route.ts
│   ├── clients/route.ts
│   ├── assessments/route.ts
│   └── ai/recommendations/route.ts
└── globals.css
```

### Key Components
```
src/components/
├── ui/                     # shadcn/ui components
│   ├── button.tsx
│   ├── form.tsx
│   ├── input.tsx
│   └── card.tsx
├── forms/
│   ├── ClientForm.tsx
│   ├── GeneralAssessmentForm.tsx
│   ├── AddictionAssessmentForm.tsx
│   └── MinorAssessmentForm.tsx
├── ai/
│   ├── RecommendationEngine.tsx
│   ├── TechniqueCard.tsx
│   └── ConfidenceIndicator.tsx
├── script/
│   ├── ScriptGenerator.tsx
│   ├── PhasePreview.tsx
│   └── PDFExporter.tsx
└── layout/
    ├── Header.tsx
    ├── Sidebar.tsx
    └── DashboardLayout.tsx
```

---

## 🔧 BACKEND STRUCTURE (NestJS)

### Module Structure
```
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── guards/jwt-auth.guard.ts
│   ├── clients/
│   │   ├── clients.module.ts
│   │   ├── clients.controller.ts
│   │   ├── clients.service.ts
│   │   └── dto/create-client.dto.ts
│   ├── assessments/
│   │   ├── assessments.module.ts
│   │   ├── assessments.controller.ts
│   │   ├── assessments.service.ts
│   │   └── dto/assessment.dto.ts
│   ├── ai/
│   │   ├── ai.module.ts
│   │   ├── ai.controller.ts
│   │   ├── mental-health-classifier.service.ts
│   │   ├── technique-recommendation.service.ts
│   │   └── script-generation.service.ts
│   └── scripts/
│       ├── scripts.module.ts
│       ├── scripts.controller.ts
│       ├── scripts.service.ts
│       └── pdf-generation.service.ts
├── database/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── client.entity.ts
│   │   ├── assessment.entity.ts
│   │   └── technique.entity.ts
│   └── migrations/
└── common/
    ├── decorators/
    ├── guards/
    ├── pipes/
    └── filters/
```

---

## 🗺️ IMPLEMENTATION ROADMAP

### Development Order (Following UI Flow)

**Phase 1: Foundation & Authentication (Week 1-2)**
```
1. Project Setup → 2. Authentication → 3. Basic Dashboard → 4. User Profile
```

**Phase 2: Client Management (Week 3-4)**
```
5. Client List → 6. Add Client Form → 7. Client Profile → 8. Client Dashboard
```

**Phase 3: Assessment System (Week 5-8)**
```
9. Assessment Type Selection → 10. General Assessment Form → 
11. Addiction/Minor Forms → 12. Assessment Results
```

**Phase 4: AI Recommendations (Week 9-12)**
```
13. AI Analysis Engine → 14. Technique Recommendations → 
15. Recommendation Display → 16. Cultural Adaptations
```

**Phase 5: Script Generation (Week 13-16)**
```
17. Script Generator → 18. 7-Phase Script Display → 
19. PDF Export → 20. Script Management
```

### Implementation Dependencies

**Must Build First:**
- Authentication system (all features depend on this)
- User and Client entities (data foundation)
- Basic UI layout and navigation

**Can Build in Parallel:**
- Assessment forms (independent of each other)
- Static technique library (while building AI logic)
- Cultural adaptation rules (while building recommendation engine)

**Build Last:**
- PDF generation (depends on script structure)
- Advanced analytics (depends on session data)
- Progress tracking (depends on multiple assessments)

### Key Implementation Notes

**State Management Strategy:**
- Use Zustand for global state (auth, current client)
- Use React Query for server state (assessments, recommendations)
- Use local state for form inputs and UI interactions

**Form Handling Pattern:**
- Multi-step forms with progress tracking
- Zod validation on each step
- Auto-save draft capabilities
- Error handling with Indonesian error messages

**AI Integration Points:**
- Assessment submission triggers AI analysis
- Recommendation generation on-demand
- Script generation with cultural adaptations
- Real-time confidence scoring

**Cultural Adaptation Integration:**
- Religion-based form adjustments
- Language formality based on client age/status
- Regional considerations in recommendations
- Gender-appropriate technique selection

### First Steps (Ready for Cursor AI)

**Step 1: Project Setup**
- Initialize Next.js 14 with TypeScript
- Setup Tailwind CSS and shadcn/ui
- Configure ESLint and Prettier
- Setup basic folder structure

**Step 2: Authentication Foundation**
- Create login/register pages
- Implement JWT authentication
- Setup protected routes
- Create basic user dashboard

**Step 3: Database Foundation**
- Setup PostgreSQL with Docker
- Create user and client entities
- Implement basic CRUD operations
- Setup database migrations

**Ready to start with detailed implementation guides for each phase as needed.**

---

This context provides the master reference for building the Indonesian Hypnotherapy AI system, with clear implementation order and dependencies for step-by-step development with Cursor AI.