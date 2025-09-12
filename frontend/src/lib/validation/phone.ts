import { z } from 'zod';

/**
 * Indonesian phone number validation patterns
 * Supports multiple formats:
 * - +628123456789 (international format)
 * - 628123456789 (without +)
 * - 08123456789 (local format)
 * 
 * Rules:
 * - Must start with +62, 62, or 0
 * - Second digit must be 8 (mobile numbers)
 * - Third digit must be 1-9 (valid mobile prefixes)
 * - Total length: 10-12 digits (excluding country code)
 */
export const PHONE_PATTERNS = {
  // Main pattern for Indonesian mobile numbers
  INDONESIAN_MOBILE: /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/,
  
  // Alternative patterns for different formats
  INTERNATIONAL: /^\+62[1-9][0-9]{6,10}$/, // +62xxxxxxxxx
  NATIONAL: /^62[1-9][0-9]{6,10}$/,        // 62xxxxxxxxx
  LOCAL: /^0[1-9][0-9]{6,10}$/,            // 0xxxxxxxxx
} as const;

/**
 * Standardized phone validation for Indonesian numbers
 */
export const phoneValidation = z
  .string()
  .min(1, 'Nomor telepon harus diisi')
  .regex(
    PHONE_PATTERNS.INDONESIAN_MOBILE,
    'Format nomor telepon tidak valid. Gunakan format: +628123456789, 628123456789, atau 08123456789'
  )
  .refine(
    (val) => {
      // Additional length validation
      const cleanNumber = val.replace(/^(\+62|62|0)/, '');
      return cleanNumber.length >= 9 && cleanNumber.length <= 12;
    },
    'Nomor telepon harus 9-12 digit (setelah kode negara)'
  );

/**
 * Optional phone validation (allows empty strings)
 */
export const optionalPhoneValidation = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine(
    (val) => {
      if (!val || val === '') return true; // Allow empty
      return PHONE_PATTERNS.INDONESIAN_MOBILE.test(val);
    },
    'Format nomor telepon tidak valid. Gunakan format: +628123456789, 628123456789, atau 08123456789'
  )
  .transform((v) => (v === '' ? undefined : v));

/**
 * Phone validation for emergency contacts (more lenient)
 */
export const emergencyPhoneValidation = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine(
    (val) => {
      if (!val || val === '') return true; // Allow empty
      return PHONE_PATTERNS.INDONESIAN_MOBILE.test(val);
    },
    'Format nomor telepon darurat tidak valid'
  )
  .transform((v) => (v === '' ? undefined : v));

/**
 * Helper function to format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Format based on the pattern
  if (cleaned.startsWith('+62')) {
    return cleaned.replace(/^(\+62)(\d{3})(\d{3})(\d{3,4})$/, '$1-$2-$3-$4');
  } else if (cleaned.startsWith('62')) {
    return cleaned.replace(/^(62)(\d{3})(\d{3})(\d{3,4})$/, '+$1-$2-$3-$4');
  } else if (cleaned.startsWith('0')) {
    return cleaned.replace(/^(0)(\d{3})(\d{3})(\d{3,4})$/, '+62-$1$2-$3-$4');
  }
  
  return phone; // Return original if no pattern matches
};

/**
 * Helper function to normalize phone number for storage
 */
export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Convert to international format
  if (cleaned.startsWith('+62')) {
    return cleaned;
  } else if (cleaned.startsWith('62')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+62' + cleaned.substring(1);
  }
  
  return phone; // Return original if no pattern matches
};

/**
 * Test phone number formats
 */
export const testPhoneFormats = () => {
  const testNumbers = [
    '+628123456789',  // Valid international
    '628123456789',   // Valid national
    '08123456789',    // Valid local
    '+6281234567890', // Valid longer
    '081234567890',   // Valid longer local
    '+62812345678',   // Valid shorter
    '0812345678',     // Valid shorter local
    '+6281234567',    // Invalid (too short)
    '081234567',      // Invalid (too short)
    '+628023456789',  // Invalid (starts with 80)
    '0812345678901',  // Invalid (too long)
    '+62812345678901', // Invalid (too long)
  ];
  
  console.log('Phone validation test results:');
  testNumbers.forEach(number => {
    const isValid = PHONE_PATTERNS.INDONESIAN_MOBILE.test(number);
    console.log(`${number}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  });
};
