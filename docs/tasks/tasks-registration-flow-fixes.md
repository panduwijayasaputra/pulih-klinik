# Registration Flow Fixes - Task List

## Relevant Files

- `frontend/src/components/auth/RegisterFlow.tsx` - Main registration flow component that needs to be updated to match PRD requirements
- `frontend/src/components/auth/ClinicForm.tsx` - Clinic information form that needs email verification step
- `frontend/src/components/auth/EmailVerification.tsx` - New component needed for email verification step
- `frontend/src/components/auth/RegistrationSummary.tsx` - New component needed for registration summary before payment
- `frontend/src/components/payment/PaymentModal.tsx` - Payment component that needs Midtrans integration
- `frontend/src/store/registration.ts` - Registration store that needs updated flow and state management
- `frontend/src/types/registration.ts` - Types and schemas that need updates for new flow
- `frontend/src/lib/api.ts` - API client that needs registration endpoints
- `frontend/src/hooks/useRegistration.ts` - New hook for registration API calls
- `frontend/src/components/auth/RegisterFlow.test.tsx` - Unit tests for RegisterFlow component
- `frontend/src/components/auth/EmailVerification.test.tsx` - Unit tests for EmailVerification component
- `frontend/src/components/auth/RegistrationSummary.test.tsx` - Unit tests for RegistrationSummary component

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Update Registration Flow Structure
  - [ ] 1.1 Update registration step types and flow order
    - Update `RegistrationStep` type to include 'verification' and 'summary' steps
    - Change flow order to: clinic → verification → summary → payment → complete
    - Update step titles and descriptions in RegisterFlow component
  - [ ] 1.2 Update registration store for new flow
    - Add verification step state management
    - Add email verification data storage
    - Update step navigation logic for new flow
    - Add verification code validation methods
  - [ ] 1.3 Update progress tracking and UI
    - Update progress bar to show 5 steps instead of 4
    - Update step numbers and percentages
    - Update navigation buttons and back functionality

- [ ] 2.0 Implement Email Verification System
  - [ ] 2.1 Create EmailVerification component
    - Create new component with verification code input
    - Add resend verification code functionality
    - Add countdown timer for resend cooldown
    - Add proper error handling and validation
  - [ ] 2.2 Update ClinicForm to trigger email verification
    - Modify form submission to send verification email
    - Add loading state during email sending
    - Add success/error feedback for email sending
  - [ ] 2.3 Add verification API integration
    - Create API endpoints for sending verification emails
    - Create API endpoints for verifying codes
    - Add proper error handling for verification failures
    - Add rate limiting for verification attempts

- [ ] 3.0 Create Registration Summary Component
  - [ ] 3.1 Create RegistrationSummary component
    - Display clinic information summary
    - Show selected subscription tier details
    - Display pricing breakdown (registration fee + tokens)
    - Add edit functionality to go back to previous steps
  - [ ] 3.2 Update pricing structure to match PRD
    - Change from subscription model to token-based model
    - Update pricing to IDR 100,000 registration fee (includes 3 tokens)
    - Remove monthly subscription tiers
    - Add token package information
  - [ ] 3.3 Update business rules display
    - Show therapist limit (max 3 therapists per clinic)
    - Show client limit (max 5 new clients per clinic per day)
    - Display token usage information
    - Add terms and conditions acceptance

- [ ] 4.0 Update Payment Integration
  - [ ] 4.1 Integrate Midtrans payment gateway
    - Replace mock payment with actual Midtrans integration
    - Add Midtrans SDK and configuration
    - Implement payment status tracking
    - Add payment success/failure handling
  - [ ] 4.2 Update PaymentModal for token-based model
    - Change from subscription payment to registration fee payment
    - Update payment amount to IDR 100,000
    - Add token package information display
    - Update payment instructions for registration fee
  - [ ] 4.3 Add payment verification and account activation
    - Implement payment status checking
    - Add automatic account activation on successful payment
    - Add manual verification process for bank transfers
    - Add payment confirmation email

- [ ] 5.0 Update Types and Schemas
  - [ ] 5.1 Update registration types for new flow
    - Add verification step types and interfaces
    - Update clinic data schema to include verification fields
    - Remove subscription-related types
    - Add token-based pricing types
  - [ ] 5.2 Update validation schemas
    - Add email verification schema
    - Update clinic data validation for new requirements
    - Add registration summary validation
    - Update payment schema for registration fee
  - [ ] 5.3 Add new constants and configurations
    - Add verification code configuration
    - Add token pricing constants
    - Add business rule constants
    - Add Midtrans configuration

- [ ] 6.0 Implement API Integration
  - [ ] 6.1 Create registration API endpoints
    - Add clinic registration endpoint
    - Add email verification endpoints
    - Add payment integration endpoints
    - Add account activation endpoints
  - [ ] 6.2 Add proper error handling
    - Add API error handling for all registration steps
    - Add retry mechanisms for failed requests
    - Add user-friendly error messages
    - Add logging for debugging
  - [ ] 6.3 Add loading states and feedback
    - Add loading indicators for all API calls
    - Add success/error feedback for each step
    - Add progress indicators for long operations
    - Add timeout handling for slow responses

- [ ] 7.0 Update Therapist Registration Flow
  - [ ] 7.1 Create therapist invitation system
    - Add therapist invitation form in clinic dashboard
    - Add email invitation functionality
    - Add invitation link generation
    - Add invitation status tracking
  - [ ] 7.2 Create therapist registration component
    - Create separate therapist registration flow
    - Add password setup functionality
    - Add profile completion form
    - Add invitation code validation
  - [ ] 7.3 Add therapist management
    - Add therapist account activation
    - Add therapist profile management
    - Add therapist-client assignment
    - Add therapist performance tracking

- [ ] 8.0 Add Testing and Validation
  - [ ] 8.1 Create comprehensive unit tests
    - Test all registration flow components
    - Test email verification functionality
    - Test payment integration
    - Test error handling scenarios
  - [ ] 8.2 Add integration tests
    - Test complete registration flow
    - Test API integration
    - Test payment gateway integration
    - Test email verification flow
  - [ ] 8.3 Add user acceptance testing
    - Test registration flow from user perspective
    - Test error scenarios and recovery
    - Test payment success/failure flows
    - Test email verification scenarios

- [ ] 9.0 Update Documentation and Help
  - [ ] 9.1 Update user documentation
    - Create registration flow guide
    - Add troubleshooting section
    - Add FAQ for common issues
    - Add video tutorials
  - [ ] 9.2 Add in-app help and tooltips
    - Add contextual help for each step
    - Add tooltips for form fields
    - Add progress indicators with explanations
    - Add success/error message explanations
  - [ ] 9.3 Update developer documentation
    - Document new registration flow architecture
    - Document API integration points
    - Document payment gateway integration
    - Document testing procedures

- [ ] 10.0 Performance and Security Improvements
  - [ ] 10.1 Add security measures
    - Add CSRF protection for forms
    - Add rate limiting for API calls
    - Add input sanitization
    - Add secure session management
  - [ ] 10.2 Optimize performance
    - Add lazy loading for components
    - Add caching for static data
    - Add debouncing for form inputs
    - Add optimistic updates where appropriate
  - [ ] 10.3 Add monitoring and analytics
    - Add registration flow analytics
    - Add error tracking and reporting
    - Add performance monitoring
    - Add user behavior tracking
