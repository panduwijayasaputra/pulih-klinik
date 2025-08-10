# Task: Client Therapy Page with Tabs

**Parent Task**: 4.0 Develop Client Therapy Page with Tabs  
**Dependencies**: 01-client-status-management.md, 03-consultation-form-system.md  
**Estimated Time**: 2-3 days

## Overview
Create a comprehensive therapy page for individual clients with three tabs: Client Information, Consultation Information, and Therapy Sessions.

## Files to Create/Modify
- `frontend/src/components/consultation/ClientTherapyPage.tsx` - Main therapy page component
- `frontend/src/app/portal/therapist/clients/[id]/therapy/page.tsx` - Individual client therapy page
- `frontend/src/components/consultation/index.ts` - Export file for consultation components

## Tasks

### 4.1 Create Client Therapy Page Component
- [ ] Create `frontend/src/components/consultation/ClientTherapyPage.tsx`
- [ ] Implement three-tab layout using existing Tabs component
- [ ] Add role-based access control for therapists only
- [ ] Include client information display in first tab
- [ ] Add consultation information in second tab
- [ ] Include mock session list in third tab

**Steps:**
1. Create main therapy page component
2. Implement three-tab layout using Tabs component
3. Add role-based access control
4. Create tab content components
5. Add proper loading and error states

### 4.2 Create Individual Client Therapy Page
- [ ] Create `frontend/src/app/portal/therapist/clients/[id]/therapy/page.tsx`
- [ ] Implement dynamic route for individual client therapy
- [ ] Add client data fetching and loading states
- [ ] Include error handling for invalid client IDs
- [ ] Use PortalPageWrapper for consistent layout

**Steps:**
1. Create Next.js dynamic page component
2. Implement client data fetching by ID
3. Add proper loading states
4. Include error handling for invalid IDs
5. Use PortalPageWrapper for layout

### 4.3 Implement Tab Content Components
- [ ] Create ClientInformationTab component for first tab
- [ ] Create ConsultationInformationTab component for second tab
- [ ] Create TherapySessionsTab component for third tab
- [ ] Implement proper data display and editing capabilities
- [ ] Add status transition action buttons

**Steps:**
1. Create ClientInformationTab with complete client data display
2. Create ConsultationInformationTab with consultation data and editing
3. Create TherapySessionsTab with mock session list
4. Add status transition action buttons
5. Implement proper data editing capabilities

### 4.4 Add Status Transition Actions
- [ ] Implement "Start Consultation" action for assigned clients
- [ ] Add "Start Therapy" action for consultation clients
- [ ] Include "Mark Complete" action for therapy clients
- [ ] Add confirmation dialogs for status transitions
- [ ] Implement proper action button visibility based on status

**Steps:**
1. Add status transition action buttons
2. Implement confirmation dialogs
3. Add proper action visibility logic
4. Include status transition validation
5. Add success/error feedback

## Acceptance Criteria
- [ ] Three tabs display correctly (Client Information, Consultation Information, Therapy Sessions)
- [ ] Client information shows completely in first tab
- [ ] Consultation information is editable in second tab
- [ ] Mock session list displays in third tab
- [ ] Status transition actions work correctly
- [ ] Role-based access control prevents unauthorized access
- [ ] Proper loading and error states are implemented

## Notes
- Use existing Tabs component for consistency
- Implement proper role-based access control
- Status transition actions should be context-aware
- Mock session list should be realistic for development
- All labels should be in Bahasa Indonesia
- Use PortalPageWrapper for consistent layout
