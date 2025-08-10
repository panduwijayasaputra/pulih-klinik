import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClientStore } from '@/store/client';
import type { Client, SessionSummary } from '@/types/client';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockClient: Client = {
  id: 'CLT001',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+6281234567890',
  status: 'pending',
  assignedTherapist: undefined,
  joinDate: '2024-01-15',
  totalSessions: 0,
  progress: 0,
  notes: 'Test client',
};

const mockSession: SessionSummary = {
  id: 'SES001',
  date: '2024-01-20',
  phase: 'intake',
  status: 'completed',
  duration: 60,
  therapist: 'Dr. Jane Smith',
  notes: 'Initial assessment completed',
  assessmentSnippet: 'Client shows signs of mild anxiety',
};

describe('Client Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    // Reset store state
    const { result } = renderHook(() => useClientStore());
    act(() => {
      result.current.setClients([]);
      result.current.setSelectedClientId(null);
      result.current.setClientSessions('CLT001', []);
      result.current.setLoading(false);
      result.current.setError(null);
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useClientStore());
      
      expect(result.current.clients).toEqual([]);
      expect(result.current.selectedClientId).toBeNull();
      expect(result.current.sessionsByClientId).toEqual({});
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Client Management', () => {
    it('should add a new client', () => {
      const { result } = renderHook(() => useClientStore());
      
      act(() => {
        result.current.addClient(mockClient);
      });
      
      expect(result.current.clients).toHaveLength(1);
      expect(result.current.clients[0]).toEqual(mockClient);
    });

    it('should update an existing client', () => {
      const { result } = renderHook(() => useClientStore());
      
      act(() => {
        result.current.addClient(mockClient);
        result.current.updateClient('CLT001', { name: 'Jane Doe', status: 'active' });
      });
      
      expect(result.current.clients[0].name).toBe('Jane Doe');
      expect(result.current.clients[0].status).toBe('active');
    });

    it('should delete a client', () => {
      const { result } = renderHook(() => useClientStore());
      
      act(() => {
        result.current.addClient(mockClient);
        result.current.deleteClient('CLT001');
      });
      
      expect(result.current.clients).toHaveLength(0);
    });

    it('should set selected client', () => {
      const { result } = renderHook(() => useClientStore());
      
      act(() => {
        result.current.setSelectedClientId('CLT001');
      });
      
      expect(result.current.selectedClientId).toBe('CLT001');
    });
  });

  describe('Session Management', () => {
    it('should set client sessions', () => {
      const { result } = renderHook(() => useClientStore());
      
      act(() => {
        result.current.setClientSessions('CLT001', [mockSession]);
      });
      
      expect(result.current.sessionsByClientId['CLT001']).toEqual([mockSession]);
    });

    it('should append sessions to existing ones', () => {
      const { result } = renderHook(() => useClientStore());
      const newSession: SessionSummary = {
        ...mockSession,
        id: 'SES002',
        date: '2024-01-21',
      };
      
      act(() => {
        result.current.setClientSessions('CLT001', [mockSession]);
        result.current.setClientSessions('CLT001', [newSession]);
      });
      
      expect(result.current.sessionsByClientId['CLT001']).toEqual([newSession]);
    });

    it('should handle multiple clients with different sessions', () => {
      const { result } = renderHook(() => useClientStore());
      const client2Session: SessionSummary = {
        ...mockSession,
        id: 'SES003',
        therapist: 'Dr. Bob Wilson',
      };
      
      act(() => {
        result.current.setClientSessions('CLT001', [mockSession]);
        result.current.setClientSessions('CLT002', [client2Session]);
      });
      
      expect(result.current.sessionsByClientId['CLT001']).toEqual([mockSession]);
      expect(result.current.sessionsByClientId['CLT002']).toEqual([client2Session]);
    });
  });

  describe('Loading and Error States', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useClientStore());
      
      act(() => {
        result.current.setLoading(true);
      });
      
      expect(result.current.loading).toBe(true);
    });

    it('should set error state', () => {
      const { result } = renderHook(() => useClientStore());
      const errorMessage = 'Failed to load clients';
      
      act(() => {
        result.current.setError(errorMessage);
      });
      
      expect(result.current.error).toBe(errorMessage);
    });

    it('should clear error when setting to null', () => {
      const { result } = renderHook(() => useClientStore());
      
      act(() => {
        result.current.setError('Some error');
        result.current.setError(null);
      });
      
      expect(result.current.error).toBeNull();
    });
  });

  describe('Persistence', () => {
    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const { result } = renderHook(() => useClientStore());
      
      // Should not throw error
      expect(() => {
        act(() => {
          result.current.addClient(mockClient);
        });
      }).not.toThrow();
    });
  });

  describe('State Selectors', () => {
    it('should find client by ID', () => {
      const { result } = renderHook(() => useClientStore());
      
      act(() => {
        result.current.addClient(mockClient);
      });
      
      const foundClient = result.current.clients.find(c => c.id === 'CLT001');
      expect(foundClient).toEqual(mockClient);
    });

    it('should return undefined for non-existent client', () => {
      const { result } = renderHook(() => useClientStore());
      
      const foundClient = result.current.clients.find(c => c.id === 'NONEXISTENT');
      expect(foundClient).toBeUndefined();
    });

    it('should get sessions for specific client', () => {
      const { result } = renderHook(() => useClientStore());
      
      act(() => {
        result.current.setClientSessions('CLT001', [mockSession]);
      });
      
      const sessions = result.current.sessionsByClientId['CLT001'];
      expect(sessions).toEqual([mockSession]);
    });

    it('should handle non-existent client sessions', () => {
      const { result } = renderHook(() => useClientStore());
      
      const sessions = result.current.sessionsByClientId['NONEXISTENT'];
      expect(sessions).toBeUndefined();
    });
  });
});
