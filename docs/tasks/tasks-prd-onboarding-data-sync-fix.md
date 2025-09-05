# Task List: Onboarding Data Synchronization Fix

Based on PRD: `prd-onboarding-data-sync-fix.md`

## Relevant Files

- `frontend/src/components/onboarding/OnboardingFlow.tsx` - Main onboarding component that orchestrates the flow and needs infinite loop fixes
- `frontend/src/hooks/useOnboarding.ts` - Hook that manages onboarding state and clinic data synchronization
- `frontend/src/hooks/useAuth.ts` - Authentication hook that handles data validation and API calls
- `frontend/src/store/auth.ts` - Zustand store for authentication state management
- `frontend/src/components/onboarding/ValidationStatus.tsx` - New component for validation status indicators
- `frontend/src/components/onboarding/OnboardingSubscriptionForm.tsx` - Subscription form that needs validation triggers
- `frontend/src/components/onboarding/OnboardingPaymentForm.tsx` - Payment form that needs validation triggers
- `frontend/src/lib/api/auth.ts` - API client for authentication endpoints
- `frontend/src/lib/data-sync.ts` - Data synchronization utilities
- `frontend/src/lib/network-error-handler.ts` - Network error handling utilities

### Notes

- Unit tests should be placed alongside the code files they are testing
- Use `pnpm test` to run tests in the frontend directory
- Focus on preventing infinite loops while maintaining data synchronization
- Ensure all changes are backward compatible with existing onboarding flows

## Tasks

- [ ] 1.0 Fix Infinite Loop Issues in OnboardingFlow
  - [x] 1.1 Remove circular dependencies from OnboardingFlow useEffect hooks
    - Remove `currentStep` from validation useEffect dependencies to prevent loops
    - Remove `getCurrentStep` function from useEffect dependencies
    - Ensure validation only triggers on page load, not on step changes
  - [x] 1.2 Fix useOnboarding hook state synchronization
    - Update useOnboarding to get clinic data directly from auth store
    - Remove circular dependencies between clinic data changes and step updates
    - Add proper state synchronization without triggering validation loops
  - [x] 1.3 Implement proper validation guards in useAuth hook
    - Add `isValidating` flag to prevent concurrent validation calls
    - Ensure validation only runs when not already in progress
    - Add proper error handling for validation failures

- [x] 2.0 Implement Smart Validation Triggers for Critical Steps
  - [x] 2.1 Add validation trigger for subscription step entry
    - Create useEffect in OnboardingSubscriptionForm that validates on component mount
    - Ensure validation only runs once per session to prevent loops
    - Add proper loading states during validation
  - [x] 2.2 Add validation trigger for payment step entry
    - Create useEffect in OnboardingPaymentForm that validates on component mount
    - Implement same pattern as subscription step validation
    - Ensure consistent validation behavior across critical steps
  - [x] 2.3 Implement stale data validation
    - Add validation trigger when data is older than 5 minutes
    - Ensure stale data validation doesn't conflict with step-based validation
    - Add proper caching mechanisms to prevent unnecessary API calls

- [x] 3.0 Add Clinic Deletion Detection and Automatic Redirection
  - [x] 3.1 Enhance data sync handler for clinic deletion
    - Update createAuthDataSyncHandler to properly detect clinic deletion
    - Ensure clinic data is cleared when deletion is detected
    - Add proper logging for clinic deletion events
  - [x] 3.2 Implement automatic redirection logic
    - Add logic to redirect users to clinic form when clinic is deleted
    - Ensure redirection happens after clinic data is cleared
    - Add proper state management for redirection flow
  - [x] 3.3 Update onboarding step validation
    - Ensure getCurrentStep returns correct step when clinic is deleted
    - Update step synchronization logic to handle clinic deletion
    - Add proper error handling for invalid step states

- [ ] 4.0 Create Validation Status Indicators and Manual Refresh
  - [ ] 4.1 Create ValidationStatus component
    - Create new component to show validation status (idle, validating, success, error)
    - Add loading indicators and error messages
    - Implement non-intrusive status display
  - [ ] 4.2 Add manual refresh functionality
    - Add refresh button to onboarding header
    - Implement manual validation trigger
    - Add proper loading states during manual refresh
  - [ ] 4.3 Integrate ValidationStatus with OnboardingFlow
    - Add ValidationStatus component to OnboardingFlow
    - Connect validation status to auth store state
    - Ensure proper positioning and styling

- [ ] 5.0 Enhance Error Handling and User Feedback
  - [ ] 5.1 Improve error messages for validation failures
    - Add user-friendly error messages for different validation scenarios
    - Implement retry options for failed validations
    - Add proper error logging for debugging
  - [ ] 5.2 Add comprehensive error boundaries
    - Create onboarding-specific error boundary
    - Handle validation errors gracefully
    - Provide fallback UI for error states
  - [ ] 5.3 Implement performance optimizations
    - Add proper loading states that don't block user interactions
    - Implement efficient API call patterns
    - Add performance monitoring for validation operations
