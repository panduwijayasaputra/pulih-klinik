# Smart Therapy - Indonesian Hypnotherapy AI System

A comprehensive web platform designed to revolutionize the workflow of licensed Indonesian hypnotherapists by transforming manual 2-hour session planning into streamlined 15-minute AI-assisted workflows.

## 🎯 Project Overview

The Indonesian Hypnotherapy AI System provides:
- **Client Assessment**: Comprehensive digital forms for general, addiction, and minor assessments
- **AI Recommendations**: Culturally-appropriate technique recommendations with confidence scoring
- **Script Generation**: Automated 7-phase hypnotherapy session scripts in Indonesian
- **Progress Tracking**: Client progress monitoring and session effectiveness analytics
- **Cultural Adaptation**: Indonesian language support with religious and cultural considerations

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Zod, Zustand, React Query
- **Backend**: NestJS, TypeScript, MikroORM, PostgreSQL, Redis
- **AI**: OpenAI API + Custom TypeScript algorithms
- **Infrastructure**: Docker, Vercel (Frontend), Railway/AWS (Backend)

### Authentication System
The application features a simplified, production-ready authentication system:
- **Streamlined Auth Flow**: Simplified registration, login, and onboarding processes
- **Role-Based Access Control**: System Admin, Clinic Admin, and Therapist roles
- **Real-time Data Validation**: Automatic sync with database on page reload
- **Network Error Handling**: Retry logic with exponential backoff
- **Automatic Token Refresh**: Seamless token renewal before expiration
- **Data Synchronization**: Critical data change detection and cleanup

### Project Structure
```
smart-therapy/
├── frontend/           # Next.js 14 application
├── backend/            # NestJS API server
├── docs/              # Project documentation
├── templates/         # Development templates
└── docker-compose.yml # Development environment
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- Docker (for development environment)
- PostgreSQL (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-therapy
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development environment**
   ```bash
   # Start frontend development server
   pnpm dev:frontend

   # Start backend development server (in separate terminal)
   pnpm dev:backend
   ```

4. **Using Docker (recommended)**
   ```bash
   docker-compose up -dev
   ```

## 📋 Available Scripts

### Workspace Commands
- `pnpm dev` - Start frontend development server
- `pnpm build` - Build both frontend and backend
- `pnpm start` - Start production servers
- `pnpm lint` - Run linting on all workspaces
- `pnpm test` - Run tests on all workspaces
- `pnpm clean` - Clean all node_modules and build artifacts

### Frontend Commands
- `pnpm dev:frontend` - Start frontend development server
- `pnpm build:frontend` - Build frontend for production
- `pnpm start:frontend` - Start frontend production server

### Backend Commands
- `pnpm dev:backend` - Start backend development server
- `pnpm build:backend` - Build backend for production
- `pnpm start:backend` - Start backend production server

## 🌐 Application Flow

### 1. Therapist Registration & Authentication
- License verification system for Indonesian hypnotherapists
- Secure JWT-based authentication
- Profile management with license information

### 2. Client Management
- Comprehensive client profiles with unique codes (CLT001, CLT002...)
- Demographic information including cultural and religious considerations
- Client status tracking (active, inactive, completed)

### 3. Assessment System
Three assessment types with 100+ fields:
- **General Assessment**: Comprehensive mental health evaluation
- **Addiction Assessment**: Specialized addiction-focused evaluation  
- **Minor Assessment**: Streamlined assessment for younger clients

### 4. AI Recommendation Engine
- Cultural adaptation based on Indonesian values and traditions
- Technique scoring algorithm (0-100 points)
- Multi-technique recommendations (primary, supporting, integration)
- Confidence scoring and detailed reasoning in Indonesian

### 5. Script Generation
- 7-phase hypnotherapy scripts (preparation → reorientation)
- PDF export with timing boxes for manual tracking
- Cultural notes and safety protocols included
- Technique highlights and therapist instructions

### 6. Session Management
- Session scheduling and progress tracking
- Effectiveness ratings and outcome analytics
- Client progress reports and treatment planning

## 🎨 Design Principles

### Cultural Considerations
- **Language**: Formal Indonesian language throughout
- **Religious Sensitivity**: Adaptations for Islam, Christianity, Hinduism, Buddhism, Catholicism
- **Cultural Context**: Consideration of Indonesian regional differences
- **Professional Standards**: Alignment with Indonesian hypnotherapy practices

### User Experience
- Clean, professional interface for healthcare providers
- Intuitive navigation with clear visual hierarchy
- Responsive design optimized for desktop use
- Accessibility compliance (WCAG AA)

## 🔒 Security & Privacy

- End-to-end encryption for all client data
- GDPR-level privacy controls
- Compliance with Indonesian data protection laws
- Role-based access controls
- Secure API endpoints with rate limiting
- Regular security audits and updates

## 📊 Success Metrics

- **85% reduction** in session planning time (2 hours → 15 minutes)
- **80% adoption rate** among Indonesian hypnotherapists within 12 months
- **25% improvement** in client satisfaction and outcomes
- **30% increase** in therapist client capacity

## 🚧 Development Status

Current phase: **Project Setup and Foundation**
- ✅ Project documentation and planning
- 🚧 Frontend application setup
- ⏳ Backend API development
- ⏳ AI recommendation engine
- ⏳ Script generation system

## 📚 Documentation

- [Technical Specification](docs/hypnotherapy-project-context.md)
- [Product Requirements](docs/prd/prd-indonesian-hypnotherapy-ai-system.md)
- [Development Tasks](docs/tasks/)
- [CLAUDE.md](CLAUDE.md) - AI assistant guidance

## 🤝 Contributing

This project follows strict security and cultural guidelines:
- All contributions must respect Indonesian cultural values
- Healthcare data privacy is paramount
- Code must follow TypeScript strict mode and Zod validation
- UI/UX must be accessible and professional

## 📄 License

This project is proprietary and confidential. Unauthorized access, use, or distribution is prohibited.

---

**Smart Therapy Team** - Revolutionizing Indonesian hypnotherapy through AI-assisted workflows