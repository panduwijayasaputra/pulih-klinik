# Consultation Feature Implementation Tasks

This directory contains the broken-down tasks for implementing the consultation feature based on the PRD: `docs/prd/prd-consultation-feature.md`

## Task Overview

### 📋 Task Files

1. **[01-client-status-management.md](./01-client-status-management.md)** - Core status management system
   - **Dependencies**: None
   - **Estimated Time**: 2-3 days
   - **Files**: 9 files to create/modify

2. **[02-therapist-dashboard.md](./02-therapist-dashboard.md)** - Therapist dashboard and client list
   - **Dependencies**: 01-client-status-management.md
   - **Estimated Time**: 1-2 days
   - **Files**: 4 files to create/modify

3. **[03-consultation-form-system.md](./03-consultation-form-system.md)** - Consultation form system
   - **Dependencies**: 01-client-status-management.md
   - **Estimated Time**: 2-3 days
   - **Files**: 7 files to create/modify

4. **[04-client-therapy-page.md](./04-client-therapy-page.md)** - Client therapy page with tabs
   - **Dependencies**: 01-client-status-management.md, 03-consultation-form-system.md
   - **Estimated Time**: 2-3 days
   - **Files**: 3 files to create/modify

5. **[05-client-reassignment.md](./05-client-reassignment.md)** - Client reassignment functionality
   - **Dependencies**: 01-client-status-management.md
   - **Estimated Time**: 1-2 days
   - **Files**: 3 files to create/modify

## Implementation Order

### Phase 1: Foundation (Week 1)
1. **01-client-status-management.md** - Start with core status system
2. **02-therapist-dashboard.md** - Build therapist dashboard

### Phase 2: Core Features (Week 2)
3. **03-consultation-form-system.md** - Implement consultation forms
4. **04-client-therapy-page.md** - Create therapy page with tabs

### Phase 3: Advanced Features (Week 3)
5. **05-client-reassignment.md** - Add reassignment functionality

## Total Estimated Time
- **Total**: 8-13 days
- **Recommended**: 2-3 weeks with testing and refinement

## Key Features Implemented

### 🎯 Status Management
- 5 status workflow (new → assigned → consultation → therapy → done)
- Status transition tracking with audit trail
- Color-coded status badges
- Validation for allowed transitions

### 👨‍⚕️ Therapist Dashboard
- Dedicated "My Clients" view
- Search and filtering capabilities
- Status overview with counts
- Quick action buttons

### 📝 Consultation Forms
- 3 form types (general, drug addiction, minor)
- Form validation with Zod
- Editable until therapy starts
- Modal-based interface

### 🏥 Therapy Page
- 3-tab layout (Client Info, Consultation Info, Therapy Sessions)
- Role-based access control
- Status transition actions
- Mock session list

### 🔄 Reassignment System
- Admin reassignment functionality
- Status validation for reassignment
- Audit trail with reasons
- Therapist notification preparation

## File Structure

```
frontend/src/
├── types/
│   ├── clientStatus.ts (new)
│   ├── consultation.ts (new)
│   ├── client.ts (update)
│   └── enums.ts (update)
├── schemas/
│   ├── clientStatusSchema.ts (new)
│   └── consultationSchema.ts (new)
├── store/
│   ├── clientStatus.ts (new)
│   └── consultation.ts (new)
├── hooks/
│   ├── useClientStatus.ts (new)
│   ├── useConsultation.ts (new)
│   └── useTherapistClients.ts (new)
├── components/
│   ├── clients/
│   │   ├── ClientStatusBadge.tsx (new)
│   │   ├── ReassignClientModal.tsx (new)
│   │   ├── ClientList.tsx (update)
│   │   └── AssignTherapistModal.tsx (update)
│   └── consultation/
│       ├── ConsultationForm.tsx (new)
│       ├── ConsultationFormModal.tsx (new)
│       ├── TherapistDashboard.tsx (new)
│       ├── ClientTherapyPage.tsx (new)
│       └── index.ts (new)
├── app/portal/therapist/
│   └── clients/
│       ├── page.tsx (new)
│       └── [id]/therapy/page.tsx (new)
└── lib/api/
    └── consultation.ts (new)
```

## Development Guidelines

### 🛠️ Technical Stack
- **Frontend**: React/TypeScript/Next.js
- **State Management**: Zustand
- **Form Validation**: Zod + React Hook Form
- **UI Components**: shadcn/ui + TailwindCSS
- **Styling**: TailwindCSS

### 📋 Coding Standards
- Follow existing component patterns
- Use existing shared components (PortalPageWrapper, DataTable, FormModal, etc.)
- Implement proper TypeScript typing
- Add Zod validation for all forms
- Use Bahasa Indonesia for UI labels
- Implement proper error handling
- Add loading states for better UX

### 🧪 Testing
- Unit tests for utility functions
- Component tests for new components
- Integration tests for form workflows
- Test status transition logic
- Verify role-based access control

### 🔒 Security & Access Control
- Role-based access control for therapists
- Validate status transitions
- Prevent unauthorized reassignments
- Audit trail for all status changes

## Notes

- All tasks use existing shared components for consistency
- Status management is the foundation for all other features
- Consultation forms should be flexible for future customization
- Mock data should be realistic for development and testing
- All UI text should be in Bahasa Indonesia
- Proper error handling and loading states are essential
