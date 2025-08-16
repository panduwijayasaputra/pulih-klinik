# Task List: Therapy Feature Implementation

## Overview

This task list covers the frontend implementation of the Therapy feature, which transforms the consultation process into a structured therapy planning system. The feature includes consultation form integration, AI-powered mental health issue detection, session management, and a clean therapy workspace.

## Relevant Files

- `frontend/src/app/portal/therapist/therapy/[clientId]/page.tsx` - Main therapy page component
- `frontend/src/app/portal/therapist/session/[sessionId]/page.tsx` - Therapy session page component
- `frontend/src/components/therapy/TherapyPage.tsx` - Main therapy workflow container
- `frontend/src/components/therapy/MentalHealthDetection.tsx` - Component for displaying and editing detected issues
- `frontend/src/components/therapy/SessionRecommendations.tsx` - Component for managing session count and generation
- `frontend/src/components/therapy/SessionList.tsx` - Component for displaying and managing therapy sessions
- `frontend/src/components/therapy/SessionSchedulingModal.tsx` - Modal for scheduling sessions with date/time pickers
- `frontend/src/components/therapy/TherapySessionPage.tsx` - Clean workspace for conducting therapy sessions
- `frontend/src/hooks/useTherapy.ts` - Custom hook for therapy data management
- `frontend/src/hooks/useSession.ts` - Custom hook for session management
- `frontend/src/schemas/therapySchema.ts` - Zod schemas for therapy-related forms
- `frontend/src/schemas/sessionSchema.ts` - Zod schemas for session-related forms
- `frontend/src/types/therapy.ts` - TypeScript types for therapy-related data
- `frontend/src/types/session.ts` - TypeScript types for session-related data
- `frontend/src/store/therapy.ts` - Zustand store for therapy state management
- `frontend/src/store/session.ts` - Zustand store for session state management
- `frontend/src/lib/api/therapy.ts` - API client functions for therapy operations
- `frontend/src/lib/api/session.ts` - API client functions for session operations
- `frontend/src/lib/mockData/therapyMockData.ts` - Mock data for mental health detection and session generation

### Test Files

- `frontend/src/app/portal/therapist/therapy/[clientId]/page.test.tsx` - Tests for therapy page
- `frontend/src/app/portal/therapist/session/[sessionId]/page.test.tsx` - Tests for session page
- `frontend/src/components/therapy/TherapyPage.test.tsx` - Tests for TherapyPage component
- `frontend/src/components/therapy/MentalHealthDetection.test.tsx` - Tests for MentalHealthDetection component
- `frontend/src/components/therapy/SessionRecommendations.test.tsx` - Tests for SessionRecommendations component
- `frontend/src/components/therapy/SessionList.test.tsx` - Tests for SessionList component
- `frontend/src/components/therapy/SessionSchedulingModal.test.tsx` - Tests for SessionSchedulingModal component
- `frontend/src/components/therapy/TherapySessionPage.test.tsx` - Tests for TherapySessionPage component
- `frontend/src/hooks/useTherapy.test.ts` - Tests for useTherapy hook
- `frontend/src/hooks/useSession.test.ts` - Tests for useSession hook
- `frontend/src/schemas/therapySchema.test.ts` - Tests for therapy schemas
- `frontend/src/schemas/sessionSchema.test.ts` - Tests for session schemas
- `frontend/src/store/therapy.test.ts` - Tests for therapy store
- `frontend/src/store/session.test.ts` - Tests for session store

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `TherapyPage.tsx` and `TherapyPage.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- All components should follow the existing frontend development rules (React/TypeScript/Tailwind/Zod).
- Mock data should be used initially for AI detection and session generation features.

## Tasks

- [ ] 1.0 Setup Project Structure and Routing
  - [ ] 1.1 Create therapy feature directory structure
    - Create `frontend/src/components/therapy/` directory
    - Create `frontend/src/hooks/` directory (if not exists)
    - Create `frontend/src/schemas/` directory (if not exists)
    - Create `frontend/src/types/` directory (if not exists)
    - Create `frontend/src/store/` directory (if not exists)
    - Create `frontend/src/lib/api/` directory (if not exists)
    - Create `frontend/src/lib/mockData/` directory (if not exists)
  - [ ] 1.2 Setup Next.js routing for therapy pages
    - Create `frontend/src/app/portal/therapist/therapy/[clientId]/page.tsx`
    - Create `frontend/src/app/portal/therapist/session/[sessionId]/page.tsx`
    - Add proper TypeScript types for dynamic route parameters
    - Implement basic page structure with loading states
  - [ ] 1.3 Update navigation configuration
    - Update `frontend/src/lib/navigation-config.ts` to include therapy routes
    - Add therapy page to breadcrumb navigation
    - Ensure proper route protection for therapy pages
  - [ ] 1.4 Create basic TypeScript types and interfaces
    - Create `frontend/src/types/therapy.ts` with therapy-related interfaces
    - Create `frontend/src/types/session.ts` with session-related interfaces
    - Define types for mental health issues, session status, and scheduling data

- [ ] 2.0 Implement Core Therapy Page and Components
  - [ ] 2.1 Create main TherapyPage component
    - Create `frontend/src/components/therapy/TherapyPage.tsx`
    - Implement responsive layout with Tailwind CSS
    - Add proper TypeScript props interface
    - Include consultation form integration area
    - Add sections for mental health detection and session management
  - [ ] 2.2 Integrate existing consultation form
    - Import and integrate `ConsultationForm` component
    - Handle consultation form submission and data management
    - Add edit functionality for consultation data
    - Implement form validation using existing Zod schemas
  - [ ] 2.3 Create page layout and navigation
    - Implement breadcrumb navigation: Portal → Therapy Session
    - Add proper page header with client information
    - Create responsive grid layout for different sections
    - Add loading states and error handling
  - [ ] 2.4 Add client information display
    - Display client basic information from ClientFormModal data
    - Show client status and progress information
    - Add client photo/avatar if available
    - Implement responsive design for mobile devices

- [ ] 3.0 Build Mental Health Detection System
  - [ ] 3.1 Create MentalHealthDetection component
    - Create `frontend/src/components/therapy/MentalHealthDetection.tsx`
    - Design UI for displaying detected issues with confidence percentages
    - Implement list view with percentage bars
    - Add edit functionality for each detected issue
    - Include save/cancel buttons for modifications
  - [ ] 3.2 Create mock data for mental health detection
    - Create `frontend/src/lib/mockData/therapyMockData.ts`
    - Generate realistic mock data for mental health issues
    - Include various issue types with confidence percentages
    - Add sample data for different client scenarios
  - [ ] 3.3 Implement issue editing functionality
    - Add inline editing for issue descriptions
    - Implement confidence percentage adjustment
    - Add ability to add/remove detected issues
    - Create validation for issue modifications
  - [ ] 3.4 Add save functionality for issue modifications
    - Implement save button with loading states
    - Add confirmation dialogs for saving changes
    - Create success/error feedback for save operations
    - Integrate with state management for data persistence

- [ ] 4.0 Create Session Management System
  - [ ] 4.1 Create SessionRecommendations component
    - Create `frontend/src/components/therapy/SessionRecommendations.tsx`
    - Design UI for displaying recommended session count
    - Add input field for modifying session count
    - Implement session generation based on detected issues
    - Add save functionality for session count changes
  - [ ] 4.2 Create SessionList component
    - Create `frontend/src/components/therapy/SessionList.tsx`
    - Display generated sessions with status indicators
    - Show session titles, descriptions, and current status
    - Implement status badges: not started, scheduled, started, completed
    - Add action buttons for each session (Schedule, Start)
  - [ ] 4.3 Create SessionSchedulingModal component
    - Create `frontend/src/components/therapy/SessionSchedulingModal.tsx`
    - Implement date picker component
    - Add time picker with business hours validation (9 AM - 6 PM, Monday-Friday)
    - Add confirmation dialogs for scheduling actions
    - Include validation for date/time selection
  - [ ] 4.4 Implement session generation logic
    - Generate specific session titles and descriptions
    - Create session templates based on detected issues
    - Implement session numbering and organization
    - Add session duration and type information

- [ ] 5.0 Develop Therapy Session Workspace
  - [ ] 5.1 Create TherapySessionPage component
    - Create `frontend/src/components/therapy/TherapySessionPage.tsx`
    - Design clean, distraction-free workspace
    - Implement minimal UI with essential controls
    - Add session progress information display
    - Include navigation back to therapy page
  - [ ] 5.2 Implement session workspace layout
    - Create responsive layout for therapy session
    - Add session header with client and session information
    - Implement session timer and progress tracking
    - Add session notes and documentation area
  - [ ] 5.3 Add session controls and navigation
    - Implement session start/pause/end controls
    - Add navigation between different session sections
    - Create session status indicators
    - Add emergency stop or session interruption handling
  - [ ] 5.4 Create session documentation features
    - Add session notes input area
    - Implement session progress tracking
    - Create session summary and next steps
    - Add session completion workflow

- [ ] 6.0 Integrate State Management and API Layer
  - [ ] 6.1 Create therapy Zustand store
    - Create `frontend/src/store/therapy.ts`
    - Implement state for therapy data, mental health issues, and session recommendations
    - Add actions for updating therapy information
    - Implement real-time state updates
  - [ ] 6.2 Create session Zustand store
    - Create `frontend/src/store/session.ts`
    - Implement state for session management and scheduling
    - Add actions for session status updates
    - Implement real-time session status tracking
  - [ ] 6.3 Create custom hooks for data management
    - Create `frontend/src/hooks/useTherapy.ts` for therapy data operations
    - Create `frontend/src/hooks/useSession.ts` for session operations
    - Implement data fetching and caching with React Query
    - Add error handling and loading states
  - [ ] 6.4 Create API client functions
    - Create `frontend/src/lib/api/therapy.ts` for therapy API operations
    - Create `frontend/src/lib/api/session.ts` for session API operations
    - Implement mock API functions for initial development
    - Add proper error handling and response types
  - [ ] 6.5 Create Zod schemas for validation
    - Create `frontend/src/schemas/therapySchema.ts` for therapy form validation
    - Create `frontend/src/schemas/sessionSchema.ts` for session form validation
    - Implement validation for mental health issues and session data
    - Add proper error messages and validation rules

- [ ] 7.0 Add User Experience Enhancements and Testing
  - [ ] 7.1 Implement confirmation dialogs
    - Add confirmation dialogs for starting sessions
    - Implement confirmation for scheduling actions
    - Create confirmation for saving modifications
    - Add confirmation for session completion
  - [ ] 7.2 Add loading states and feedback
    - Implement loading spinners for all async operations
    - Add success/error toast notifications
    - Create progress indicators for long operations
    - Add skeleton loading for data fetching
  - [ ] 7.3 Implement responsive design
    - Ensure mobile-first responsive design
    - Test on different screen sizes
    - Optimize touch interactions for mobile devices
    - Implement proper accessibility features
  - [ ] 7.4 Create comprehensive test suite
    - Write unit tests for all components
    - Test custom hooks with proper mocking
    - Validate Zod schemas with test data
    - Test Zustand stores and state management
    - Add integration tests for user workflows
  - [ ] 7.5 Add accessibility features
    - Implement proper ARIA labels
    - Add keyboard navigation support
    - Ensure color contrast compliance
    - Test with screen readers
    - Add focus management for modals and forms
