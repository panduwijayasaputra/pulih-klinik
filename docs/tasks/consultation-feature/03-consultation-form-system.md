# Task: Consultation Form System

**Parent Task**: 3.0 Build Consultation Form System  
**Dependencies**: 01-client-status-management.md  
**Estimated Time**: 2-3 days

## Overview
Build a comprehensive consultation form system with three form types (general, drug addiction, minor), validation, and data management.

## Files to Create/Modify
- `frontend/src/types/consultation.ts` - Type definitions for consultation data and forms
- `frontend/src/schemas/consultationSchema.ts` - Zod schemas for consultation form validation
- `frontend/src/store/consultation.ts` - Zustand store for consultation data management
- `frontend/src/hooks/useConsultation.ts` - Custom hook for consultation operations
- `frontend/src/components/consultation/ConsultationForm.tsx` - Base consultation form component
- `frontend/src/components/consultation/ConsultationFormModal.tsx` - Modal wrapper for consultation forms
- `frontend/src/lib/api/consultation.ts` - API functions for consultation endpoints

## Tasks

### 3.1 Create Consultation Types and Schemas
- [ ] Create `frontend/src/types/consultation.ts` with consultation interfaces
- [ ] Define Consultation interface with form-specific fields
- [ ] Create separate interfaces for General, DrugAddiction, and Minor consultation types
- [ ] Create `frontend/src/schemas/consultationSchema.ts` with Zod validation
- [ ] Implement validation schemas for each consultation form type

**Steps:**
1. Create base Consultation interface with common fields
2. Create specific interfaces for each form type with unique fields
3. Create Zod schemas for form validation
4. Add validation rules for required and optional fields
5. Include conditional validation based on form type

### 3.2 Create Consultation Store
- [ ] Create `frontend/src/store/consultation.ts` Zustand store
- [ ] Implement consultation CRUD operations
- [ ] Add consultation data persistence
- [ ] Include consultation history tracking

**Steps:**
1. Create Zustand store with consultation state
2. Implement create, read, update operations
3. Add consultation data persistence
4. Include consultation history tracking
5. Add proper error handling

### 3.3 Create Consultation Hook
- [ ] Create `frontend/src/hooks/useConsultation.ts` custom hook
- [ ] Implement consultation form operations
- [ ] Add form validation integration
- [ ] Include consultation data management

**Steps:**
1. Create custom hook with consultation operations
2. Integrate form validation with Zod schemas
3. Add consultation data management functions
4. Include loading and error states
5. Add proper error handling

### 3.4 Create Base Consultation Form Component
- [ ] Create `frontend/src/components/consultation/ConsultationForm.tsx`
- [ ] Implement form structure with React Hook Form and Zod
- [ ] Add form type selection (general, drug addiction, minor)
- [ ] Include conditional field rendering based on form type
- [ ] Implement form validation and error handling

**Steps:**
1. Create form component using React Hook Form
2. Add form type selection dropdown
3. Implement conditional field rendering
4. Add form validation with Zod
5. Include proper error display

### 3.5 Create Consultation Form Modal
- [ ] Create `frontend/src/components/consultation/ConsultationFormModal.tsx`
- [ ] Implement modal wrapper using existing FormModal component
- [ ] Add consultation form integration
- [ ] Include save and edit functionality
- [ ] Prevent editing after therapy status

**Steps:**
1. Create modal wrapper using FormModal component
2. Integrate ConsultationForm component
3. Add save and edit functionality
4. Implement status-based editing restrictions
5. Add proper loading states

### 3.6 Create Consultation API Functions
- [ ] Create `frontend/src/lib/api/consultation.ts`
- [ ] Implement consultation CRUD API functions
- [ ] Add mock consultation data for development
- [ ] Include consultation data validation

**Steps:**
1. Create API functions for consultation CRUD operations
2. Add mock consultation data
3. Implement data validation
4. Add proper error handling
5. Include loading states

## Acceptance Criteria
- [ ] Three consultation form types are available (general, drug addiction, minor)
- [ ] Forms validate input correctly using Zod schemas
- [ ] Consultation data can be saved and edited
- [ ] Editing is prevented after therapy status
- [ ] Form fields are conditionally rendered based on form type
- [ ] Mock consultation data is available for development
- [ ] Form validation shows proper error messages

## Notes
- Use existing FormModal component for consistency
- Implement proper form validation with Zod
- Conditional field rendering should be based on form type selection
- Form data should be persisted in Zustand store
- Editing restrictions should be based on client status
- All form labels should be in Bahasa Indonesia
