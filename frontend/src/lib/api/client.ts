import { Therapist } from '@/types/therapist';
import { SessionSummary } from '@/types/client';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

// Simulated latency helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory mock state for client assignments and therapist capacity
// NOTE: This is a frontend-only mock to support UI flows until a backend exists
const therapistCapacity: Record<string, Pick<Therapist, 'id' | 'currentLoad' | 'maxClients'>> = {
  'therapist-001': { id: 'therapist-001', currentLoad: 15, maxClients: 20 },
  'therapist-002': { id: 'therapist-002', currentLoad: 12, maxClients: 15 },
  'therapist-003': { id: 'therapist-003', currentLoad: 8, maxClients: 10 },
};

const clientAssignments: Record<string, string | undefined> = {
  'CLT001': 'therapist-001',
  'CLT002': 'therapist-002',
  'CLT003': 'therapist-001',
  // CLT004 unassigned
};

export const ClientAPI = {
  async assignClientToTherapist(clientId: string, therapistId: string): Promise<ApiResponse<{ clientId: string; therapistId: string }>> {
    await delay(600);

    const capacity = therapistCapacity[therapistId];
    if (!capacity) {
      return { success: false, message: 'Therapist tidak ditemukan', errorCode: 'THERAPIST_NOT_FOUND' };
    }

    // If already assigned to the same therapist, treat as idempotent success
    const currentAssignment = clientAssignments[clientId];
    if (currentAssignment === therapistId) {
      return { success: true, data: { clientId, therapistId }, message: 'Klien sudah ditugaskan ke therapist ini' };
    }

    // Enforce capacity
    if (capacity.currentLoad >= capacity.maxClients) {
      return { success: false, message: 'Therapist sudah mencapai kapasitas', errorCode: 'THERAPIST_AT_CAPACITY' };
    }

    // Reassignment: decrement previous therapist load
    if (currentAssignment) {
      const prev = therapistCapacity[currentAssignment];
      if (prev) {
        prev.currentLoad = Math.max(0, prev.currentLoad - 1);
      }
    }

    // Assign to new therapist
    capacity.currentLoad += 1;
    clientAssignments[clientId] = therapistId;

    return { success: true, data: { clientId, therapistId }, message: 'Klien berhasil ditugaskan' };
  },

  async unassignClient(clientId: string): Promise<ApiResponse<{ clientId: string }>> {
    await delay(400);

    const currentAssignment = clientAssignments[clientId];
    if (!currentAssignment) {
      return { success: true, data: { clientId }, message: 'Klien tidak memiliki penugasan' };
    }

    const prev = therapistCapacity[currentAssignment];
    if (prev) {
      prev.currentLoad = Math.max(0, prev.currentLoad - 1);
    }

    clientAssignments[clientId] = undefined;
    return { success: true, data: { clientId }, message: 'Penugasan klien dihapus' };
  },

  async getTherapistCapacity(therapistId: string): Promise<ApiResponse<{ currentLoad: number; maxClients: number }>> {
    await delay(200);
    const capacity = therapistCapacity[therapistId];
    if (!capacity) {
      return { success: false, message: 'Therapist tidak ditemukan', errorCode: 'THERAPIST_NOT_FOUND' };
    }
    return { success: true, data: { currentLoad: capacity.currentLoad, maxClients: capacity.maxClients } };
  },

  async getClientSessions(
    clientId: string,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<{ items: SessionSummary[]; page: number; pageSize: number; total: number }>> {
    await delay(400);

    // Mock sessions per client
    const mockByClient: Record<string, SessionSummary[]> = {
      CLT001: [
        {
          id: 'sess-001',
          clientId: 'CLT001',
          therapistId: 'therapist-001',
          therapistName: 'Dr. Ahmad Pratama, M.Psi',
          date: '2024-01-05T09:00:00Z',
          phase: 'intake',
          status: 'completed',
          durationMinutes: 60,
          notes: 'Anamnesis awal dan penetapan tujuan.',
          assessment: { tool: 'GAD-7', preScore: 14, scoreUnit: 'points' },
        },
        {
          id: 'sess-002',
          clientId: 'CLT001',
          therapistId: 'therapist-001',
          therapistName: 'Dr. Ahmad Pratama, M.Psi',
          date: '2024-01-12T09:00:00Z',
          phase: 'induction',
          status: 'completed',
          durationMinutes: 60,
          notes: 'Induksi ringan, latihan relaksasi.',
        },
        {
          id: 'sess-003',
          clientId: 'CLT001',
          therapistId: 'therapist-001',
          therapistName: 'Dr. Ahmad Pratama, M.Psi',
          date: '2024-01-19T09:00:00Z',
          phase: 'therapy',
          status: 'completed',
          durationMinutes: 75,
          notes: 'Intervensi kognitif, reframing.',
        },
        {
          id: 'sess-004',
          clientId: 'CLT001',
          therapistId: 'therapist-001',
          therapistName: 'Dr. Ahmad Pratama, M.Psi',
          date: '2024-01-26T09:00:00Z',
          phase: 'post',
          status: 'completed',
          durationMinutes: 60,
          notes: 'Evaluasi, rencana tindak lanjut.',
          assessment: { tool: 'GAD-7', postScore: 8, scoreUnit: 'points' },
        },
      ],
      CLT002: [
        {
          id: 'sess-101',
          clientId: 'CLT002',
          therapistId: 'therapist-002',
          therapistName: 'Dr. Sari Wulandari, M.Psi',
          date: '2024-01-10T10:00:00Z',
          phase: 'intake',
          status: 'completed',
          durationMinutes: 60,
          notes: 'Screening awal dan penilaian gejala.',
          assessment: { tool: 'PHQ-9', preScore: 12, scoreUnit: 'points' },
        },
      ],
    };

    const all = mockByClient[clientId] ?? [];

    // Sort by date desc
    const sorted = [...all].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const total = sorted.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = sorted.slice(start, end);

    return { success: true, data: { items, page, pageSize, total } };
  },
};

export type { Therapist };


