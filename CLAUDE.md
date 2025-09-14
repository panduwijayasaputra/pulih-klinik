# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pulih Klinik** is a comprehensive Indonesian hypnotherapy AI system designed to transform manual 2-hour session planning into streamlined 15-minute AI-assisted workflows. The system serves licensed Indonesian hypnotherapists with culturally-appropriate technique recommendations, automated script generation, and comprehensive client management.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Zod validation, Zustand state management, TanStack React Query
- **Backend**: NestJS, TypeScript, MikroORM with PostgreSQL, JWT authentication, Zod validation
- **Development**: pnpm workspaces, ESLint, Prettier, Docker for development

## Development Commands

### Workspace Commands (from root)
```bash
# Development servers
pnpm dev:frontend          # Start frontend dev server (port 3000)
pnpm dev:backend           # Start backend dev server (port 3001)

# Building and production
pnpm build                 # Build both frontend and backend
pnpm build:frontend        # Build frontend only
pnpm build:backend         # Build backend only

# Code quality
pnpm lint                  # Lint all workspaces
pnpm format               # Format code with Prettier (frontend only)
pnpm type-check           # TypeScript type checking (frontend only)

# Testing
pnpm test                 # Run tests on all workspaces
```

### Backend-Specific Commands (from backend/ directory)
```bash
# Development
npm run start:dev         # Start NestJS dev server with watch mode
npm run build            # Build for production
npm run start:prod       # Start production server

# Code quality
npm run lint             # ESLint with auto-fix
npm run format           # Prettier formatting
npm run test             # Jest unit tests
npm run test:e2e         # End-to-end tests

# Database operations
npm run migration:create  # Create new migration
npm run migration:up     # Apply migrations
npm run migration:down   # Rollback migration
npm run seeder:run       # Run demo seeder
npm run db:fresh         # Drop, recreate, and seed database
```

### Frontend-Specific Commands (from frontend/ directory)
```bash
# Development
npm run dev              # Next.js dev server
npm run build           # Build for production
npm run start           # Start production server

# Code quality  
npm run lint            # Next.js ESLint
npm run lint:fix        # Auto-fix linting issues
npm run format          # Prettier formatting
npm run type-check      # TypeScript checking
npm run pre-commit      # Run all quality checks
```

## Architecture Overview

### Monorepo Structure
```
pulih-klinik/
├── frontend/           # Next.js application
├── backend/            # NestJS API server
├── docs/              # Project documentation
└── templates/         # Development templates
```

### Backend Architecture (NestJS)
- **Modular Design**: Each feature has its own module (auth, users, clinics, therapists, clients, sessions, consultations, registration, upload)
- **Database**: MikroORM with PostgreSQL, migration-based schema management
- **Authentication**: JWT-based auth with role-based access control (System Admin, Clinic Admin, Therapist)
- **Validation**: Zod schemas for request validation throughout the application
- **Global Middleware**: Response interceptor, exception filter, validation pipe, throttling

### Frontend Architecture (Next.js)
- **App Router**: Next.js 15 app directory structure with layouts and middleware
- **State Management**: Zustand for client state, TanStack React Query for server state
- **Authentication**: Context-based auth provider with automatic token refresh
- **Forms**: React Hook Form with Zod validation resolvers
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system

## Key Development Patterns

### Backend Validation with Zod
- All DTOs use Zod schemas instead of class-validator decorators
- Custom ZodValidationPipe for request validation
- Type inference using `z.infer<typeof schema>`

### Frontend Type Safety
- Zod schemas shared between forms and API calls
- Automatic type inference for all form data
- React Hook Form integration with zodResolver

### Authentication Flow
- Email verification-based registration for therapists
- License verification for Indonesian hypnotherapists  
- Role-based routing and component access control
- Automatic session management with refresh tokens

### Database Migrations
- MikroORM migrations for schema changes
- Seeders for development data (DemoSeeder class)
- Format: `YYYYMMDDHHMMSS-descriptive-name.ts`

## Cultural Considerations
- **Language**: Formal Indonesian language throughout UI
- **Religious Sensitivity**: Multi-faith adaptations (Islam, Christianity, Hinduism, Buddhism, Catholicism)
- **Healthcare Compliance**: GDPR-level privacy controls and Indonesian data protection compliance
- **Professional Standards**: Alignment with Indonesian hypnotherapy licensing and practices

## Important Files & Locations

### Configuration
- `backend/mikro-orm.config.js` - Database configuration
- `frontend/tailwind.config.js` - UI styling configuration
- `.cursor/rules/` - Development rules for different contexts

### Core Entities
- `backend/src/database/entities/` - Database entity definitions
- User roles: System Admin, Clinic Admin, Therapist
- Client management with unique codes (CLT001, CLT002...)

### Authentication
- `backend/src/auth/` - JWT authentication, guards, decorators
- `frontend/src/providers/AuthProvider.tsx` - Client auth context

### Key Features
- Client assessments (General, Addiction, Minor types)
- AI recommendation engine for hypnotherapy techniques  
- Script generation system (7-phase hypnotherapy scripts)
- Session management and progress tracking

## Security Requirements
- Never expose API keys, tokens, or sensitive data in code
- All client data must be encrypted
- Role-based access controls strictly enforced
- Healthcare data privacy compliance required
- No console logs in production (security-utils handles this)

## Testing Strategy
- Jest unit tests for backend services and utilities
- Frontend component testing with React Testing Library
- Zod schema validation testing
- E2E tests for critical user flows

## Development Workflow
1. Always run linting and type checking before commits
2. Use conventional commit messages
3. Test database migrations before applying
4. Ensure cultural sensitivity in all user-facing content
5. Validate all forms with Zod schemas
6. Follow the established modular architecture patterns

This project prioritizes healthcare data security, cultural sensitivity, and professional hypnotherapy standards while providing a modern, efficient development experience.