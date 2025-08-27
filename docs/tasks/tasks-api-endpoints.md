# Smart Therapy API Implementation Tasks

## Relevant Files

### Core Entities
- `src/database/entities/therapist.entity.ts` - Therapist entity with professional credentials and specializations
- `src/database/entities/client.entity.ts` - Client entity with comprehensive demographic data
- `src/database/entities/consultation.entity.ts` - Consultation entity for therapy assessments
- `src/database/entities/therapy-session.entity.ts` - Therapy session entity with AI predictions
- `src/database/entities/client-therapist-assignment.entity.ts` - Junction entity for assignments
- `src/database/entities/client-status-transition.entity.ts` - Audit trail for client status changes
- `src/database/entities/audit-log.entity.ts` - System-wide audit logging

### Authentication & JWT
- `src/auth/auth.module.ts` - Authentication module setup
- `src/auth/auth.controller.ts` - Authentication endpoints (login, logout, refresh)
- `src/auth/auth.service.ts` - Authentication business logic
- `src/auth/jwt.strategy.ts` - JWT authentication strategy
- `src/auth/guards/jwt-auth.guard.ts` - JWT authentication guard
- `src/auth/guards/roles.guard.ts` - Role-based authorization guard
- `src/auth/decorators/roles.decorator.ts` - Roles decorator for endpoints

### Core API Modules
- `src/users/users.module.ts` - User management module
- `src/users/users.controller.ts` - User profile and management endpoints
- `src/users/users.service.ts` - User business logic
- `src/clinics/clinics.module.ts` - Clinic management module
- `src/clinics/clinics.controller.ts` - Clinic endpoints (profile, settings, documents)
- `src/clinics/clinics.service.ts` - Clinic business logic

### Therapist Management
- `src/therapists/therapists.module.ts` - Therapist management module
- `src/therapists/therapists.controller.ts` - Therapist CRUD endpoints
- `src/therapists/therapists.service.ts` - Therapist business logic
- `src/therapists/dto/create-therapist.dto.ts` - Create therapist validation
- `src/therapists/dto/update-therapist.dto.ts` - Update therapist validation

### Client Management
- `src/clients/clients.module.ts` - Client management module
- `src/clients/clients.controller.ts` - Client CRUD and assignment endpoints
- `src/clients/clients.service.ts` - Client business logic
- `src/clients/dto/create-client.dto.ts` - Create client validation
- `src/clients/dto/update-client.dto.ts` - Update client validation

### Therapy Sessions
- `src/sessions/sessions.module.ts` - Therapy session module
- `src/sessions/sessions.controller.ts` - Session management endpoints
- `src/sessions/sessions.service.ts` - Session business logic
- `src/consultations/consultations.module.ts` - Consultation module
- `src/consultations/consultations.controller.ts` - Consultation endpoints

### Common Utilities
- `src/common/dto/pagination.dto.ts` - Pagination query parameters
- `src/common/dto/api-response.dto.ts` - Standard API response format
- `src/common/filters/http-exception.filter.ts` - Global exception handling
- `src/common/interceptors/response.interceptor.ts` - Response transformation
- `src/common/decorators/current-user.decorator.ts` - Current user decorator
- `src/common/pipes/validation.pipe.ts` - Custom validation pipe

### Health & Monitoring
- `src/health/health.module.ts` - Health check module
- `src/health/health.controller.ts` - Health and status endpoints

## Tasks

- [ ] 1.0 Create Missing Database Entities
  - [ ] 1.1 Create Therapist Entity
    - Create `src/database/entities/therapist.entity.ts` with professional credentials
    - Add relationships to User, Clinic, and specializations
    - Include employment type, license info, capacity management
    - Add schedule preferences and status tracking
  - [ ] 1.2 Create Client Entity
    - Create `src/database/entities/client.entity.ts` with comprehensive demographics
    - Add guardian information for minors
    - Include emergency contact details
    - Add status tracking (new → assigned → consultation → therapy → done)
  - [ ] 1.3 Create Therapist Specializations Entity
    - Create `src/database/entities/therapist-specialization.entity.ts`
    - Set up many-to-many relationship with therapists
    - Add validation for specialization types
  - [ ] 1.4 Create Consultation Entity
    - Create `src/database/entities/consultation.entity.ts`
    - Support multiple form types (general, drug_addiction, minor)
    - Add JSONB field for flexible form data storage
    - Include assessment results and treatment recommendations
  - [ ] 1.5 Create Therapy Session Entity
    - Create `src/database/entities/therapy-session.entity.ts`
    - Add AI predictions JSONB field
    - Include session content (notes, techniques, issues)
    - Add status tracking for sessions
  - [ ] 1.6 Create Client-Therapist Assignment Entity
    - Create `src/database/entities/client-therapist-assignment.entity.ts`
    - Track assignment history and status
    - Include assignment reason and transfer tracking
  - [ ] 1.7 Create Audit Log Entity
    - Create `src/database/entities/audit-log.entity.ts`
    - Track all system changes with user, action, and timestamp
    - Store old/new values in JSONB format
  - [ ] 1.8 Update Entities Index
    - Add all new entities to `src/database/entities/index.ts`
    - Update entities array export
    - Ensure proper TypeScript exports

- [ ] 2.0 Set Up Authentication & JWT System
  - [ ] 2.1 Install Required Dependencies
    - Install @nestjs/jwt, @nestjs/passport, passport, passport-jwt
    - Install bcryptjs for password hashing
    - Update package.json and verify installation
  - [ ] 2.2 Create JWT Strategy
    - Create `src/auth/jwt.strategy.ts`
    - Implement JWT token validation
    - Extract user payload and validate against database
  - [ ] 2.3 Create Authentication Guards
    - Create `src/auth/guards/jwt-auth.guard.ts` for JWT validation
    - Create `src/auth/guards/roles.guard.ts` for role-based access
    - Implement clinic-scoped authorization logic
  - [ ] 2.4 Create Role Decorators
    - Create `src/auth/decorators/roles.decorator.ts`
    - Support multiple roles per endpoint
    - Add clinic context validation
  - [ ] 2.5 Create Auth Service
    - Create `src/auth/auth.service.ts`
    - Implement login, logout, token refresh logic
    - Add password validation and JWT token generation
    - Include user role and clinic context in tokens
  - [ ] 2.6 Create Auth Controller
    - Create `src/auth/auth.controller.ts`
    - Implement login, logout, refresh, forgot-password endpoints
    - Add proper DTO validation and error handling
  - [ ] 2.7 Create Auth Module
    - Create `src/auth/auth.module.ts`
    - Configure JWT module with environment variables
    - Register guards and strategies

- [ ] 3.0 Create Core API Infrastructure
  - [ ] 3.1 Create Common DTOs
    - Create `src/common/dto/pagination.dto.ts` with page, pageSize validation
    - Create `src/common/dto/api-response.dto.ts` for standardized responses
    - Create `src/common/dto/id-param.dto.ts` for UUID validation
  - [ ] 3.2 Create Response Interceptor
    - Create `src/common/interceptors/response.interceptor.ts`
    - Transform all responses to standard ApiResponse format
    - Handle success/error response formatting
  - [ ] 3.3 Create Exception Filter
    - Create `src/common/filters/http-exception.filter.ts`
    - Handle all HTTP exceptions with standard error format
    - Log errors with context information
  - [ ] 3.4 Create Custom Decorators
    - Create `src/common/decorators/current-user.decorator.ts`
    - Extract user from JWT token in controllers
    - Add clinic context extraction
  - [ ] 3.5 Create Validation Pipes
    - Create `src/common/pipes/validation.pipe.ts`
    - Enhanced validation with better error messages
    - Support for nested object validation
  - [ ] 3.6 Update App Module Configuration
    - Register global interceptors, filters, and pipes
    - Configure CORS for frontend integration
    - Set up global validation settings

- [ ] 4.0 Implement User & Clinic Management
  - [ ] 4.1 Create User Profile DTOs
    - Create `src/users/dto/update-profile.dto.ts`
    - Create `src/users/dto/change-password.dto.ts`
    - Add proper validation rules for all fields
  - [ ] 4.2 Create Users Service
    - Create `src/users/users.service.ts`
    - Implement profile management (get, update)
    - Add password change functionality
    - Include role and clinic context validation
  - [ ] 4.3 Create Users Controller
    - Create `src/users/users.controller.ts`
    - Implement profile endpoints with proper authorization
    - Add avatar upload endpoint (placeholder for now)
  - [ ] 4.4 Create Clinic Management DTOs
    - Create `src/clinics/dto/update-clinic.dto.ts`
    - Create `src/clinics/dto/update-branding.dto.ts`
    - Create `src/clinics/dto/update-settings.dto.ts`
  - [ ] 4.5 Create Clinics Service
    - Create `src/clinics/clinics.service.ts`
    - Implement clinic profile management
    - Add branding and settings update functionality
    - Include document management placeholders
  - [ ] 4.6 Create Clinics Controller
    - Create `src/clinics/clinics.controller.ts`
    - Implement clinic management endpoints
    - Add proper role-based authorization (clinic_admin only)
  - [ ] 4.7 Create and Configure Modules
    - Create `src/users/users.module.ts`
    - Create `src/clinics/clinics.module.ts`
    - Register services and controllers properly

- [ ] 5.0 Implement Therapist Management APIs
  - [ ] 5.1 Create Therapist DTOs
    - Create `src/therapists/dto/create-therapist.dto.ts`
    - Create `src/therapists/dto/update-therapist.dto.ts`
    - Create `src/therapists/dto/therapist-query.dto.ts` for filtering
    - Add validation for license types, employment types
  - [ ] 5.2 Create Therapist Service
    - Create `src/therapists/therapists.service.ts`
    - Implement CRUD operations with clinic scoping
    - Add therapist capacity management logic
    - Include specialization and certification handling
  - [ ] 5.3 Create Therapist Controller
    - Create `src/therapists/therapists.controller.ts`
    - Implement paginated listing with filters
    - Add CRUD endpoints with proper authorization
    - Include status update and assignment endpoints
  - [ ] 5.4 Add Therapist Assignment Logic
    - Implement client assignment functionality
    - Add capacity validation before assignments
    - Include assignment history tracking
  - [ ] 5.5 Create Therapist Module
    - Create `src/therapists/therapists.module.ts`
    - Register all therapist-related services and controllers

- [ ] 6.0 Implement Client Management APIs
  - [ ] 6.1 Create Client DTOs
    - Create `src/clients/dto/create-client.dto.ts`
    - Create `src/clients/dto/update-client.dto.ts`
    - Create `src/clients/dto/client-query.dto.ts` for filtering
    - Add validation for demographics, guardian info
  - [ ] 6.2 Create Client Service
    - Create `src/clients/clients.service.ts`
    - Implement CRUD operations with clinic scoping
    - Add client status transition logic
    - Include assignment management functionality
  - [ ] 6.3 Create Client Controller
    - Create `src/clients/clients.controller.ts`
    - Implement paginated listing with filters
    - Add CRUD endpoints with proper authorization
    - Include status update and assignment endpoints
  - [ ] 6.4 Implement Status Transition System
    - Add status validation (new → assigned → consultation → therapy → done)
    - Create audit trail for status changes
    - Include business logic for valid transitions
  - [ ] 6.5 Create Client Module
    - Create `src/clients/clients.module.ts`
    - Register all client-related services and controllers

- [ ] 7.0 Implement Therapy Session Management
  - [ ] 7.1 Create Session DTOs
    - Create `src/sessions/dto/create-session.dto.ts`
    - Create `src/sessions/dto/update-session.dto.ts`
    - Create `src/sessions/dto/session-query.dto.ts`
    - Add AI prediction response DTOs
  - [ ] 7.2 Create Session Service
    - Create `src/sessions/sessions.service.ts`
    - Implement session CRUD with therapist-client validation
    - Add session status management
    - Include AI prediction placeholder functionality
  - [ ] 7.3 Create Session Controller
    - Create `src/sessions/sessions.controller.ts`
    - Implement session management endpoints
    - Add session statistics endpoints
    - Include AI prediction endpoints
  - [ ] 7.4 Create Consultation DTOs and Service
    - Create `src/consultations/dto/create-consultation.dto.ts`
    - Create `src/consultations/consultations.service.ts`
    - Support multiple form types with JSONB storage
  - [ ] 7.5 Create Consultation Controller
    - Create `src/consultations/consultations.controller.ts`
    - Implement consultation CRUD endpoints
    - Add form-specific validation logic
  - [ ] 7.6 Create Session Modules
    - Create `src/sessions/sessions.module.ts`
    - Create `src/consultations/consultations.module.ts`

- [ ] 8.0 Add Global Error Handling & Validation
  - [ ] 8.1 Implement Business Logic Validators
    - Add clinic access validation across all services
    - Implement role-based operation validation
    - Add entity relationship validation (therapist-client assignments)
  - [ ] 8.2 Create Custom Exception Classes
    - Create business-specific exceptions (InsufficientCapacity, InvalidStatusTransition)
    - Add proper error codes matching API documentation
  - [ ] 8.3 Enhance Global Exception Filter
    - Update filter to handle custom business exceptions
    - Add proper error logging with context
    - Include error code mapping for frontend
  - [ ] 8.4 Add Input Validation
    - Implement custom validators for phone numbers, emails
    - Add cross-field validation for complex DTOs
    - Include Indonesian-specific validations
  - [ ] 8.5 Update Response Formats
    - Ensure all responses match ApiResponse/PaginatedResponse format
    - Add consistent error message formatting
    - Include proper HTTP status codes

- [ ] 9.0 Implement Health Monitoring
  - [ ] 9.1 Create Health Module
    - Create `src/health/health.module.ts`
    - Install @nestjs/terminus for health checks
  - [ ] 9.2 Create Health Controller
    - Create `src/health/health.controller.ts`
    - Implement /health endpoint with database connectivity check
    - Add /status endpoint with system information
  - [ ] 9.3 Add Database Health Check
    - Configure database connection health check
    - Include response time monitoring
    - Add proper error handling for unhealthy states

## Notes

### Testing Strategy
- Each service should have corresponding unit tests
- Controllers should have integration tests
- Use Jest for testing framework
- Mock external dependencies (database, file upload)

### Security Considerations
- All endpoints require JWT authentication except health checks
- Role-based authorization with clinic scoping
- Input validation and sanitization
- Audit logging for sensitive operations

### Performance Considerations
- Implement pagination for all list endpoints
- Use database indexes for common query patterns
- Optimize queries with proper joins and filtering
- Consider caching for frequently accessed data