# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Smart Therapy project is an Indonesian Hypnotherapy AI System designed to transform manual 2-hour session planning into 15-minute AI-assisted workflows for licensed Indonesian hypnotherapists. The system provides assessment analysis, culturally-appropriate technique recommendations, and automated script generation.

## Architecture Overview

**Tech Stack:**
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui + Zod + Zustand + React Hook Form
- **Backend**: NestJS + TypeScript + MikroORM + PostgreSQL (planned)
- **Database**: PostgreSQL + Redis (caching, planned)
- **AI**: OpenAI API + Custom TypeScript algorithms (planned)

**Current Status**: Frontend application is actively developed with authentication, client management, therapist management, and clinic management features. Backend development is planned.

## Development Commands

### Workspace Commands (from root)
```bash
# Development
pnpm dev                    # Start frontend development server
pnpm dev:frontend           # Start frontend only
pnpm dev:backend           # Start backend only (when implemented)
pnpm dev:all               # Start both frontend and backend

# Building
pnpm build                 # Build both frontend and backend
pnpm build:frontend        # Build frontend only
pnpm build:backend         # Build backend only (when implemented)

# Production
pnpm start                 # Start production servers
pnpm start:frontend        # Start frontend production server
pnpm start:backend         # Start backend production server (when implemented)

# Quality Assurance
pnpm lint                  # Run linting on all workspaces
pnpm lint:fix              # Fix linting issues on all workspaces
pnpm format                # Format code on all workspaces
pnpm format:check          # Check formatting on all workspaces
pnpm type-check            # Run TypeScript checks on all workspaces
pnpm test                  # Run tests on all workspaces
pnpm test:watch            # Run tests in watch mode

# Maintenance
pnpm clean                 # Clean all node_modules and build artifacts
pnpm clean:cache           # Clean build caches
pnpm setup                 # Install all dependencies
pnpm reset                 # Clean and reinstall everything
pnpm pre-commit            # Run pre-commit checks (lint:fix, format, type-check)
```

### Frontend Specific Commands (from frontend/ directory)
```bash
# Development
npm run dev                # Start development server
npm run dev:turbo          # Start development server with turbo
npm run dev:debug          # Start development server with debugging

# Building & Production
npm run build              # Build for production
npm run build:analyze      # Build with bundle analyzer
npm run start              # Start production server
npm run export             # Export static site

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run lint:strict        # Run ESLint with max warnings 0
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting
npm run type-check         # Run TypeScript checks
npm run type-check:watch   # Run TypeScript checks in watch mode

# Maintenance
npm run clean              # Clean build artifacts
npm run clean:cache        # Clean Next.js cache
npm run pre-commit         # Run pre-commit checks
```

## Project Structure

```
smart-therapy/
├── frontend/                    # Next.js 15 application (active development)
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── (auth)/         # Authentication pages
│   │   │   └── portal/         # Main application portal
│   │   ├── components/         # React components
│   │   │   ├── ui/             # Shared UI components (shadcn/ui)
│   │   │   ├── auth/           # Authentication components
│   │   │   ├── clients/        # Client management components
│   │   │   ├── clinic/         # Clinic management components
│   │   │   ├── therapists/     # Therapist management components
│   │   │   ├── layout/         # Layout components
│   │   │   ├── navigation/     # Navigation components
│   │   │   ├── payment/        # Payment components
│   │   │   └── portal/         # Dashboard components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions and configurations
│   │   ├── store/              # Zustand state management
│   │   ├── types/              # TypeScript type definitions
│   │   └── schemas/            # Zod validation schemas
│   ├── SHARED_COMPONENTS_RULES.md  # Component usage guidelines
│   ├── COLORS.md               # Design system colors
│   └── QUICK_REFERENCE.md      # Development quick reference
├── backend/                    # NestJS API server (planned)
├── docs/                       # Project documentation
└── templates/                  # Development templates
```

## Core Architectural Patterns

### 1. Component Architecture
- **Page Wrappers**: Use `PortalPageWrapper` for consistent portal pages, `PageWrapper` for base layouts
- **Shared Components**: DataTable for lists, FormModal for forms, consistent UI components from shadcn/ui
- **Feature Organization**: Components grouped by feature (auth, clients, therapists, clinic)

### 2. State Management
- **Zustand**: Global state management with persistence
- **React Hook Form**: Form state management with Zod validation
- **Custom Hooks**: Feature-specific hooks for data fetching and business logic

### 3. Data Validation
- **Zod Schemas**: All forms and API data validated with Zod
- **Type Safety**: TypeScript strict mode with `z.infer<>` for type inference

### 4. Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Component Variants**: Using `class-variance-authority` for component variants

## Key Development Guidelines

### Frontend Development
- Use React functional components with TypeScript strict mode
- Follow the shared component rules defined in `frontend/SHARED_COMPONENTS_RULES.md`
- Implement proper error handling with toast notifications
- Use Zustand for global state, React state for local component state
- Follow Indonesian cultural considerations in UI/UX (formal language, cultural sensitivity)

### Cultural Requirements
- All content must be in formal Indonesian language
- Consider client demographics (age, gender, religion, province)
- Implement cultural adaptation in AI recommendations
- Respect Indonesian professional standards and ethics

### Code Organization
- Use absolute imports with `@/` prefix
- Follow strict import order: React → Third-party → Internal → Types → Icons
- Implement proper TypeScript typing for all functions and components
- Use Zod schemas for all form validation and API data validation

### Authentication & Authorization
- Role-based access control (Administrator, ClinicAdmin, Therapist)
- JWT-based authentication with Zustand persistence
- Route protection with role guards
- User context managed through auth store

### Data Management Patterns
- API client functions in `lib/api/` with proper error handling
- Custom hooks for feature-specific data operations
- Zustand stores with persistence for global state
- TypeScript interfaces for all data structures

## Important Files to Reference

- `frontend/SHARED_COMPONENTS_RULES.md` - Comprehensive component usage guidelines
- `frontend/COLORS.md` - Design system color palette
- `frontend/QUICK_REFERENCE.md` - Development quick reference
- `docs/prd/prd-indonesian-hypnotherapy-ai-system.md` - Product requirements
- `src/lib/navigation-config.ts` - Navigation and role-based routing configuration
- `src/types/` - TypeScript type definitions for all entities

## Testing Strategy
When implementing tests:
- Write unit tests for utility functions and custom hooks
- Write integration tests for complex components
- Test error scenarios and edge cases
- Mock external dependencies and API calls

## Security & Privacy
- End-to-end encryption for all client data
- GDPR-level privacy controls
- Compliance with Indonesian data protection laws
- Role-based access controls with proper route protection
- Secure API endpoints with rate limiting (when backend is implemented)

## Performance Considerations
- Use React.memo for expensive components
- Implement proper loading states for all async operations
- Use pagination for large datasets (DataTable component)
- Optimize bundle size with dynamic imports where appropriate

## Common Development Patterns

### List Page Pattern
Use `PortalPageWrapper` + `DataTable` combination for consistent list interfaces with search, filtering, and actions.

### Form Modal Pattern  
Use `FormModal` wrapper with React Hook Form and Zod validation for all forms.

### API Integration Pattern
Create dedicated API client functions with proper error handling and TypeScript typing.

### State Management Pattern
Use Zustand stores with persistence and custom hooks for feature-specific data operations.

The project is currently in active frontend development phase with comprehensive authentication, user management, and portal features implemented. Backend development and AI features are planned for future phases.