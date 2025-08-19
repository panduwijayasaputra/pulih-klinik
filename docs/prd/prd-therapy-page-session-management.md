# PRD: Therapy Page Session Management

## Introduction/Overview

The Therapy Page Session Management feature enables therapists to efficiently manage their client's therapy sessions through a comprehensive interface that includes consultation summaries, session creation, scheduling, and tracking. This feature streamlines the therapy workflow by providing a centralized location for all session-related activities, from initial consultation review to ongoing session management.

**Problem Statement:** Therapists currently lack a unified interface to manage client therapy sessions, making it difficult to track consultation data, schedule sessions, and monitor session progress effectively.

**Goal:** Create a comprehensive therapy management interface that enables therapists to view consultation summaries, create and schedule sessions, and track session progress through different status states.

## Goals

1. **Enable consultation-based therapy access:** Only allow therapy tab access when consultation data exists for the client
2. **Provide AI-powered consultation insights:** Display consultation summaries with predicted mental health issues and confidence percentages
3. **Streamline session creation:** Allow therapists to create new sessions with auto-numbering and essential details
4. **Implement comprehensive session scheduling:** Provide calendar-based scheduling with conflict prevention
5. **Enable session status management:** Support session lifecycle from creation to completion
6. **Prevent scheduling conflicts:** Ensure no overlapping sessions can be scheduled
7. **Maintain session continuity:** Prevent new session starts when previous sessions are incomplete

## User Stories

1. **As a therapist, I want to view my client's consultation summary with AI predictions so that I can understand their mental health assessment before starting therapy sessions.**

2. **As a therapist, I want to create new therapy sessions with auto-generated session numbers so that I can efficiently organize my client's therapy journey.**

3. **As a therapist, I want to schedule sessions using a calendar interface so that I can easily manage my availability and avoid scheduling conflicts.**

4. **As a therapist, I want to see all my client's sessions in a list view so that I can track their progress and manage multiple sessions effectively.**

5. **As a therapist, I want to edit session details before scheduling so that I can update information as needed.**

6. **As a therapist, I want to reschedule sessions when needed so that I can accommodate changes in availability.**

7. **As a therapist, I want to start sessions only when previous sessions are completed so that I can maintain proper session continuity.**

8. **As a therapist, I want to continue ongoing sessions so that I can resume therapy work seamlessly.**

## Functional Requirements

### 1. Therapy Page Access Control
- The system must disable the therapy tab when no consultation data exists for the client
- The system must enable the therapy tab when consultation data exists for the client
- The system must check for consultation record existence to determine tab availability

### 2. Consultation Summary Display
- The system must display consultation summary data on the therapy tab
- The system must show AI-generated predicted mental health issues with confidence percentages
- The system must support multiple mental health predictions per consultation
- The system must display predictions in a clear, readable format

### 3. Session Creation
- The system must provide an "Add Session" button on the therapy tab
- The system must open a modal form for session creation
- The system must auto-generate session numbers (1, 2, 3, 4...)
- The system must require session title and description fields
- The system must set session status to "new" upon creation
- The system must validate required fields before saving

### 4. Session List Display
- The system must display all sessions for the client in a list format
- The system must show session number, title, description, and status
- The system must display different action buttons based on session status

### 5. Session Status Management
- The system must support the following session statuses:
  - **new**: Initial session state after creation
  - **scheduled**: Session with assigned date/time
  - **started**: Session currently in progress
  - **completed**: Session with all assessments filled (pre-session, observation, after-session)

### 6. Session Actions by Status

#### New Sessions
- The system must show "Schedule" and "Edit" buttons for new sessions
- The system must open calendar modal when "Schedule" is clicked
- The system must open session edit modal when "Edit" is clicked
- The system must change status to "scheduled" after successful scheduling

#### Scheduled Sessions
- The system must show "Re-schedule" and "Start Session" buttons
- The system must open calendar modal for re-scheduling
- The system must show confirmation modal before starting session
- The system must change status to "started" after confirmation
- The system must redirect to session page after starting

#### Started Sessions
- The system must show "Continue" button
- The system must redirect to session page when "Continue" is clicked

### 7. Session Scheduling
- The system must provide a calendar modal for date/time selection
- The system must prevent scheduling on past dates and times
- The system must show existing scheduled sessions on the calendar
- The system must prevent scheduling conflicts with existing sessions
- The system must validate date/time selection before saving

### 8. Session Continuity Rules
- The system must prevent starting new sessions when previous sessions are not completed
- The system must only allow scheduling when previous sessions are incomplete
- The system must check session completion status before allowing new session starts

### 9. Session Page Integration
- The system must redirect to `/portal/therapist/sessions/[sessionId]` when starting/continuing sessions
- The system must create a basic session page with PageWrapper component
- The system must include back button navigation to therapy page

## Non-Goals (Out of Scope)

1. **Session content management:** The actual therapy session interface and assessment forms are out of scope for this PRD
2. **Client communication:** Direct messaging or notification features are not included
3. **Payment processing:** Session billing and payment features are not included
4. **Advanced analytics:** Detailed session analytics and reporting are not included
5. **Multi-therapist scheduling:** Coordination between multiple therapists is not included
6. **Recurring sessions:** Automatic recurring session creation is not included

## Design Considerations

### UI/UX Requirements
- Follow existing design patterns from the portal interface
- Use shadcn/ui components for consistency
- Implement responsive design for mobile and desktop
- Use clear visual hierarchy for session status indicators
- Provide intuitive navigation between therapy page and session page

### Component Structure
- Use existing `PageWrapper` component for session page layout
- Implement modal components for session creation, editing, and scheduling
- Use calendar component for date/time selection
- Create status-based action button components
- Implement confirmation dialogs for critical actions

### Data Display
- Show consultation predictions in card format with percentage indicators
- Display session list in table or card format with status badges
- Use color coding for different session statuses
- Implement clear action button labeling

## Technical Considerations

### Integration Points
- Integrate with existing consultation data API
- Connect with session management API endpoints
- Use existing authentication and authorization systems
- Leverage current routing and navigation patterns

### Data Requirements
- Consultation data with AI predictions and confidence scores
- Session data including number, title, description, status, and scheduled date/time
- Client information for context
- Therapist availability and existing session data

### State Management
- Use existing state management patterns (Zustand/Redux)
- Implement optimistic updates for better UX
- Handle loading and error states appropriately
- Maintain session status consistency

### Validation Rules
- Prevent past date/time scheduling
- Validate session title and description requirements
- Ensure session continuity rules are enforced
- Prevent scheduling conflicts

## Success Metrics

1. **User Adoption:** 90% of therapists use the therapy page within 30 days of launch
2. **Session Management Efficiency:** Reduce time to schedule sessions by 50%
3. **Error Reduction:** Decrease scheduling conflicts by 95%
4. **User Satisfaction:** Achieve 4.5/5 rating on therapy page usability
5. **Session Continuity:** Maintain 100% compliance with session completion rules

## Open Questions

1. **Session numbering scope:** Should session numbers be client-specific or therapist-specific?
2. **Calendar integration:** Should the calendar integrate with external calendar systems?
3. **Session duration:** Should sessions have a default duration or be flexible?
4. **Notification system:** Should therapists receive reminders for scheduled sessions?
5. **Session templates:** Should there be predefined session templates for common therapy types?
6. **Bulk operations:** Should therapists be able to schedule multiple sessions at once?
7. **Session notes:** Should there be a notes field for session planning?
8. **Export functionality:** Should session data be exportable for reporting purposes?

## Implementation Priority

### Phase 1 (MVP)
- Basic therapy page with consultation summary
- Session creation and list display
- Simple scheduling functionality
- Basic session status management

### Phase 2 (Enhanced)
- Advanced calendar integration
- Session continuity rules
- Improved UI/UX refinements
- Session page integration

### Phase 3 (Advanced)
- Advanced scheduling features
- Session templates
- Export functionality
- Performance optimizations
