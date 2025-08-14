import { describe, expect, it } from '@jest/globals';
import {
  assessmentTools,
  generateMockSessions,
  getAssessmentToolDescription,
  getClientSessions,
  getSessionStats,
  getTherapistName,
  mockSessionData,
  mockTherapists,
} from './mockData';

describe('Mock Session Data', () => {
  describe('getClientSessions', () => {
    it('should return sessions for existing client', () => {
      const sessions = getClientSessions('CLT001');
      expect(sessions).toBeDefined();
      expect(sessions.length).toBeGreaterThan(0);
      expect(sessions[0]).toHaveProperty('id');
      expect(sessions[0]).toHaveProperty('clientId', 'CLT001');
    });

    it('should return empty array for non-existing client', () => {
      const sessions = getClientSessions('NONEXISTENT');
      expect(sessions).toEqual([]);
    });
  });

  describe('getTherapistName', () => {
    it('should return therapist name for existing therapist', () => {
      const name = getTherapistName('therapist-001');
      expect(name).toBe('Dr. Ahmad Pratama, M.Psi');
    });

    it('should return default name for non-existing therapist', () => {
      const name = getTherapistName('non-existent');
      expect(name).toBe('Unknown Therapist');
    });
  });

  describe('getAssessmentToolDescription', () => {
    it('should return description for existing tool', () => {
      const description = getAssessmentToolDescription('GAD-7');
      expect(description).toBe('Generalized Anxiety Disorder Assessment');
    });

    it('should return tool name for non-existing tool', () => {
      const description = getAssessmentToolDescription('UNKNOWN-TOOL');
      expect(description).toBe('UNKNOWN-TOOL');
    });
  });

  describe('generateMockSessions', () => {
    it('should generate specified number of sessions', () => {
      const sessions = generateMockSessions('TEST001', 'therapist-001', 'Test Therapist', 3);
      expect(sessions).toHaveLength(3);
    });

    it('should generate sessions with correct structure', () => {
      const sessions = generateMockSessions('TEST002', 'therapist-001', 'Test Therapist', 1);
      const session = sessions[0];
      
      expect(session).toHaveProperty('id');
      expect(session).toHaveProperty('clientId', 'TEST002');
      expect(session).toHaveProperty('therapistId', 'therapist-001');
      expect(session).toHaveProperty('therapistName', 'Test Therapist');
      expect(session).toHaveProperty('date');
      expect(session).toHaveProperty('phase');
      expect(session).toHaveProperty('status');
      expect(session).toHaveProperty('durationMinutes');
      expect(session).toHaveProperty('notes');
    });

    it('should generate sessions with weekly intervals', () => {
      const startDate = new Date('2024-01-01');
      const sessions = generateMockSessions('TEST003', 'therapist-001', 'Test Therapist', 3, startDate);
      
      const firstSession = new Date(sessions[0].date);
      const secondSession = new Date(sessions[1].date);
      const thirdSession = new Date(sessions[2].date);
      
      expect(secondSession.getTime() - firstSession.getTime()).toBe(7 * 24 * 60 * 60 * 1000); // 7 days
      expect(thirdSession.getTime() - secondSession.getTime()).toBe(7 * 24 * 60 * 60 * 1000); // 7 days
    });

    it('should add assessments to intake and post sessions', () => {
      const sessions = generateMockSessions('TEST004', 'therapist-001', 'Test Therapist', 4);
      
      const intakeSession = sessions.find(s => s.phase === 'intake');
      const postSession = sessions.find(s => s.phase === 'post');
      
      expect(intakeSession?.assessment).toBeDefined();
      expect(postSession?.assessment).toBeDefined();
      expect(intakeSession?.assessment?.preScore).toBeDefined();
      expect(postSession?.assessment?.postScore).toBeDefined();
    });
  });

  describe('getSessionStats', () => {
    it('should return correct statistics for client with sessions', () => {
      const stats = getSessionStats('CLT001');
      
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('completed');
      expect(stats).toHaveProperty('scheduled');
      expect(stats).toHaveProperty('cancelled');
      expect(stats).toHaveProperty('totalDuration');
      expect(stats).toHaveProperty('phases');
      expect(stats).toHaveProperty('assessments');
      
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.total).toBe(stats.completed + stats.scheduled + stats.cancelled);
    });

    it('should return zero statistics for client without sessions', () => {
      const stats = getSessionStats('NONEXISTENT');
      
      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.scheduled).toBe(0);
      expect(stats.cancelled).toBe(0);
      expect(stats.totalDuration).toBe(0);
      expect(stats.assessments).toBe(0);
    });
  });

  describe('Mock Data Structure', () => {
    it('should have valid session data structure', () => {
      Object.entries(mockSessionData).forEach(([clientId, sessions]) => {
        expect(clientId).toMatch(/^CLT\d+$/);
        expect(Array.isArray(sessions)).toBe(true);
        
        sessions.forEach(session => {
          expect(session).toHaveProperty('id');
          expect(session).toHaveProperty('clientId', clientId);
          expect(session).toHaveProperty('therapistId');
          expect(session).toHaveProperty('therapistName');
          expect(session).toHaveProperty('date');
          expect(session).toHaveProperty('phase');
          expect(session).toHaveProperty('status');
          expect(session).toHaveProperty('durationMinutes');
          expect(session).toHaveProperty('notes');
          
          // Validate phase
          expect(['intake', 'induction', 'therapy', 'post']).toContain(session.phase);
          
          // Validate status
          expect(['completed', 'scheduled', 'cancelled']).toContain(session.status);
          
          // Validate date format
          expect(() => new Date(session.date)).not.toThrow();
          
          // Validate assessment if present
          if (session.assessment) {
            expect(session.assessment).toHaveProperty('tool');
            expect(session.assessment).toHaveProperty('scoreUnit');
            expect(session.assessment).toHaveProperty('notes');
            expect(session.assessment.preScore || session.assessment.postScore).toBeDefined();
          }
        });
      });
    });

    it('should have valid therapist data', () => {
      Object.entries(mockTherapists).forEach(([therapistId, therapistName]) => {
        expect(therapistId).toMatch(/^therapist-\d+$/);
        expect(typeof therapistName).toBe('string');
        expect(therapistName.length).toBeGreaterThan(0);
      });
    });

    it('should have valid assessment tools', () => {
      Object.entries(assessmentTools).forEach(([tool, description]) => {
        expect(typeof tool).toBe('string');
        expect(typeof description).toBe('string');
        expect(description.length).toBeGreaterThan(0);
      });
    });
  });
});
