# Task: Client Status Management System

**Parent Task**: 1.0 Implement Client Status Management System  
**Dependencies**: None  
**Estimated Time**: 2-3 days

## Overview
Implement the core client status management system with proper status transitions, audit trail, and validation.

## Files to Create/Modify
- `frontend/src/types/clientStatus.ts` - Type definitions for client status and status transitions
- `frontend/src/types/enums.ts` - Add client status enum
- `frontend/src/types/client.ts` - Update existing client interface with status field
- `frontend/src/schemas/clientStatusSchema.ts` - Zod schemas for status validation
- `frontend/src/store/clientStatus.ts` - Zustand store for status management
- `frontend/src/hooks/useClientStatus.ts` - Custom hook for status operations
- `frontend/src/components/clients/ClientStatusBadge.tsx` - Status badge component
- `frontend/src/components/clients/ClientList.tsx` - Update to include status badges
- `frontend/src/lib/api/mockData.ts` - Add status data to mock clients

## Tasks

### 1.1 Create Client Status Types and Enums
- [ ] Create `frontend/src/types/clientStatus.ts` with ClientStatusEnum and StatusTransition interface
- [ ] Update `frontend/src/types/enums.ts` to include ClientStatusEnum
- [ ] Update `frontend/src/types/client.ts` to add status field to Client interface
- [ ] Define StatusTransition interface with id, clientId, fromStatus, toStatus, timestamp, userId, reason fields

**Steps:**
1. Create ClientStatusEnum with values: 'new', 'assigned', 'consultation', 'therapy', 'done'
2. Create StatusTransition interface for audit trail
3. Add status field to existing Client interface
4. Add status labels mapping for Bahasa Indonesia display

### 1.2 Create Client Status Zod Schemas
- [ ] Create `frontend/src/schemas/clientStatusSchema.ts` with status validation schemas
- [ ] Define clientStatusSchema for status validation
- [ ] Define statusTransitionSchema for transition tracking
- [ ] Create validation functions for status transitions

**Steps:**
1. Create Zod enum for client status validation
2. Create schema for status transition validation
3. Add validation functions for allowed status transitions
4. Include reason validation for transitions

### 1.3 Create Client Status Store
- [ ] Create `frontend/src/store/clientStatus.ts` Zustand store
- [ ] Implement status transitions with audit trail
- [ ] Add functions for getting status history
- [ ] Include validation for allowed status transitions

**Steps:**
1. Create Zustand store with status transitions state
2. Implement transition functions with validation
3. Add status history tracking
4. Include audit trail functionality

### 1.4 Create Client Status Hook
- [ ] Create `frontend/src/hooks/useClientStatus.ts` custom hook
- [ ] Implement status transition functions
- [ ] Add status validation logic
- [ ] Include status history retrieval

**Steps:**
1. Create custom hook with status transition functions
2. Add validation for allowed transitions
3. Implement status history retrieval
4. Add error handling for invalid transitions

### 1.5 Create Client Status Badge Component
- [ ] Create `frontend/src/components/clients/ClientStatusBadge.tsx`
- [ ] Implement color-coded status badges (gray, blue, orange, green, purple)
- [ ] Add status labels in Bahasa Indonesia
- [ ] Include status tooltips for better UX

**Steps:**
1. Create status badge component with color mapping
2. Add Bahasa Indonesia labels for each status
3. Implement tooltip functionality
4. Add proper accessibility attributes

### 1.6 Update Existing Client Components
- [ ] Update `frontend/src/components/clients/ClientList.tsx` to include status badges
- [ ] Update `frontend/src/lib/api/mockData.ts` to include status data for mock clients
- [ ] Add status field to existing client mock data
- [ ] Update client list to display status information

**Steps:**
1. Add status badges to client list table
2. Update mock data with status information
3. Add status column to client list
4. Update client details modal to show status

## Acceptance Criteria
- [ ] All client statuses are properly defined and validated
- [ ] Status transitions are tracked with audit trail
- [ ] Status badges display correctly with proper colors
- [ ] Mock data includes status information
- [ ] Client list shows status information
- [ ] Status transitions are validated properly

## Notes
- Status transitions should be validated to prevent invalid state changes
- All status labels should be in Bahasa Indonesia for UI display
- Status history should be preserved for audit purposes
- Color scheme: New (gray), Assigned (blue), Consultation (orange), Therapy (green), Done (purple)
