# Frontend Registration Flow Tasks

This directory contains the individual task files for updating the registration flow to match the terapintar PRD requirements. All tasks use mock APIs for development and include comprehensive testing.

## Task Overview

The registration flow needs to be updated from a subscription-based model to a token-based model with email verification and proper payment integration.

## Task Files

### 1. [Registration Flow Structure](./1.0-registration-flow-structure.md)
**Priority: High**
- Update registration step types and flow order
- Add verification and summary steps
- Update registration store for new flow
- Update progress tracking and UI

**Files to modify:**
- `frontend/src/components/auth/RegisterFlow.tsx`
- `frontend/src/store/registration.ts`
- `frontend/src/types/registration.ts`

### 2. [Email Verification System](./2.0-email-verification-system.md)
**Priority: High**
- Create EmailVerification component
- Update ClinicForm to trigger email verification
- Add verification API integration
- Implement rate limiting and error handling

**Files to create/modify:**
- `frontend/src/components/auth/EmailVerification.tsx`
- `frontend/src/components/auth/ClinicForm.tsx`
- `frontend/src/hooks/useRegistration.ts`

### 3. [Registration Summary Component](./3.0-registration-summary-component.md)
**Priority: High**
- Create RegistrationSummary component
- Update pricing structure to token-based model
- Update business rules display
- Add terms and conditions acceptance

**Files to create/modify:**
- `frontend/src/components/auth/RegistrationSummary.tsx`
- `frontend/src/types/registration.ts`
- `frontend/src/store/registration.ts`

### 4. [Payment Integration](./4.0-payment-integration.md)
**Priority: High**
- Integrate Midtrans payment gateway
- Update PaymentModal for token-based model
- Add payment verification and account activation
- Implement payment status tracking

**Files to create/modify:**
- `frontend/src/components/payment/PaymentModal.tsx`
- `frontend/src/lib/midtrans.ts`
- `frontend/src/hooks/usePayment.ts`

### 5. [Therapist Registration Flow](./5.0-therapist-registration-flow.md)
**Priority: Medium**
- Create therapist invitation system
- Create therapist registration component
- Add therapist management features
- Implement invitation tracking

**Files to create/modify:**
- `frontend/src/components/auth/TherapistRegistration.tsx`
- `frontend/src/components/dashboard/TherapistForm.tsx`
- `frontend/src/hooks/useTherapist.ts`

### 6. [Testing and Validation](./6.0-testing-and-validation.md)
**Priority: Medium**
- Create comprehensive unit tests
- Add integration tests
- Add user acceptance testing
- Implement test coverage requirements

**Files to create:**
- `frontend/src/components/auth/RegisterFlow.test.tsx`
- `frontend/src/components/auth/EmailVerification.test.tsx`
- `frontend/src/components/auth/RegistrationSummary.test.tsx`
- `frontend/src/components/payment/PaymentModal.test.tsx`

## Implementation Order

1. **Start with Task 1.0** - Update the basic flow structure
2. **Continue with Task 2.0** - Implement email verification
3. **Proceed with Task 3.0** - Create registration summary
4. **Complete with Task 4.0** - Update payment integration
5. **Add Task 5.0** - Implement therapist registration
6. **Finish with Task 6.0** - Add comprehensive testing

## Key Changes from Current Implementation

### Current Flow (Wrong)
```
Clinic Form → Subscription Selection → Payment → Complete
```

### New Flow (Correct)
```
Clinic Form → Email Verification → Registration Summary → Payment → Complete
```

### Pricing Model Changes

**Current (Wrong):**
- Subscription tiers: Alpha (Rp 50,000), Beta (Rp 100,000), Gamma (Rp 300,000)
- Monthly billing
- Feature-based limits

**New (Correct):**
- Registration fee: IDR 100,000 (includes 3 tokens)
- Token-based pricing: IDR 20,000 per additional token
- Pay-per-session model
- Business rules: Max 3 therapists, max 5 new clients per day

## Mock API Usage

All tasks include mock API implementations for development:

```typescript
// Example mock API usage
export const mockSendVerificationEmail = async (email: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: 'Verification email sent' };
};
```

## Testing Requirements

- Unit tests for all components
- Integration tests for complete flows
- User acceptance testing
- 80% code coverage minimum
- Accessibility testing
- Responsive design testing

## Development Guidelines

1. **Use TypeScript** - All new code must be typed
2. **Follow React patterns** - Use functional components and hooks
3. **Use Zod validation** - All forms must use Zod schemas
4. **Use Tailwind CSS** - Follow existing design system
5. **Use mock APIs** - Don't depend on backend during development
6. **Write tests** - Include tests for all new functionality
7. **Follow accessibility** - Ensure WCAG compliance
8. **Use responsive design** - Mobile-first approach

## Getting Started

1. Read through all task files to understand the complete scope
2. Start with Task 1.0 to update the basic flow structure
3. Implement tasks in order for best results
4. Use the mock data provided in each task file
5. Run tests after completing each task
6. Update documentation as you go

## Dependencies

Make sure to install these packages if not already present:

```bash
npm install @midtrans/midtrans-js
npm install @testing-library/react @testing-library/jest-dom
npm install jest jest-environment-jsdom
```

## Questions or Issues

If you encounter any issues or have questions about the implementation:

1. Check the mock data and examples in each task file
2. Review the testing examples for implementation patterns
3. Ensure you're following the TypeScript and React patterns
4. Verify that all Zod schemas are properly defined
5. Test each component thoroughly before moving to the next task
