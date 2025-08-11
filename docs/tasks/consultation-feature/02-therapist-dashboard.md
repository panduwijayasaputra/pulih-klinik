# Task: Therapist Dashboard and Client List

**Parent Task**: 2.0 Create Therapist Dashboard and Client List - ✅ **COMPLETED**  
**Dependencies**: 01-client-status-management.md  
**Estimated Time**: 1-2 days

## Overview
Create a dedicated dashboard for therapists to view and manage their assigned clients with search, filtering, and quick actions.

## Relevant Files
- `frontend/src/hooks/useTherapistClients.ts` - **Created** - Custom hook with therapist-specific client filtering, search, status filtering, and statistics
- `frontend/src/components/portal/TherapistDashboard.tsx` - **Modified** - Replaced placeholder with comprehensive dashboard component with status cards, search/filters, and DataTable integration
- `frontend/src/app/portal/therapist/clients/page.tsx` - **Created** - Next.js page with role-based access control and proper routing
- `frontend/src/lib/navigation-config.ts` - **Modified** - Added "Klien Saya" navigation item for therapists, updated breadcrumb mapping, allowed routes, and quick access items

## Tasks

### 2.1 Create Therapist Clients Hook
- [x] Create `frontend/src/hooks/useTherapistClients.ts` custom hook
- [x] Implement filtering by therapist ID
- [x] Add search functionality by client name
- [x] Include status-based filtering
- [x] Add client count by status

**Steps:**
1. Create custom hook that filters clients by assigned therapist
2. Implement search functionality using existing search patterns
3. Add status-based filtering (assigned, consultation, therapy, done)
4. Calculate and return client counts by status
5. Include loading and error states

### 2.2 Create Therapist Dashboard Component
- [x] Create `frontend/src/components/consultation/TherapistDashboard.tsx`
- [x] Implement client list with search and filters
- [x] Add status overview cards showing counts
- [x] Include quick action buttons for each client
- [x] Use existing DataTable component for consistency

**Steps:**
1. Create dashboard component using PortalPageWrapper
2. Implement status overview cards with counts
3. Use DataTable component for client list
4. Add quick action buttons (Start Consultation, View Details)
5. Include search and filter functionality

### 2.3 Create Therapist Clients Page
- [x] Create `frontend/src/app/portal/therapist/clients/page.tsx`
- [x] Implement therapist-specific client list page
- [x] Add role-based access control for therapists only
- [x] Use PortalPageWrapper for consistent layout
- [x] Include search, filtering, and status overview

**Steps:**
1. Create Next.js page component for therapist clients
2. Implement role-based access control
3. Use TherapistDashboard component
4. Add proper loading and error states
5. Include breadcrumb navigation

### 2.4 Update Navigation for Therapists
- [x] Update `frontend/src/components/navigation/RoleBasedNavigation.tsx` to include therapist routes
- [x] Add "My Clients" navigation item for therapists
- [x] Ensure proper role-based menu visibility
- [x] Update navigation configuration for therapist role

**Steps:**
1. Add therapist-specific navigation items
2. Include "My Clients" menu item
3. Ensure proper role-based visibility
4. Update navigation configuration
5. Test navigation visibility for different roles

## Acceptance Criteria
- [ ] Therapists can see only their assigned clients
- [ ] Search functionality works by client name
- [ ] Status-based filtering works correctly
- [ ] Status overview cards show accurate counts
- [ ] Quick action buttons are available for each client
- [ ] Navigation includes "My Clients" for therapists
- [ ] Role-based access control prevents unauthorized access

## Notes
- Use existing DataTable component for consistency
- Implement proper loading states for better UX
- Ensure search and filters work together
- Quick actions should be context-aware based on client status
- Navigation should only show therapist-specific items for therapist role
