# Task 04: Create Session Management System

## Overview

This task focuses on building the session management system, including session recommendations, session list display, scheduling functionality, and session generation logic.

## Objectives

- Create SessionRecommendations component for managing session count
- Build SessionList component for displaying and managing sessions
- Implement SessionSchedulingModal with date/time pickers
- Develop session generation logic based on detected issues

## Files to Create/Modify

### New Files
- `frontend/src/components/therapy/SessionRecommendations.tsx`
- `frontend/src/components/therapy/SessionList.tsx`
- `frontend/src/components/therapy/SessionSchedulingModal.tsx`

### Modified Files
- `frontend/src/components/therapy/TherapyPage.tsx`
- `frontend/src/lib/mockData/therapyMockData.ts`

## Detailed Tasks

### 4.1 Create SessionRecommendations component
- [ ] Create `frontend/src/components/therapy/SessionRecommendations.tsx`
- [ ] Design UI for displaying recommended session count
- [ ] Add input field for modifying session count
- [ ] Implement session generation based on detected issues
- [ ] Add save functionality for session count changes

### 4.2 Create SessionList component
- [ ] Create `frontend/src/components/therapy/SessionList.tsx`
- [ ] Display generated sessions with status indicators
- [ ] Show session titles, descriptions, and current status
- [ ] Implement status badges: not started, scheduled, started, completed
- [ ] Add action buttons for each session (Schedule, Start)

### 4.3 Create SessionSchedulingModal component
- [ ] Create `frontend/src/components/therapy/SessionSchedulingModal.tsx`
- [ ] Implement date picker component
- [ ] Add time picker with business hours validation (9 AM - 6 PM, Monday-Friday)
- [ ] Add confirmation dialogs for scheduling actions
- [ ] Include validation for date/time selection

### 4.4 Implement session generation logic
- [ ] Generate specific session titles and descriptions
- [ ] Create session templates based on detected issues
- [ ] Implement session numbering and organization
- [ ] Add session duration and type information

## Acceptance Criteria

- [ ] SessionRecommendations component displays and allows modification of session count
- [ ] SessionList component shows sessions with proper status indicators
- [ ] SessionSchedulingModal validates business hours correctly
- [ ] Session generation creates meaningful titles and descriptions
- [ ] All components integrate properly with TherapyPage
- [ ] Business hours validation works (9 AM - 6 PM, Monday-Friday)
- [ ] TypeScript compilation passes without errors

## Testing

- [ ] Test session count modification functionality
- [ ] Verify session list displays correctly with different statuses
- [ ] Test scheduling modal with valid and invalid times
- [ ] Check that session generation creates appropriate content
- [ ] Test business hours validation thoroughly
- [ ] Verify component integration and data flow
- [ ] Test responsive design on different screen sizes
