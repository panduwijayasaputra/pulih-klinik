# Task: Client Reassignment Functionality

**Parent Task**: 5.0 Implement Client Reassignment Functionality  
**Dependencies**: 01-client-status-management.md  
**Estimated Time**: 1-2 days

## Overview
Implement client reassignment functionality for clinic admins with proper status validation, audit trail, and therapist notifications.

## Files to Create/Modify
- `frontend/src/components/clients/ReassignClientModal.tsx` - Modal for reassigning clients
- `frontend/src/components/clients/AssignTherapistModal.tsx` - Update existing modal
- `frontend/src/components/clients/ClientList.tsx` - Update to include reassignment

## Tasks

### 5.1 Create Reassignment Modal Component
- [ ] Create `frontend/src/components/clients/ReassignClientModal.tsx`
- [ ] Implement therapist selection dropdown
- [ ] Add reason field for reassignment tracking
- [ ] Include validation for reassignment conditions
- [ ] Use existing FormModal component for consistency

**Steps:**
1. Create reassignment modal using FormModal component
2. Add therapist selection dropdown
3. Include reason field for audit trail
4. Add validation for reassignment conditions
5. Implement proper form submission

### 5.2 Update Assign Therapist Modal
- [ ] Update `frontend/src/components/clients/AssignTherapistModal.tsx`
- [ ] Add status transition handling during assignment
- [ ] Include reassignment functionality for assigned clients
- [ ] Add status validation for reassignment
- [ ] Implement proper error handling

**Steps:**
1. Update existing assign therapist modal
2. Add status transition logic
3. Include reassignment functionality
4. Add status validation
5. Implement proper error handling

### 5.3 Implement Reassignment Logic
- [ ] Add reassignment functions to client status store
- [ ] Implement status transition from consultation to assigned
- [ ] Include reassignment audit trail
- [ ] Add validation for reassignment permissions
- [ ] Implement therapist notification preparation

**Steps:**
1. Add reassignment functions to status store
2. Implement status transition logic
3. Add audit trail functionality
4. Include permission validation
5. Prepare notification data

### 5.4 Update Client List for Reassignment
- [ ] Update `frontend/src/components/clients/ClientList.tsx`
- [ ] Add reassignment action for appropriate clients
- [ ] Include reassignment button visibility logic
- [ ] Add reassignment confirmation handling
- [ ] Update client list to reflect reassignment changes

**Steps:**
1. Add reassignment action to client list
2. Implement button visibility logic
3. Add confirmation handling
4. Update list to reflect changes
5. Include proper error handling

## Acceptance Criteria
- [ ] Reassignment modal works correctly
- [ ] Status validation prevents invalid reassignments
- [ ] Audit trail tracks reassignment reasons
- [ ] Reassignment buttons show only for appropriate clients
- [ ] Client list updates after reassignment
- [ ] Proper error handling is implemented

## Notes
- Reassignment should only be allowed for assigned clients or after reverting from consultation
- Include proper audit trail with reasons
- Use existing FormModal component for consistency
- Implement proper validation for reassignment conditions
- Add confirmation dialogs for reassignment actions
