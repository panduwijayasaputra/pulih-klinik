# Task List: Clinic Management Implementation

**Based on:** `docs/terapintar_prd.md` - Section 3.1 Clinic Management  
**Generated:** 2025-01-27  
**Target:** Junior Developer Implementation Guide

## Relevant Files

- `frontend/src/components/clinic/ClinicProfileForm.tsx` - Main component for clinic profile management ✅
- `frontend/src/components/clinic/ClinicProfileForm.test.tsx` - Unit tests for clinic profile form ✅
- `frontend/src/components/clinic/DocumentUpload.tsx` - Component for handling document uploads ✅
- `frontend/src/components/clinic/DocumentUpload.test.tsx` - Unit tests for document upload component ✅
- `frontend/src/components/clinic/DocumentManager.tsx` - Document list, filter, download, delete UI ✅
- `frontend/src/components/clinic/DocumentManager.test.tsx` - Unit tests for document management UI ✅
- `frontend/src/app/portal/clinic/profile/page.tsx` - Clinic profile page ✅
- `frontend/src/app/portal/clinic/profile/page.test.tsx` - Unit tests for clinic profile page ✅
- `frontend/src/types/clinic.ts` - TypeScript interfaces for clinic data ✅
- `frontend/src/hooks/useClinic.ts` - Custom hook for clinic operations ✅
- `frontend/src/lib/api/clinic.ts` - API functions for clinic management ✅
- `frontend/src/lib/api/clinic.test.ts` - Unit tests for clinic API functions ✅
- `frontend/src/store/clinic.ts` - State management for clinic data

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `ClinicProfileForm.tsx` and `ClinicProfileForm.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- The clinic profile should be editable by Clinic Administrators only.
- Document upload should support common file formats (PDF, JPG, PNG) with size limits.
- All clinic data should be validated both on frontend and backend.

## Tasks

- [x] 1.0 Frontend Clinic Profile Management UI
  - [x] 1.1 Create TypeScript interfaces for clinic data
    - Define `ClinicProfile` interface with all required fields (name, address, phone, working hours, logo, description, email, website)
    - Create `ClinicProfileFormData` interface for form handling
    - Add validation schemas using Zod for form validation
    - Place in `frontend/src/types/clinic.ts`
  - [x] 1.2 Create clinic API functions
    - Implement `getClinicProfile()` function to fetch clinic data
    - Implement `updateClinicProfile()` function to save clinic changes
    - Add proper error handling and loading states
    - Place in `frontend/src/lib/api/clinic.ts`
    - Create corresponding test file `frontend/src/lib/api/clinic.test.ts`
  - [x] 1.3 Create custom hook for clinic operations
    - Implement `useClinic()` hook with state management for clinic data
    - Include loading, error, and success states
    - Add functions for fetching and updating clinic profile
    - Place in `frontend/src/hooks/useClinic.ts`
  - [x] 1.4 Build clinic profile form component
    - Create form with all clinic profile fields using React Hook Form
    - Implement proper validation using Zod schemas
    - Add file upload for clinic logo with preview
    - Include save/cancel buttons with proper loading states
    - Place in `frontend/src/components/clinic/ClinicProfileForm.tsx`
    - Create corresponding test file `frontend/src/components/clinic/ClinicProfileForm.test.tsx`
  - [x] 1.5 Create clinic profile page
    - Build page layout with clinic profile form
    - Add breadcrumb navigation
    - Implement responsive design for mobile and desktop
    - Add role-based access control (Clinic Admin only)
    - Place in `frontend/src/app/portal/clinic/profile/page.tsx`
    - Create corresponding test file `frontend/src/app/portal/clinic/profile/page.test.tsx`

- [x] 2.0 Frontend Document Upload System
  - [x] 2.1 Create document upload component
    - Build drag-and-drop file upload interface
    - Support multiple file formats (PDF, JPG, PNG)
    - Implement file size validation (max 5MB per file)
    - Add file preview and remove functionality
    - Show upload progress indicator
    - Place in `frontend/src/components/clinic/DocumentUpload.tsx`
    - Create corresponding test file `frontend/src/components/clinic/DocumentUpload.test.tsx`
  - [x] 2.2 Implement document management features
    - Add document list view with file names and upload dates
    - Implement document deletion functionality
    - Add document download capability
    - Include document type categorization (certifications, licenses)
    - Add proper error handling for upload failures
  - [x] 2.3 Create document upload API functions
    - Implement `uploadDocument()` function for file uploads ✅ (as `uploadClinicDocument`)
    - Implement `getDocuments()` function to fetch uploaded documents ✅ (as `getClinicDocuments`)
    - Implement `deleteDocument()` function for document removal ✅ (as `deleteClinicDocument`)
    - Add proper multipart form data handling
    - Update `frontend/src/lib/api/clinic.ts` with new functions
    - Update corresponding test file

- [ ] 3.0 State Management and Integration
  - [x] 3.1 Set up clinic state management
    - Create clinic store using Zustand or similar state management
    - Implement actions for loading, updating, and error handling
    - Add persistence for clinic data
    - Place in `frontend/src/store/clinic.ts`
  - [ ] 3.2 Integrate components and pages
    - Connect clinic profile form with API and state management
    - Integrate document upload with clinic profile page
    - Add proper loading and error states throughout the UI
    - Implement optimistic updates for better UX
  - [ ] 3.3 Add form validation and error handling
    - Implement comprehensive form validation for all clinic fields
    - Add proper error messages and field highlighting
    - Handle API errors gracefully with user-friendly messages
    - Add success notifications for successful operations

- [ ] 4.0 Testing and Quality Assurance
  - [ ] 4.1 Write comprehensive unit tests
    - Test all clinic components with proper mocking
    - Test API functions with mock responses
    - Test form validation and error handling
    - Test document upload functionality
    - Ensure test coverage is above 80%
  - [ ] 4.2 Perform integration testing
    - Test complete clinic profile update flow
    - Test document upload and management flow
    - Test error scenarios and edge cases
    - Verify role-based access control works correctly
  - [ ] 4.3 Add accessibility features
    - Ensure all form fields have proper labels and ARIA attributes
    - Add keyboard navigation support
    - Test with screen readers
    - Ensure color contrast meets WCAG guidelines
