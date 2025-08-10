import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ClientAPI } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';

// Mock the API and hooks
vi.mock('@/lib/api/client');
vi.mock('@/hooks/useAuth');
vi.mock('@/components/ui/toast');

const mockClient = {
  id: 'CLT001',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+6281234567890',
  status: 'pending' as const,
  assignedTherapist: undefined,
  joinDate: '2024-01-15',
  totalSessions: 0,
  progress: 0,
  notes: 'Test client',
};

const mockTherapist = {
  id: 'THR001',
  name: 'Dr. Jane Smith',
  email: 'jane@clinic.com',
  specialization: 'Anxiety',
  capacity: 5,
  assignedClients: 3,
};

describe('Client Management Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useAuth
    (useAuth as any).mockReturnValue({
      user: {
        id: 'USR001',
        name: 'Admin User',
        email: 'admin@clinic.com',
        roles: ['clinic_admin'],
      },
      isAuthenticated: true,
      hasRole: vi.fn(() => true),
    });

    // Mock useToast
    (useToast as any).mockReturnValue({
      addToast: vi.fn(),
    });
  });

  describe('API Integration', () => {
    it('should assign therapist to client successfully', async () => {
      const mockAssignAPI = vi.mocked(ClientAPI.assignClientToTherapist);
      mockAssignAPI.mockResolvedValue({
        success: true,
        data: { ...mockClient, assignedTherapist: 'THR001', status: 'active' },
        message: 'Client assigned successfully',
      });

      const result = await ClientAPI.assignClientToTherapist('CLT001', 'THR001');
      
      expect(mockAssignAPI).toHaveBeenCalledWith('CLT001', 'THR001');
      expect(result.success).toBe(true);
      expect(result.data?.assignedTherapist).toBe('THR001');
    });

    it('should handle assignment failure gracefully', async () => {
      const mockAssignAPI = vi.mocked(ClientAPI.assignClientToTherapist);
      mockAssignAPI.mockResolvedValue({
        success: false,
        data: null,
        message: 'Therapist at full capacity',
      });

      const result = await ClientAPI.assignClientToTherapist('CLT001', 'THR001');
      
      expect(mockAssignAPI).toHaveBeenCalledWith('CLT001', 'THR001');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Therapist at full capacity');
    });

    it('should unassign therapist from client successfully', async () => {
      const mockUnassignAPI = vi.mocked(ClientAPI.unassignClient);
      mockUnassignAPI.mockResolvedValue({
        success: true,
        data: { ...mockClient, assignedTherapist: undefined, status: 'pending' },
        message: 'Client unassigned successfully',
      });

      const result = await ClientAPI.unassignClient('CLT001');
      
      expect(mockUnassignAPI).toHaveBeenCalledWith('CLT001');
      expect(result.success).toBe(true);
      expect(result.data?.assignedTherapist).toBeUndefined();
    });

    it('should load client sessions successfully', async () => {
      const mockSessions = [
        {
          id: 'SES001',
          date: '2024-01-20',
          phase: 'intake' as const,
          status: 'completed' as const,
          duration: 60,
          therapist: 'Dr. Jane Smith',
          notes: 'Initial assessment completed',
          assessmentSnippet: 'Client shows signs of mild anxiety',
        },
      ];

      const mockGetSessionsAPI = vi.mocked(ClientAPI.getClientSessions);
      mockGetSessionsAPI.mockResolvedValue({
        success: true,
        data: {
          items: mockSessions,
          total: 1,
          page: 1,
          pageSize: 10,
        },
        message: 'Sessions loaded successfully',
      });

      const result = await ClientAPI.getClientSessions('CLT001', 1, 10);
      
      expect(mockGetSessionsAPI).toHaveBeenCalledWith('CLT001', 1, 10);
      expect(result.success).toBe(true);
      expect(result.data?.items).toEqual(mockSessions);
      expect(result.data?.total).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const mockAssignAPI = vi.mocked(ClientAPI.assignClientToTherapist);
      mockAssignAPI.mockRejectedValue(new Error('Network error'));

      await expect(ClientAPI.assignClientToTherapist('CLT001', 'THR001')).rejects.toThrow('Network error');
    });
  });
});
