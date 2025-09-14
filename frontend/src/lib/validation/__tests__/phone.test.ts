import { describe, it, expect } from '@jest/globals';
import { PHONE_PATTERNS, formatPhoneNumber, normalizePhoneNumber } from '../phone';

describe('Phone Validation', () => {
  describe('PHONE_PATTERNS.INDONESIAN_MOBILE', () => {
    const validNumbers = [
      '+628123456789',  // Valid international
      '628123456789',   // Valid national
      '08123456789',    // Valid local
      '+6281234567890', // Valid longer
      '081234567890',   // Valid longer local
      '+62812345678',   // Valid shorter
      '0812345678',     // Valid shorter local
    ];

    const invalidNumbers = [
      '+6281234567',    // Invalid (too short)
      '081234567',      // Invalid (too short)
      '+628023456789',  // Invalid (starts with 80)
      '0812345678901',  // Invalid (too long)
      '+62812345678901', // Invalid (too long)
      '123456789',      // Invalid (no country code)
      '+123456789',     // Invalid (wrong country code)
    ];

    it('should validate correct Indonesian mobile numbers', () => {
      validNumbers.forEach(number => {
        expect(PHONE_PATTERNS.INDONESIAN_MOBILE.test(number)).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      invalidNumbers.forEach(number => {
        expect(PHONE_PATTERNS.INDONESIAN_MOBILE.test(number)).toBe(false);
      });
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format international numbers correctly', () => {
      expect(formatPhoneNumber('+628123456789')).toBe('+62-812-345-6789');
      expect(formatPhoneNumber('+6281234567890')).toBe('+62-812-345-67890');
    });

    it('should format national numbers correctly', () => {
      expect(formatPhoneNumber('628123456789')).toBe('+62-812-345-6789');
    });

    it('should format local numbers correctly', () => {
      expect(formatPhoneNumber('08123456789')).toBe('+62-0812-345-6789');
    });

    it('should handle empty strings', () => {
      expect(formatPhoneNumber('')).toBe('');
    });
  });

  describe('normalizePhoneNumber', () => {
    it('should normalize to international format', () => {
      expect(normalizePhoneNumber('+628123456789')).toBe('+628123456789');
      expect(normalizePhoneNumber('628123456789')).toBe('+628123456789');
      expect(normalizePhoneNumber('08123456789')).toBe('+628123456789');
    });

    it('should handle empty strings', () => {
      expect(normalizePhoneNumber('')).toBe('');
    });
  });
});
