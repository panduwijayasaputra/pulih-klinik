# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Smart Therapy project is an Indonesian Hypnotherapy AI System designed to transform manual 2-hour session planning into 15-minute AI-assisted workflows for licensed Indonesian hypnotherapists. The system provides assessment analysis, culturally-appropriate technique recommendations, and automated script generation.

## Project Structure

This is a documentation-driven project in early development phase with:

- `docs/` - Comprehensive project documentation including PRD and implementation tasks
- `templates/` - Development workflow templates
- `.cursor/rules/` - Development guidelines and constraints

The actual application code (frontend/ and backend/ directories) has not been implemented yet.

## Architecture Overview

**Tech Stack (Planned):**
- Frontend: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + Zod + Zustand + React Query
- Backend: NestJS + TypeScript + MikroORM + Zod + PostgreSQL
- Database: PostgreSQL + Redis (caching)
- AI: OpenAI API + Custom TypeScript algorithms + Rule-based systems

**Core Components:**
1. **Authentication System** - Therapist registration with license verification
2. **Client Management** - Comprehensive client profile system with unique codes
3. **Assessment System** - Three assessment types (General, Addiction, Minor) with 100+ fields
4. **AI Recommendation Engine** - Cultural adaptation with technique scoring (0-100)
5. **Script Generation** - 7-phase hypnotherapy scripts with PDF export
6. **Session Management** - Progress tracking and analytics

## Development Guidelines

### Project Boundary Security
**CRITICAL:** Only work within `/Users/panduwijaya/Development/smart-therapy` directory. Never modify files outside this boundary.

### Frontend Development (when frontend/ exists)
- Use React functional components with TypeScript
- Implement validation with Zod schemas and `z.infer<>`
- Style with Tailwind CSS and shadcn/ui components
- Use React Query for data fetching
- Follow Indonesian cultural considerations in UI/UX

### Backend Development (when backend/ exists)
- Use NestJS modular architecture
- Validate all inputs with Zod schemas and ZodValidationPipe
- Use MikroORM for database operations
- Implement JWT-based authentication
- Follow Indonesian data protection requirements

### Cultural Requirements
- All content must be in formal Indonesian language
- Consider client demographics (age, gender, religion, province)
- Implement cultural adaptation in AI recommendations
- Respect Indonesian professional standards and ethics

## Common Development Tasks

Since this is a pre-development phase project, initial tasks will involve:

1. **Project Setup**
   ```bash
   # When ready to initialize
   mkdir frontend backend
   cd frontend && npm create next-app@latest . --typescript --tailwind --app
   cd ../backend && npm init -y && npm install @nestjs/core @nestjs/common
   ```

2. **Database Setup**
   - PostgreSQL with UUID primary keys
   - Core tables: users, clients, assessments, ai_assessments, session_scripts, hypnotherapy_techniques
   - Use MikroORM migrations for schema management

3. **Key Implementation Order**
   - Authentication system first (foundation for all features)
   - Client management (data foundation)
   - Assessment system (three types in parallel)
   - AI recommendation engine (rule-based + OpenAI)
   - Script generation (7-phase system)

## AI Algorithm Implementation

The core recommendation system uses TypeScript-based scoring:
- Issue compatibility (0-40 points)
- Cultural appropriateness (0-25 points)  
- Client factors (0-20 points)
- Session context (0-15 points)

Key cultural considerations:
- Religious adaptations (Islam, Christianity, Hinduism, Buddhism, Catholicism)
- Age-appropriate language formality
- Gender considerations for technique selection
- Regional Indonesian cultural factors

## Important Files to Reference

- `docs/hypnotherapy-project-context.md` - Complete technical specification and data models
- `docs/prd/prd-indonesian-hypnotherapy-ai-system.md` - Product requirements and user stories
- `.cursor/rules/` - Development constraints and coding standards

## Security & Privacy

- End-to-end encryption for all client data
- JWT-based authentication with secure tokens
- Compliance with Indonesian data protection laws
- GDPR-level privacy controls
- Role-based access controls for therapists only

## Current Status

This project is in the planning phase with comprehensive documentation completed. The actual application implementation (frontend/backend directories) needs to be initiated following the detailed specifications in the docs/ folder.