# Product Requirements Document: Consultation Feature

## Introduction/Overview

The consultation feature enables therapists to manage their assigned clients through a comprehensive therapy workflow. This feature provides a structured approach to client management from initial assignment through consultation to therapy sessions, with proper status tracking and role-based access control.

**Problem Statement**: Currently, there's no systematic way for therapists to manage their assigned clients, track consultation progress, and maintain therapy session records. The existing client management system lacks workflow progression and therapist-specific views.

**Goal**: Create a comprehensive consultation and therapy management system that allows therapists to efficiently manage their client workflow from assignment to completion.

## Goals

1. **Implement Client Status Workflow**: Establish a clear status progression system (new → assigned → consultation → therapy → done) with proper tracking
2. **Create Therapist Dashboard**: Provide therapists with a dedicated view of their assigned clients
3. **Build Consultation Management**: Enable therapists to conduct and document consultations using structured forms
4. **Establish Therapy Session Tracking**: Create a foundation for therapy session management and progress tracking
5. **Ensure Role-Based Access**: Restrict therapy page access to therapists only
6. **Maintain Data Integrity**: Track all status transitions with audit trail

## User Stories

### Primary User Stories
1. **As a clinic admin**, I want to assign clients to therapists so that clients can receive appropriate care
2. **As a therapist**, I want to see a list of my assigned clients so that I can manage my workload effectively
3. **As a therapist**, I want to access a client's therapy page so that I can view their information and manage their care
4. **As a therapist**, I want to conduct consultations using structured forms so that I can document client assessments consistently
5. **As a therapist**, I want to track client progress through different statuses so that I can monitor their therapy journey
6. **As a therapist**, I want to view session history so that I can track client progress over time

### Secondary User Stories
7. **As a clinic admin**, I want to reassign clients between therapists when needed so that I can optimize resource allocation
8. **As a therapist**, I want to filter and search my client list so that I can quickly find specific clients
9. **As a therapist**, I want to edit consultation information before starting therapy so that I can update assessments as needed

## Functional Requirements

### 1. Client Status Management
1. The system must support five client statuses: `new`, `assigned`, `consultation`, `therapy`, `done`
2. The system must track all status transitions with timestamp and user information
3. The system must prevent status transitions from `done` back to `therapy`
4. The system must allow reassignment only when client status is `assigned` (consultation not started)
5. The system must require status change from `consultation` to `assigned` for reassignment

### 2. Therapist Dashboard
1. The system must provide therapists with a dedicated "My Clients" view
2. The system must display client name, status, last session date, and next session date
3. The system must include search functionality by client name
4. The system must include filters by status (assigned, consultation, therapy, done)
5. The system must show client count by status for quick overview
6. The system must provide quick actions to start consultation or view client details

### 3. Client Therapy Page
1. The system must provide a dedicated therapy page accessible only to therapists
2. The system must include three tabs: Client Information, Consultation Information, Therapy Sessions
3. The system must display complete client information in the first tab
4. The system must show consultation details and allow editing in the second tab
5. The system must display a mock session list in the third tab
6. The system must include action buttons for status transitions

### 4. Consultation Management
1. The system must provide three consultation form types: general, drug addiction, minor
2. The system must allow therapists to save and edit consultation information
3. The system must prevent consultation editing once status moves to `therapy`
4. The system must include structured fields for assessment documentation
5. The system must support consultation form validation

### 5. Status Transition Workflow
1. The system must enable "Start Consultation" action for `assigned` clients
2. The system must enable "Start Therapy" action for `consultation` clients
3. The system must enable "Mark Complete" action for `therapy` clients
4. The system must show appropriate action buttons based on current status
5. The system must confirm status transitions with user prompts

### 6. Reassignment Functionality
1. The system must allow clinic admins to reassign clients with status `assigned`
2. The system must require status change from `consultation` to `assigned` for reassignment
3. The system must include a reason field for reassignment tracking
4. The system must notify the new therapist of assignment
5. The system must preserve all client data during reassignment

## Non-Goals (Out of Scope)

1. **Session Management**: Detailed session creation, scheduling, and management (mock data only)
2. **Progress Tracking**: Advanced progress metrics and reporting
3. **Notification System**: Email/WhatsApp notifications (to be implemented later)
4. **Reporting**: Analytics and reporting features
5. **Data Migration**: Migration of existing client data to new status system
6. **Mobile App**: Mobile-specific features or responsive design beyond current standards
7. **Integration**: Integration with external systems or APIs
8. **Advanced Search**: Complex search filters beyond basic name and status

## Design Considerations

### UI/UX Requirements
1. **Status Badges**: Use color-coded badges for client status (green for active, blue for consultation, etc.)
2. **Tab Navigation**: Use existing tab component for therapy page navigation
3. **Action Buttons**: Use existing button components with appropriate variants
4. **Data Tables**: Use existing DataTable component for client lists
5. **Form Modals**: Use existing FormModal component for consultation forms
6. **Responsive Design**: Ensure mobile-friendly layout using existing responsive patterns

### Component Usage
1. **PortalPageWrapper**: For therapist dashboard and therapy pages
2. **DataTable**: For client lists with search and filtering
3. **FormModal**: For consultation forms and reassignment dialogs
4. **Badge**: For status indicators
5. **Card**: For information display sections
6. **Tabs**: For therapy page navigation

### Status Color Scheme
- **New**: Gray badge
- **Assigned**: Blue badge
- **Consultation**: Orange badge
- **Therapy**: Green badge
- **Done**: Purple badge

## Technical Considerations

### Frontend Architecture
1. **State Management**: Use existing Zustand stores for client and consultation data
2. **Type Safety**: Extend existing TypeScript interfaces for new consultation fields
3. **Form Validation**: Use Zod schemas for consultation form validation
4. **API Integration**: Extend existing API client functions for consultation endpoints
5. **Route Protection**: Implement role-based route protection for therapy pages

### Data Structure Extensions
1. **Client Status**: Add status field to existing Client interface
2. **Status History**: Create StatusTransition interface for audit trail
3. **Consultation Data**: Create Consultation interface with form-specific fields
4. **Therapist Assignment**: Extend client data with therapist assignment information

### File Structure
```
frontend/src/
├── components/
│   ├── consultation/
│   │   ├── ConsultationForm.tsx
│   │   ├── ConsultationFormModal.tsx
│   │   ├── TherapistDashboard.tsx
│   │   ├── ClientTherapyPage.tsx
│   │   └── index.ts
│   └── clients/
│       ├── ClientStatusBadge.tsx
│       └── ReassignClientModal.tsx
├── hooks/
│   ├── useConsultation.ts
│   ├── useClientStatus.ts
│   └── useTherapistClients.ts
├── store/
│   ├── consultation.ts
│   └── clientStatus.ts
├── types/
│   ├── consultation.ts
│   └── clientStatus.ts
└── lib/api/
    └── consultation.ts
```

## Success Metrics

1. **User Adoption**: 90% of therapists use the consultation feature within 2 weeks of launch
2. **Data Quality**: 95% of assigned clients have consultation information documented
3. **Workflow Efficiency**: Reduce time from client assignment to consultation start by 50%
4. **Status Tracking**: 100% of client status transitions are properly tracked
5. **User Satisfaction**: Achieve 4.5/5 rating in therapist feedback survey

## Open Questions

1. **Consultation Form Fields**: What specific fields should be included in each consultation form type (general, drug addiction, minor)?
2. **Status Transition Rules**: Are there any additional business rules for status transitions beyond the basic flow?
3. **Therapist Notifications**: What specific information should be included in therapist assignment notifications?
4. **Session Mock Data**: What session information should be displayed in the mock session list?
5. **Reassignment Workflow**: Should there be approval workflow for client reassignments?
6. **Data Retention**: How long should consultation and status history data be retained?

## Implementation Phases

### Phase 1: Core Status Management
- Implement client status system
- Create status transition tracking
- Add status badges to client list

### Phase 2: Therapist Dashboard
- Create therapist-specific client list
- Implement search and filtering
- Add quick action buttons

### Phase 3: Consultation Forms
- Build consultation form components
- Implement form validation
- Add consultation data management

### Phase 4: Therapy Page
- Create therapy page with tabs
- Implement consultation information display
- Add mock session list

### Phase 5: Reassignment & Polish
- Implement client reassignment
- Add status transition confirmations
- Final UI/UX improvements

## Dependencies

1. **Existing Components**: PortalPageWrapper, DataTable, FormModal, Badge, Card, Tabs
2. **State Management**: Existing Zustand stores for clients and therapists
3. **Type System**: Existing TypeScript interfaces and Zod schemas
4. **API Layer**: Existing API client structure and patterns
5. **Authentication**: Existing role-based authentication system

## Risk Assessment

### Low Risk
- UI component integration (using existing components)
- Type safety (extending existing patterns)
- State management (following existing patterns)

### Medium Risk
- Status transition logic complexity
- Form validation for multiple consultation types
- Role-based access control implementation

### High Risk
- Data consistency during status transitions
- Performance with large client lists
- User experience during reassignment process

## Acceptance Criteria

### Client Status Management
- [ ] Clients can be assigned to therapists
- [ ] Status transitions are properly tracked
- [ ] Status badges display correctly
- [ ] Reassignment works only for appropriate statuses

### Therapist Dashboard
- [ ] Therapists see only their assigned clients
- [ ] Search and filtering work correctly
- [ ] Quick actions are available based on status
- [ ] Status counts display accurately

### Consultation Management
- [ ] Three consultation form types are available
- [ ] Forms validate input correctly
- [ ] Consultation data can be saved and edited
- [ ] Editing is prevented after therapy starts

### Therapy Page
- [ ] Three tabs display correctly
- [ ] Client information shows completely
- [ ] Consultation information is editable
- [ ] Mock session list displays

### Access Control
- [ ] Only therapists can access therapy pages
- [ ] Role-based navigation works correctly
- [ ] Unauthorized access is prevented

### Data Integrity
- [ ] All status transitions are logged
- [ ] Client data is preserved during reassignment
- [ ] Form data is validated before saving
