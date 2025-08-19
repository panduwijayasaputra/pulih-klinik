# Task List: Therapy Page Session Management (Frontend)

## Relevant Files

- `frontend/src/app/portal/therapist/therapy/[clientId]/page.tsx` - Main therapy page component for managing client therapy sessions
- `frontend/src/app/portal/therapist/sessions/[sessionId]/page.tsx` - Session page component for individual therapy sessions
- `frontend/src/components/therapy/TherapyPage.tsx` - Main therapy page component with tabs and session management
- `frontend/src/components/therapy/ConsultationSummary.tsx` - Component to display consultation data with AI predictions
- `frontend/src/components/therapy/SessionList.tsx` - Component to display and manage session list
- `frontend/src/components/therapy/SessionFormModal.tsx` - Modal for creating and editing sessions
- `frontend/src/components/therapy/SessionScheduleModal.tsx` - Modal for scheduling sessions with calendar
- `frontend/src/components/therapy/SessionActions.tsx` - Component for session action buttons based on status
- `frontend/src/components/therapy/ConfirmationModal.tsx` - Modal for session start confirmation
- `frontend/src/hooks/useTherapy.ts` - Custom hook for therapy page data management
- `frontend/src/hooks/useSession.ts` - Custom hook for session management
- `frontend/src/types/therapy.ts` - TypeScript types for therapy and session data
- `frontend/src/schemas/therapySchema.ts` - Zod schemas for therapy and session validation
- `frontend/src/lib/api/therapy.ts` - API client functions for therapy and session operations
- `frontend/src/store/therapy.ts` - State management for therapy page data

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `TherapyPage.tsx` and `TherapyPage.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Setup Therapy Page Structure and Routing
  - [ ] 1.1 Create therapy page route and basic layout
    - Create the therapy page route at `/portal/therapist/therapy/[clientId]`
    - Implement basic page structure using PageWrapper component
    - Add back button navigation to therapist client page
    - Set up proper TypeScript types for clientId parameter
  - [ ] 1.2 Create session page route and basic layout
    - Create the session page route at `/portal/therapist/sessions/[sessionId]`
    - Implement basic page structure using PageWrapper component
    - Add back button navigation to therapy page
    - Set up proper TypeScript types for sessionId parameter
  - [ ] 1.3 Set up tab navigation structure
    - Create tab component for Summary, Consultation, and Therapy tabs
    - Implement tab switching functionality
    - Add conditional rendering for therapy tab based on consultation data

- [ ] 2.0 Implement Consultation Summary Display
  - [ ] 2.1 Create consultation summary component
    - Build component to display consultation data
    - Show AI-generated mental health predictions with confidence percentages
    - Implement card-based layout for predictions
    - Add proper loading and error states
  - [ ] 2.2 Create consultation data fetching hook
    - Implement useConsultation hook for fetching consultation data
    - Add proper error handling and loading states
    - Integrate with existing consultation API endpoints
  - [ ] 2.3 Add consultation data validation
    - Create Zod schema for consultation data validation
    - Implement type safety for AI prediction data
    - Add proper error boundaries for invalid data

- [ ] 3.0 Implement Session Management System
  - [ ] 3.1 Create session data types and schemas
    - Define TypeScript interfaces for Session, SessionStatus, and related types
    - Create Zod schemas for session creation and validation
    - Implement proper type safety throughout the application
  - [ ] 3.2 Create session list component
    - Build component to display all sessions for a client
    - Implement session status badges with color coding
    - Add session number, title, description display
    - Create responsive layout for session list
  - [ ] 3.3 Implement session creation functionality
    - Create session form modal component
    - Implement auto-numbering for session numbers
    - Add form validation for title and description fields
    - Integrate with session creation API

- [ ] 4.0 Implement Session Status Management and Actions
  - [ ] 4.1 Create session action buttons component
    - Implement conditional rendering based on session status
    - Create buttons for Schedule, Edit, Re-schedule, Start Session, and Continue
    - Add proper button styling and accessibility
  - [ ] 4.2 Implement session scheduling functionality
    - Create calendar modal component for date/time selection
    - Add validation to prevent past date/time scheduling
    - Implement conflict detection for existing scheduled sessions
    - Integrate with session scheduling API
  - [ ] 4.3 Implement session status transitions
    - Add logic for status changes (new → scheduled → started → completed)
    - Implement session continuity rules (prevent starting when previous incomplete)
    - Add confirmation modal for session start action
    - Handle navigation to session page after starting

- [ ] 5.0 Implement Session Page and Navigation
  - [ ] 5.1 Create basic session page structure
    - Implement session page with PageWrapper component
    - Add session information display
    - Create placeholder content for future session features
    - Implement proper navigation back to therapy page
  - [ ] 5.2 Add session data fetching and display
    - Create useSession hook for fetching session data
    - Display session details (number, title, description, status)
    - Add proper loading and error states
    - Implement session data validation

- [ ] 6.0 Implement State Management and API Integration
  - [ ] 6.1 Create therapy state management
    - Implement Zustand store for therapy page data
    - Add actions for session CRUD operations
    - Implement optimistic updates for better UX
    - Add proper error handling and rollback functionality
  - [ ] 6.2 Create therapy API client
    - Implement API functions for session operations
    - Add proper error handling and response validation
    - Integrate with existing authentication system
    - Add request/response interceptors for error handling
  - [ ] 6.3 Implement data synchronization
    - Add real-time updates for session status changes
    - Implement proper cache invalidation
    - Add loading states for all async operations
    - Handle offline/online state gracefully

- [ ] 7.0 Add Error Handling and Validation
  - [ ] 7.1 Implement comprehensive error handling
    - Add error boundaries for component-level errors
    - Implement proper error messages for user feedback
    - Add retry mechanisms for failed API calls
    - Handle network errors gracefully
  - [ ] 7.2 Add form validation and user feedback
    - Implement client-side validation for all forms
    - Add proper error messages and field highlighting
    - Implement success notifications for completed actions
    - Add confirmation dialogs for destructive actions

- [ ] 8.0 Implement Responsive Design and Accessibility
  - [ ] 8.1 Add responsive design for all components
    - Implement mobile-first responsive design
    - Add proper breakpoints for tablet and desktop
    - Ensure all components work on different screen sizes
    - Test on various devices and browsers
  - [ ] 8.2 Implement accessibility features
    - Add proper ARIA labels and roles
    - Implement keyboard navigation for all interactive elements
    - Add focus management for modals and forms
    - Ensure color contrast meets WCAG standards
    - Add screen reader support for all components

- [ ] 9.0 Add Unit Tests and Integration Tests
  - [ ] 9.1 Create unit tests for components
    - Test all therapy page components
    - Test session management functionality
    - Test form validation and error handling
    - Test responsive design and accessibility
  - [ ] 9.2 Create integration tests
    - Test complete user workflows
    - Test API integration and error scenarios
    - Test navigation between pages
    - Test session status transitions
  - [ ] 9.3 Create hook tests
    - Test useTherapy and useSession hooks
    - Test state management functionality
    - Test API client functions
    - Test error handling scenarios
