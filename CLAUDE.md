# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pulih Klinik is an Indonesian Hypnotherapy AI System built with a modern full-stack architecture:
- **Backend**: NestJS with TypeScript, MikroORM (PostgreSQL), and Zod validation
- **Frontend**: Next.js 15 with React 19, TypeScript, TailwindCSS, and Zod validation
- **Purpose**: Platform for therapist clinics to manage hypnotherapy sessions, clients, and consultations

## Common Development Commands

### Backend Commands (run from `backend/` directory)
```bash
# Development
npm run start:dev              # Start development server with hot reload
npm run build                  # Build for production
npm run start:prod             # Run production build

# Database & Migrations
npm run migration:create       # Create new migration
npm run migration:up           # Run pending migrations
npm run migration:down         # Rollback last migration
npm run db:fresh               # Drop, recreate schema, and seed database

# Testing & Code Quality
npm run test                   # Run unit tests
npm run test:e2e              # Run e2e tests
npm run lint                   # Lint and fix code
npm run format                 # Format code with Prettier

# Run specific test file
npm run test -- src/auth/auth.service.spec.ts
```

### Frontend Commands (run from `frontend/` directory)
```bash
# Development
npm run dev                    # Start Next.js dev server
npm run build                  # Build for production
npm run start                  # Run production build

# Code Quality
npm run lint                   # Lint code
npm run lint:fix               # Lint and fix
npm run format                 # Format with Prettier
npm run type-check             # TypeScript type checking

# Pre-commit (runs all checks)
npm run pre-commit
```

## High-Level Architecture

### Backend Architecture (NestJS)

1. **Module Structure**: Each feature has its own module in `backend/src/`
   - `auth/` - JWT authentication, login, password reset
   - `users/` - User management and profiles
   - `clinics/` - Clinic registration and management
   - `therapists/` - Therapist accounts and specializations
   - `clients/` - Client management and assignments
   - `sessions/` - Therapy session tracking
   - `consultations/` - Consultation forms and data
   - `registration/` - Multi-step registration flow with email verification
   - `upload/` - File upload handling

2. **Database Layer**: MikroORM with PostgreSQL
   - Entities in `database/entities/`
   - Migrations in `database/migrations/`
   - Seeders in `database/seeders/`
   - Relations: User -> Clinic -> Therapists -> Clients -> Sessions

3. **Authentication & Authorization**:
   - JWT-based authentication with refresh tokens
   - Role-based access control (Admin, Clinic, Therapist)
   - Guards: `JwtAuthGuard`, `RolesGuard`, `SelfOrAdminGuard`
   - Decorators: `@RequireRole()`, `@CurrentUser()`

4. **Validation**: Zod schemas for all DTOs
   - Schema files alongside DTOs
   - Custom `ZodValidationPipe` for request validation
   - Type inference with `z.infer<>`

5. **Global Configuration**:
   - Response interceptor for consistent API responses
   - Global exception filter for error handling
   - Validation pipe for request validation
   - Throttling for rate limiting

### Frontend Architecture (Next.js)

1. **App Router Structure** (`src/app/`):
   - `(auth)/` - Public authentication pages
   - `portal/` - Protected dashboard area
     - `admin/` - Admin-only pages
     - `clinic/` - Clinic management pages
     - `therapist/` - Therapist pages
   - `onboarding/` - New user onboarding flow

2. **Component Organization** (`src/components/`):
   - `ui/` - Reusable shadcn/ui components
   - `auth/` - Authentication components
   - `clients/`, `therapists/`, `clinic/` - Feature-specific components
   - `layout/` - Layout components (Sidebar, Navigation)
   - `forms/` - Form components

3. **State Management**:
   - Zustand stores in `src/store/` for client state
   - React Query for server state management
   - Custom hooks in `src/hooks/` for business logic

4. **API Integration** (`src/lib/api/`):
   - Typed API client functions
   - Axios with interceptors for auth
   - Mock implementations for development

5. **Validation**: Zod schemas in `src/schemas/`
   - Form validation with react-hook-form + zodResolver
   - Shared validation logic between frontend and API calls

## Key Patterns & Conventions

### Backend Patterns
- Use dependency injection for all services
- Keep controllers thin - business logic in services
- Use Zod for validation, not class-validator
- Always use transactions for multi-table operations
- Return consistent API responses via interceptor

### Frontend Patterns
- Server Components by default, Client Components when needed
- Use React Query for all data fetching
- Form handling with react-hook-form + Zod
- Error boundaries for error handling
- Responsive-first design with TailwindCSS

### Security Considerations
- JWT tokens stored in httpOnly cookies
- CORS configured for frontend URL only
- Rate limiting on all endpoints
- Input validation on both frontend and backend
- SQL injection prevention via ORM
- XSS prevention via React's built-in protections

## Important Cursor Rules Integration

### Backend Development (from .cursor/rules/backend-specific.mdc)
- Use Zod for all validation and type generation
- Follow NestJS modular architecture
- Use kebab-case for file names
- Keep business logic in services
- Use dependency injection
- No `any` types - use Zod inference

### Frontend Development (from .cursor/rules/frontend_specific.mdc)
- Functional components only
- TypeScript strict mode required
- TailwindCSS for styling
- Zod validation for forms
- React Query for data fetching
- Proper error boundaries

### Project Boundaries (from .cursor/rules/project_boundary.mdc)
- **CRITICAL**: Never modify files outside `/Users/panduwijaya/Development/pulih-klinik`
- All operations must stay within project root
- No system-wide installations or global modifications

## Database Schema Overview

Key entities and relationships:
- **User**: Base authentication entity
- **Clinic**: Has many therapists and clients
- **Therapist**: Belongs to clinic, has many clients
- **Client**: Belongs to clinic, assigned to therapists
- **TherapySession**: Tracks sessions between therapist and client
- **Consultation**: Initial consultation data for clients

## Testing Strategy

### Backend Testing
- Unit tests for services with mocked dependencies
- E2E tests for API endpoints
- Test database migrations in isolation
- Mock external services (email, file upload)

### Frontend Testing
- Component testing with React Testing Library
- Integration tests for critical user flows
- Mock API responses for consistent testing
- Accessibility testing for all components

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - development/production
- `PORT` - Server port (default: 3001 for backend, 3000 for frontend)