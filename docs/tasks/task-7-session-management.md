# Task 7.0: Implement Therapy Session Management

## Overview
Create therapy session and consultation management system with AI prediction support and flexible form handling.

## Sub-Tasks

### 7.1 Create Session DTOs
- [x] Create `src/sessions/dto/create-session.dto.ts`
- [x] Create `src/sessions/dto/update-session.dto.ts`
- [x] Create `src/sessions/dto/session-query.dto.ts`
- [x] Add AI prediction response DTOs

### 7.2 Create Session Service
- [x] Create `src/sessions/sessions.service.ts`
- [x] Implement session CRUD with therapist-client validation
- [x] Add session status management
- [x] Include AI prediction placeholder functionality

### 7.3 Create Session Controller
- [x] Create `src/sessions/sessions.controller.ts`
- [x] Implement session management endpoints
- [x] Add session statistics endpoints
- [x] Include AI prediction endpoints

### 7.4 Create Consultation DTOs and Service
- [x] Create `src/consultations/dto/create-consultation.dto.ts`
- [x] Create `src/consultations/consultations.service.ts`
- [x] Support multiple form types with JSONB storage

### 7.5 Create Consultation Controller
- [x] Create `src/consultations/consultations.controller.ts`
- [x] Implement consultation CRUD endpoints
- [x] Add form-specific validation logic

### 7.6 Create Session Modules
- [x] Create `src/sessions/sessions.module.ts`
- [x] Create `src/consultations/consultations.module.ts`

## Related Files
- `src/sessions/sessions.module.ts`
- `src/sessions/sessions.controller.ts`
- `src/sessions/sessions.service.ts`
- `src/sessions/dto/create-session.dto.ts`
- `src/sessions/dto/update-session.dto.ts`
- `src/sessions/dto/session-query.dto.ts`
- `src/consultations/consultations.module.ts`
- `src/consultations/consultations.controller.ts`
- `src/consultations/consultations.service.ts`
- `src/consultations/dto/create-consultation.dto.ts`

## Dependencies
- TherapySession and Consultation entities
- Client and Therapist entities for validation
- Authentication and authorization system
- Common infrastructure components
- AI prediction system (placeholder initially)

## Success Criteria
- Session CRUD operations validate therapist-client relationships
- Session status transitions work properly
- AI predictions can be stored and retrieved (placeholder)
- Consultation forms support multiple types (general, drug addiction, minor)
- JSONB storage works for flexible form data
- Session statistics endpoints return accurate data
- All endpoints are properly authorized and clinic-scoped
- Session scheduling validates therapist availability