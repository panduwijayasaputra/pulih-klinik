import { Therapist } from '@/types/therapist';
import { SessionSummary } from '@/types/client';
import { getClientSessions } from './mockData';

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
  'therapist-001': { id: 'therapist-001', currentLoad: 18, maxClients: 20 }, // 6 clients: CLT001, CLT004, CLT008, CLT009, CLT010, CLT011
  'therapist-002': { id: 'therapist-002', currentLoad: 12, maxClients: 15 }, // 2 clients: CLT002, CLT012
  'therapist-003': { id: 'therapist-003', currentLoad: 8, maxClients: 10 }, // Available capacity
  'therapist-004': { id: 'therapist-004', currentLoad: 5, maxClients: 12 }, // Available capacity
  'therapist-005': { id: 'therapist-005', currentLoad: 6, maxClients: 15 }, // Available capacity
  'multi-001': { id: 'multi-001', currentLoad: 10, maxClients: 15 }, // 2 clients: CLT003, CLT007 (multi-role user as therapist)
};

const clientAssignments: Record<string, string | undefined> = {
  'CLT001': 'therapist-001',
  'CLT002': 'therapist-002',
  'CLT003': 'multi-001', // Assigned to multi-role user
  'CLT004': 'therapist-001',
  'CLT005': undefined, // Unassigned - available for clinic admin to assign
  'CLT006': undefined, // Unassigned - available for clinic admin to assign
  'CLT007': 'multi-001', // Assigned to multi-role user
  'CLT008': 'therapist-001', // Maya Sari Indah
  'CLT009': 'therapist-001', // Rudi Hartono
  'CLT010': 'therapist-001', // Siti Nurhaliza (minor)
  'CLT011': 'therapist-001', // Dimas Anggara
  'CLT012': 'therapist-002', // Rizki Pratama (minor)
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

    const all = getClientSessions(clientId);

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


