import { describe, it, expect } from '@jest/globals';
import { 
  LICENSE_PATTERNS, 
  detectLicenseType, 
  formatLicenseNumber, 
  isValidLicenseFormat,
  getLicenseValidationMessage 
} from '../license';

describe('License Validation', () => {
  describe('LICENSE_PATTERNS.ALL', () => {
    const validNumbers = [
      // SIP formats
      'SIP-123456',     // Valid SIP
      'SIP-001-2020',   // Valid SIP with year
      'SIP-123',        // Valid short SIP
      
      // PSI formats
      'PSI-12345678',   // Valid PSI
      'PSI-123456',     // Valid PSI
      
      // CERT formats
      'CERT-HEALTH-001', // Valid CERT
      'CERT-IT-123',     // Valid CERT
      
      // Other formats
      'DR-123456',      // Valid other
      'MD-123-2020',    // Valid other with year
    ];

    const invalidNumbers = [
      'SIP123456',      // Invalid (no dash)
      'SIP-',           // Invalid (incomplete)
      'SIP-ABC-2020',   // Invalid (letters in number)
      '123456',         // Invalid (no prefix)
      'SIP-123456789',  // Invalid (too long)
      'SIP-12',         // Invalid (too short)
      'sip-123456',     // Invalid (lowercase)
      'SIP-123-ABC',    // Invalid (letters after dash)
    ];

    it('should validate correct license number formats', () => {
      validNumbers.forEach(number => {
        expect(LICENSE_PATTERNS.ALL.test(number)).toBe(true);
      });
    });

    it('should reject invalid license number formats', () => {
      invalidNumbers.forEach(number => {
        expect(LICENSE_PATTERNS.ALL.test(number)).toBe(false);
      });
    });
  });

  describe('detectLicenseType', () => {
    it('should detect SIP license type', () => {
      expect(detectLicenseType('SIP-123456')).toBe('SIP');
      expect(detectLicenseType('SIP-001-2020')).toBe('SIP');
    });

    it('should detect PSI license type', () => {
      expect(detectLicenseType('PSI-12345678')).toBe('PSI');
      expect(detectLicenseType('PSI-123456')).toBe('PSI');
    });

    it('should detect CERT license type', () => {
      expect(detectLicenseType('CERT-HEALTH-001')).toBe('CERT');
      expect(detectLicenseType('CERT-IT-123')).toBe('CERT');
    });

    it('should detect OTHER license type', () => {
      expect(detectLicenseType('DR-123456')).toBe('OTHER');
      expect(detectLicenseType('MD-123-2020')).toBe('OTHER');
      expect(detectLicenseType('')).toBe('OTHER');
    });
  });

  describe('formatLicenseNumber', () => {
    it('should format license numbers correctly', () => {
      expect(formatLicenseNumber('sip-123456')).toBe('SIP-123456');
      expect(formatLicenseNumber('  PSI-12345678  ')).toBe('PSI-12345678');
      expect(formatLicenseNumber('cert-health-001')).toBe('CERT-HEALTH-001');
    });

    it('should handle empty strings', () => {
      expect(formatLicenseNumber('')).toBe('');
    });
  });

  describe('isValidLicenseFormat', () => {
    it('should validate license formats correctly', () => {
      expect(isValidLicenseFormat('SIP-123456')).toBe(true);
      expect(isValidLicenseFormat('PSI-12345678')).toBe(true);
      expect(isValidLicenseFormat('CERT-HEALTH-001')).toBe(true);
      expect(isValidLicenseFormat('SIP123456')).toBe(false);
      expect(isValidLicenseFormat('')).toBe(false);
    });
  });

  describe('getLicenseValidationMessage', () => {
    it('should return appropriate validation messages', () => {
      expect(getLicenseValidationMessage('SIP')).toBe('Format SIP: SIP-123456 atau SIP-123-2020');
      expect(getLicenseValidationMessage('PSI')).toBe('Format PSI: PSI-12345678');
      expect(getLicenseValidationMessage('CERT')).toBe('Format CERT: CERT-HEALTH-001');
      expect(getLicenseValidationMessage()).toBe('Format: SIP-123456, PSI-12345678, atau CERT-HEALTH-001');
    });
  });
});
