# Task 8.0: Add Global Error Handling & Validation

## Overview
Implement comprehensive error handling, validation, and business rule enforcement across the entire API.

## Sub-Tasks

### 8.1 Implement Business Logic Validators
- [ ] Add clinic access validation across all services
- [ ] Implement role-based operation validation
- [ ] Add entity relationship validation (therapist-client assignments)

### 8.2 Create Custom Exception Classes
- [ ] Create business-specific exceptions (InsufficientCapacity, InvalidStatusTransition)
- [ ] Add proper error codes matching API documentation

### 8.3 Enhance Global Exception Filter
- [ ] Update filter to handle custom business exceptions
- [ ] Add proper error logging with context
- [ ] Include error code mapping for frontend

### 8.4 Add Input Validation
- [ ] Implement custom validators for phone numbers, emails
- [ ] Add cross-field validation for complex DTOs
- [ ] Include Indonesian-specific validations

### 8.5 Update Response Formats
- [ ] Ensure all responses match ApiResponse/PaginatedResponse format
- [ ] Add consistent error message formatting
- [ ] Include proper HTTP status codes

## Related Files
- `src/common/exceptions/business.exceptions.ts`
- `src/common/exceptions/validation.exceptions.ts`
- `src/common/filters/http-exception.filter.ts`
- `src/common/validators/phone.validator.ts`
- `src/common/validators/email.validator.ts`
- `src/common/validators/indonesian.validator.ts`
- `src/common/guards/clinic-access.guard.ts`

## Dependencies
- Common infrastructure components
- All service and controller modules
- Authentication and authorization system
- Database entities and relationships

## Success Criteria
- All business rules are enforced consistently
- Error messages are helpful and standardized
- Indonesian phone number and address validation works
- Clinic-scoped access is enforced everywhere
- Error codes match frontend expectations
- Proper HTTP status codes are returned
- Error logging provides useful debugging information
- Cross-field validation works for complex forms