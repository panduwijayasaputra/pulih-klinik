# Task 4.0: Implement User & Clinic Management

## Overview
Create user profile management and clinic administration endpoints with proper authorization and validation.

## Sub-Tasks

### 4.1 Create User Profile DTOs
- [x] Create `src/users/dto/update-profile.dto.ts`
- [x] Create `src/users/dto/change-password.dto.ts`
- [x] Add proper validation rules for all fields

### 4.2 Create Users Service
- [x] Create `src/users/users.service.ts`
- [x] Implement profile management (get, update)
- [x] Add password change functionality
- [x] Include role and clinic context validation

### 4.3 Create Users Controller
- [x] Create `src/users/users.controller.ts`
- [x] Implement profile endpoints with proper authorization
- [x] Add avatar upload endpoint (placeholder for now)

### 4.4 Create Clinic Management DTOs
- [x] Create `src/clinics/dto/update-clinic.dto.ts`
- [x] Create `src/clinics/dto/update-branding.dto.ts`
- [x] Create `src/clinics/dto/update-settings.dto.ts`

### 4.5 Create Clinics Service
- [x] Create `src/clinics/clinics.service.ts`
- [x] Implement clinic profile management
- [x] Add branding and settings update functionality
- [x] Include document management placeholders

### 4.6 Create Clinics Controller
- [x] Create `src/clinics/clinics.controller.ts`
- [x] Implement clinic management endpoints
- [x] Add proper role-based authorization (clinic_admin only)

### 4.7 Create and Configure Modules
- [x] Create `src/users/users.module.ts`
- [x] Create `src/clinics/clinics.module.ts`
- [x] Register services and controllers properly

## Related Files
- `src/users/users.module.ts`
- `src/users/users.controller.ts`
- `src/users/users.service.ts`
- `src/users/dto/update-profile.dto.ts`
- `src/users/dto/change-password.dto.ts`
- `src/clinics/clinics.module.ts`
- `src/clinics/clinics.controller.ts`
- `src/clinics/clinics.service.ts`
- `src/clinics/dto/update-clinic.dto.ts`
- `src/clinics/dto/update-branding.dto.ts`
- `src/clinics/dto/update-settings.dto.ts`

## Dependencies
- Authentication system and guards
- User, UserProfile, and Clinic entities
- Common infrastructure (DTOs, interceptors)
- File upload capabilities (for avatars and documents)

## Success Criteria
- User profile management works with proper validation
- Password change functionality is secure and validated
- Clinic profile updates are restricted to authorized users
- Branding and settings can be updated independently
- All endpoints return standardized API responses
- Role-based authorization prevents unauthorized access