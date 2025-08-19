# Task 01: Setup Therapy Page Structure and Routing

## Overview
Set up the basic page structure and routing for the therapy page and session page, including tab navigation and proper TypeScript types.

## Relevant Files
- `frontend/src/app/portal/therapist/therapy/[clientId]/page.tsx` - Main therapy page component
- `frontend/src/app/portal/therapist/sessions/[sessionId]/page.tsx` - Session page component with validation and error handling
- `frontend/src/components/therapy/TherapyPage.tsx` - Main therapy page component with tabs and session navigation
- `frontend/src/hooks/useSession.ts` - Custom hook for session data management
- `frontend/src/types/session.ts` - TypeScript types for session data

## Tasks

### 1.1 Create therapy page route and basic layout
- [x] Create the therapy page route at `/portal/therapist/therapy/[clientId]`
- [x] Implement basic page structure using PageWrapper component
- [x] Add back button navigation to therapist client page
- [x] Set up proper TypeScript types for clientId parameter
- [x] Add proper error handling for invalid clientId

**Steps:**
1. Create the directory structure: `frontend/src/app/portal/therapist/therapy/[clientId]/`
2. Create `page.tsx` with basic Next.js page structure
3. Import and use PageWrapper component with back button
4. Add TypeScript interface for page props with clientId
5. Add validation for clientId parameter
6. Test navigation from therapist client page

### 1.2 Create session page route and basic layout
- [x] Create the session page route at `/portal/therapist/sessions/[sessionId]`
- [x] Implement basic page structure using PageWrapper component
- [x] Add back button navigation to therapy page
- [x] Set up proper TypeScript types for sessionId parameter
- [x] Add proper error handling for invalid sessionId

**Steps:**
1. Create the directory structure: `frontend/src/app/portal/therapist/sessions/[sessionId]/`
2. Create `page.tsx` with basic Next.js page structure
3. Import and use PageWrapper component with back button
4. Add TypeScript interface for page props with sessionId
5. Add validation for sessionId parameter
6. Test navigation from therapy page

### 1.3 Set up tab navigation structure
- [x] Create tab component for Summary, Consultation, and Therapy tabs
- [x] Implement tab switching functionality
- [x] Add conditional rendering for therapy tab based on consultation data
- [x] Add proper accessibility for tab navigation
- [x] Implement responsive design for tabs

**Steps:**
1. Create `TherapyPage.tsx` component in `frontend/src/components/therapy/`
2. Use shadcn/ui Tabs component for tab structure
3. Implement tab state management with useState
4. Add conditional rendering logic for therapy tab
5. Add proper ARIA labels and keyboard navigation
6. Test tab switching and conditional rendering
7. Test responsive behavior on mobile devices

## Acceptance Criteria
- [x] Therapy page loads correctly with clientId parameter
- [x] Session page loads correctly with sessionId parameter
- [x] Back button navigation works properly on both pages
- [x] Tab navigation functions correctly with proper state management
- [x] Therapy tab is conditionally rendered based on consultation data
- [x] All components are properly typed with TypeScript
- [x] Error handling works for invalid parameters
- [x] Responsive design works on all screen sizes
- [x] Accessibility requirements are met (ARIA labels, keyboard navigation)

## Dependencies
- PageWrapper component must be available
- shadcn/ui Tabs component must be installed
- Existing navigation patterns from other portal pages

## Estimated Time
- 1.1: 2-3 hours
- 1.2: 2-3 hours  
- 1.3: 3-4 hours
- **Total: 7-10 hours**
