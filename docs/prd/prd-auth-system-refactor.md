# Product Requirements Document: Auth System Refactor

## Introduction/Overview

The current authentication system has become overly complex and difficult to maintain, with inconsistent user flows, complex token management, and multiple auth states that are hard to debug. This refactor aims to simplify the authentication system while maintaining security and providing a clear, consistent user experience across all user types.

**Problem Statement:** The existing auth system is too complicated with multiple auth states, inconsistent flows, and difficult maintenance.

**Goal:** Create a streamlined, maintainable authentication system with clear user flows and robust token management.

## Goals

1. **Simplify Authentication Logic:** Reduce complexity by consolidating auth states and flows
2. **Standardize User Experience:** Provide consistent authentication flows across all user types
3. **Improve Maintainability:** Create a system that's easier to debug and extend
4. **Enhance Security:** Implement robust token management with proper refresh mechanisms
5. **Real-time Data Validation:** Ensure auth data stays synchronized with database state
6. **Streamline Onboarding:** Create a clear, resumable onboarding flow for clinic admins

## User Stories

### Registration Flow
- **As a clinic admin**, I want to register with my email and password so that I can access the system
- **As a clinic admin**, I want to verify my email with a code so that my account is secure
- **As a clinic admin**, I want to see a success page after registration so that I know my account is ready

### Login Flow
- **As a system admin**, I want to be redirected to /portal after login so that I can access admin functions
- **As a clinic admin**, I want to be redirected to onboarding if I haven't completed setup so that I can configure my clinic
- **As a clinic admin**, I want to be redirected to /portal after login if my clinic is fully set up so that I can manage my clinic
- **As a therapist**, I want to be redirected to /portal after login so that I can access my work dashboard

### Onboarding Flow
- **As a clinic admin**, I want to complete clinic setup in steps so that I can configure my clinic properly
- **As a clinic admin**, I want to resume onboarding where I left off so that I don't lose my progress
- **As a clinic admin**, I want to select a subscription plan so that I can access the features I need
- **As a clinic admin**, I want to complete payment and see a thank you page so that I know my setup is complete

### Data Validation
- **As any user**, I want my auth data to be validated on page reload so that I always have current information
- **As any user**, I want to be logged out if my clinic is deleted so that I can't access invalid data

## Functional Requirements

### 1. Authentication Data Structure
1.1. The system must provide user info: id, email, name, isActive
1.2. The system must provide clinic info: id, name, isActive, subscription
1.3. The system must provide user roles
1.4. The system must manage access token and refresh token

### 2. Registration Flow
2.1. The system must provide a clinic admin registration form with fields: name, email, password, password confirmation
2.2. The system must validate email format and password strength
2.3. The system must send email verification code after successful registration
2.4. The system must provide an email verification form
2.5. The system must allow users to request a new verification code if needed
2.6. The system must allow admins to manually verify accounts
2.7. The system must show a registration success page with login button after verification

### 3. Login Flow
3.1. The system must authenticate users with email and password
3.2. The system must redirect system admin users to /portal after login
3.3. The system must redirect clinic admin users to onboarding if they lack clinic data or subscription
3.4. The system must redirect clinic admin users to /portal if they have complete clinic and subscription data
3.5. The system must redirect therapist users to /portal after login

### 4. Onboarding Flow
4.1. The system must redirect users to /portal if they have complete clinic and subscription data
4.2. The system must show clinic form if user has no clinic data
4.3. The system must show subscription selector if user has clinic but no subscription
4.4. The system must allow users to resume onboarding where they left off
4.5. The system must provide a payment page after subscription selection
4.6. The system must show a thank you page after payment completion
4.7. The system must redirect to /portal after 5 seconds on thank you page

### 5. Data Validation & Synchronization
5.1. The system must validate auth data on every page reload
5.2. The system must cache user data but validate clinic/subscription status against database
5.3. The system must handle network errors gracefully during auth checks (retry with exponential backoff)
5.4. The system must logout users if their clinic is deleted or deactivated
5.5. The system must use refresh tokens when access tokens expire during session

### 6. Error Handling
6.1. The system must automatically refresh tokens when they expire
6.2. The system must logout users when their clinic is deactivated
6.3. The system must handle network errors during auth validation with retry logic
6.4. The system must provide clear error messages for authentication failures

## Non-Goals (Out of Scope)

1. **Subscription Expiration Handling:** Will be implemented in a future iteration
2. **Multi-factor Authentication:** Not included in this refactor
3. **Social Login Integration:** Only email/password authentication
4. **Password Reset Flow:** Existing flow will remain unchanged
5. **User Profile Management:** Focus is on authentication, not profile features
6. **Audit Logging:** Authentication events logging is out of scope

## Design Considerations

### Frontend Components
- Reuse existing form components where possible
- Implement consistent loading states across all auth flows
- Use existing design system for forms and buttons
- Ensure mobile-responsive design for all auth pages

### State Management
- Centralize auth state in a single store
- Implement proper loading and error states
- Cache user data with validation timestamps
- Handle offline scenarios gracefully

## Technical Considerations

### Backend Integration
- Integrate with existing Auth module
- Use existing user and clinic entities
- Leverage existing subscription system
- Maintain compatibility with current database schema

### Security
- Implement proper token expiration and refresh logic
- Validate all auth data against database on critical operations
- Use secure HTTP-only cookies for refresh tokens
- Implement rate limiting for auth endpoints

### Performance
- Cache user data with appropriate TTL
- Minimize database calls during auth validation
- Implement efficient token refresh mechanism
- Use optimistic updates where appropriate

## Success Metrics

1. **Reduced Complexity:** Decrease in auth-related bug reports by 50%
2. **Improved User Experience:** Reduce onboarding abandonment rate by 30%
3. **Better Performance:** Decrease auth validation time to under 200ms
4. **Enhanced Security:** Zero security incidents related to authentication
5. **Developer Experience:** Reduce time to implement auth-related features by 40%

## Open Questions

1. **Token Storage:** Should refresh tokens be stored in HTTP-only cookies or localStorage?
2. **Onboarding Persistence:** How long should incomplete onboarding data be retained?
3. **Error Recovery:** What specific retry logic should be implemented for network failures?
4. **Migration Strategy:** How should existing users be migrated to the new auth system?
5. **Testing Strategy:** What level of test coverage is required for the refactored auth system?

## Implementation Priority

### Phase 1: Core Auth Refactor
- Simplify auth data structure
- Implement new login/registration flows
- Basic token management

### Phase 2: Onboarding Flow
- Implement resumable onboarding
- Subscription selection and payment integration
- Thank you page and redirect logic

### Phase 3: Data Validation & Error Handling
- Page reload validation
- Network error handling
- Token refresh automation

### Phase 4: Testing & Optimization
- Comprehensive testing
- Performance optimization
- Security audit
