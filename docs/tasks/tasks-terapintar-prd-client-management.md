# Task List: Client Management Implementation

**Based on:** `docs/terapintar_prd.md` – Section 3.2 Client Management
**Generated:** 2025-08-08
**Target:** Junior Developer Implementation Guide

## Relevant Files (proposed)

- `frontend/src/types/client.ts` – TypeScript interfaces for client data
- `frontend/src/lib/api/client.ts` – API functions for client management
- `frontend/src/lib/api/client.test.ts` – Unit tests for client API
- `frontend/src/store/client.ts` – State management (Zustand) for clients
- `frontend/src/hooks/useClient.ts` – Hook façade for client operations
- `frontend/src/components/clients/ClientForm.tsx` – Create/update client form
- `frontend/src/components/clients/ClientList.tsx` – Client listing with search/filter
- `frontend/src/components/clients/ClientDetails.tsx` – View/update client details
- `frontend/src/components/clients/AssignTherapistModal.tsx` – Assign client to therapist (enforces max active client rule)
- `frontend/src/components/clients/SessionHistory.tsx` – Client session history & assessments view
- `frontend/src/app/portal/clients/page.tsx` – Clients index page
- `frontend/src/app/portal/clients/[id]/page.tsx` – Client details page

### Notes

- Unit tests should sit alongside their components/files.
- Use `pnpm test` (or workspace filters) to run tests.

## Tasks

- [ ] 1.0 Frontend Client Management UI
  - [x] 1.1 Create TypeScript types and validation schemas
    - Add `frontend/src/types/client.ts` defining `Client`, `ClientFormData`, `ClientContact`, `ClientStatus` (active, archived), and light session summary types
    - Create Zod schemas for create/update payloads and search/filter params
    - Export inferred types for use across app
  - [ ] 1.2 Build `ClientForm` (create/update)
    - Use React Hook Form + Zod resolver; fields: name, email, phone, WhatsApp, DOB, gender, address, notes, status
    - Use `@/components/ui` inputs, select, textarea; add inline error messages
    - Expose props: `mode: 'create'|'edit'`, `defaultValues`, `onSubmitSuccess`
    - Show submit/cancel buttons with loading state; success and error toasts
  - [ ] 1.3 Build `ClientList` with search and filters
    - Table or card list with columns: name, contact, status, assigned therapist, createdAt, actions
    - Search by name/phone/email; filters by status and assigned therapist
    - Empty state, loading skeletons, pagination controls (client-side for now)
    - Row actions: View, Edit, Assign Therapist, Archive
  - [ ] 1.4 Build `ClientDetails` view
    - Read-only section (core info), editable sidebar (notes/status)
    - Action bar: Edit, Assign/Change therapist, Archive/Unarchive
    - Show quick stats: total sessions, last session date
  - [ ] 1.5 Build `AssignTherapistModal`
    - List available therapists with capacity indicator (active clients / max)
    - Disable selection when therapist at capacity; show explanatory tooltip
    - Confirm assignment with short Bahasa copy; success/error toasts
  - [ ] 1.6 Pages and navigation
    - `app/portal/clients/page.tsx` (index) uses `ClientList`
    - `app/portal/clients/[id]/page.tsx` (details) uses `ClientDetails` + `SessionHistory`
    - Add role guard (clinic_admin, therapist with assigned clients read-only)

- [ ] 2.0 Client Assignment Workflow (Therapist capacity constraint)
  - [ ] 2.1 API contract and functions
    - Define `assignClientToTherapist(clientId, therapistId)` and `unassignClient(clientId)` in `lib/api/client.ts`
    - Server returns error if therapist at capacity; standard ApiResponse shape
  - [ ] 2.2 Implement UI flow
    - Wire `AssignTherapistModal` to call API; show loading and handle errors
    - On success, update client store (assigned therapist), close modal, toast success
  - [ ] 2.3 Enforce validation in UI
    - Prevent submit if chosen therapist is full (defensive UI)
    - Show concise error in Bahasa if conflicts occur after submit
  - [ ] 2.4 Audit trail and feedback
    - Log assignment actions in console for now (adminId, therapistId, clientId, timestamp)
    - Display user-facing success notifications

- [ ] 3.0 Session History & Assessments View
  - [ ] 3.1 Types
    - Add session and assessment summary types to `types/client.ts`
  - [ ] 3.2 API functions
    - `getClientSessions(clientId)` returning paginated list; include fields (date, phase, therapist, score summary)
  - [ ] 3.3 `SessionHistory` component
    - Timeline or list with date grouping; empty state, loading skeletons, pagination
    - Click to expand to see assessment snippets (pre/post) when available
  - [ ] 3.4 Deep links
    - Link to full session detail page (future), or show a modal with summary for now
  - [ ] 3.5 Error and empty states
    - Consistent Bahasa copy and toasts

- [ ] 4.0 State Management and Integration
  - [ ] 4.1 Create client store (`frontend/src/store/client.ts`)
    - State: clients list, selected client, sessions; flags: loading, error; persistence for list and selected IDs
  - [ ] 4.2 Hook façade (`frontend/src/hooks/useClient.ts`)
    - Provide typed actions: loadClients, createClient, updateClient, assign/unassign, loadSessions
  - [ ] 4.3 Integrate pages & components
    - `ClientList`, `ClientForm`, `ClientDetails`, `AssignTherapistModal`, `SessionHistory` use the store
  - [ ] 4.4 Optimistic updates
    - Apply optimistic update for create/update/assign; rollback on failure with error toasts
  - [ ] 4.5 Access control
    - Guard mutations to clinic_admin; therapists read-only except session notes (future)

- [ ] 5.0 Testing and Quality Assurance
  - [ ] 5.1 Unit tests (components)
    - `ClientForm`, `ClientList`, `AssignTherapistModal`, `SessionHistory` with edge cases
  - [ ] 5.2 API tests
    - `lib/api/client.test.ts` covering success and error paths
  - [ ] 5.3 Store tests
    - Client store actions and optimistic update flows
  - [ ] 5.4 Integration tests (happy paths)
    - Create client → assign therapist → view sessions
  - [ ] 5.5 Accessibility checks
    - Labels, keyboard navigation in modal/table, contrasts


