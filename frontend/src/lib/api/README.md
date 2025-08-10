# Mock Session Data Documentation

This directory contains comprehensive mock data for client session history in the Terapintar application.

## Files

- `mockData.ts` - Main mock data file with session history, therapist data, and utility functions
- `mockData.test.ts` - Test suite for validating mock data functionality
- `client.ts` - API client that uses the mock data

## Features

### 1. Comprehensive Session Data

The mock data includes realistic session history for multiple clients with:

- **Multiple therapy phases**: intake, induction, therapy, post
- **Various session statuses**: completed, scheduled, cancelled
- **Assessment tools**: GAD-7, PHQ-9, ISI, LSAS, PCL-5, BDI-II, STAI
- **Realistic session notes**: Detailed notes in Bahasa Indonesia
- **Duration tracking**: Session lengths from 45-90 minutes
- **Therapist assignments**: Multiple therapists with different specializations

### 2. Available Clients

The mock data includes sessions for the following clients:

- **CLT001**: Anxiety disorder treatment (5 sessions)
- **CLT002**: Depression treatment (4 sessions, including 1 cancelled)
- **CLT003**: Insomnia treatment (3 sessions)
- **CLT004**: Social phobia treatment (4 sessions)
- **CLT005**: PTSD treatment (3 sessions)
- **CLT006**: Work stress treatment (2 sessions)
- **CLT007**: Self-esteem issues (3 sessions)

### 3. Assessment Tools

| Tool | Full Name | Description |
|------|-----------|-------------|
| GAD-7 | Generalized Anxiety Disorder Assessment | Measures anxiety symptoms |
| PHQ-9 | Patient Health Questionnaire for Depression | Measures depression symptoms |
| ISI | Insomnia Severity Index | Measures sleep quality |
| LSAS | Liebowitz Social Anxiety Scale | Measures social anxiety |
| PCL-5 | PTSD Checklist for DSM-5 | Measures PTSD symptoms |
| BDI-II | Beck Depression Inventory-II | Comprehensive depression assessment |
| STAI | State-Trait Anxiety Inventory | Measures anxiety state and trait |

## Usage

### Basic Usage

```typescript
import { getClientSessions, getSessionStats } from './mockData';

// Get all sessions for a client
const sessions = getClientSessions('CLT001');

// Get session statistics
const stats = getSessionStats('CLT001');
console.log(`Total sessions: ${stats.total}`);
console.log(`Completed: ${stats.completed}`);
console.log(`Total duration: ${stats.totalDuration} minutes`);
```

### API Integration

The mock data is integrated with the `ClientAPI.getClientSessions()` method:

```typescript
import { ClientAPI } from './client';

// This will return paginated session data
const response = await ClientAPI.getClientSessions('CLT001', 1, 10);
if (response.success && response.data) {
  const { items, total, page, pageSize } = response.data;
  console.log(`Showing ${items.length} of ${total} sessions`);
}
```

### Generating Additional Mock Data

```typescript
import { generateMockSessions, addMockSessionsToClient } from './mockData';

// Generate new sessions for testing
const newSessions = generateMockSessions(
  'NEW001',
  'therapist-001',
  'Dr. Ahmad Pratama, M.Psi',
  5,
  new Date('2024-02-01')
);

// Add sessions to existing client
addMockSessionsToClient('CLT001', 3);
```

### Utility Functions

```typescript
import { 
  getTherapistName, 
  getAssessmentToolDescription 
} from './mockData';

// Get therapist name
const therapistName = getTherapistName('therapist-001');
// Returns: "Dr. Ahmad Pratama, M.Psi"

// Get assessment tool description
const description = getAssessmentToolDescription('GAD-7');
// Returns: "Generalized Anxiety Disorder Assessment"
```

## Session Structure

Each session object contains:

```typescript
interface SessionSummary {
  id: string;                    // Unique session ID
  clientId: string;              // Client identifier
  therapistId: string;           // Therapist identifier
  therapistName?: string;        // Therapist full name
  date: string;                  // ISO date string
  phase: SessionPhase;           // 'intake' | 'induction' | 'therapy' | 'post'
  status: SessionStatus;         // 'completed' | 'scheduled' | 'cancelled'
  durationMinutes?: number;      // Session duration in minutes
  notes?: string;                // Session notes in Bahasa Indonesia
  assessment?: AssessmentSummary; // Optional assessment data
}
```

## Assessment Data

Assessment objects include:

```typescript
interface AssessmentSummary {
  tool: string;        // Assessment tool name (e.g., 'GAD-7')
  preScore?: number;   // Pre-treatment score
  postScore?: number;  // Post-treatment score
  scoreUnit?: string;  // Score unit (e.g., 'points')
  notes?: string;      // Assessment notes
}
```

## Testing

Run the test suite to validate mock data:

```bash
npm test mockData.test.ts
```

The tests verify:
- Data structure integrity
- Function return values
- Session generation logic
- Statistics calculations
- Therapist and assessment tool mappings

## Adding New Mock Data

### Adding a New Client

1. Add client sessions to `mockSessionData` in `mockData.ts`:

```typescript
CLT008: [
  {
    id: 'sess-801',
    clientId: 'CLT008',
    therapistId: 'therapist-003',
    therapistName: mockTherapists['therapist-003'],
    date: '2024-02-01T10:00:00Z',
    phase: 'intake',
    status: 'completed',
    durationMinutes: 60,
    notes: 'Konsultasi awal untuk masalah...',
    assessment: { 
      tool: 'GAD-7', 
      preScore: 16, 
      scoreUnit: 'points', 
      notes: 'Skor tinggi menunjukkan kecemasan berat' 
    },
  },
  // ... more sessions
],
```

### Adding a New Therapist

1. Add therapist to `mockTherapists`:

```typescript
'therapist-006': 'Dr. New Therapist, M.Psi',
```

### Adding a New Assessment Tool

1. Add tool to `assessmentTools`:

```typescript
'NEW-TOOL': 'New Assessment Tool Description',
```

## Best Practices

1. **Use realistic data**: Ensure session notes, scores, and durations are clinically realistic
2. **Maintain consistency**: Use consistent therapist names and client IDs across the application
3. **Include assessments**: Add assessment data for intake and post sessions to show progress
4. **Use Bahasa Indonesia**: All notes and descriptions should be in Indonesian
5. **Test thoroughly**: Run tests after adding new mock data to ensure integrity

## Future Enhancements

- Add more diverse therapy modalities
- Include session outcome ratings
- Add client progress tracking
- Implement session templates for different conditions
- Add therapist specialization data
