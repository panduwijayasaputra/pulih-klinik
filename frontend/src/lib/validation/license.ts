import { z } from 'zod';

/**
 * Indonesian professional license number validation patterns
 * Supports various professional license formats:
 * - SIP (Surat Izin Praktik) - Practice License
 * - PSI (Psikolog) - Psychologist License
 * - CERT (Certification) - Professional Certification
 * - Other professional licenses
 */

export const LICENSE_PATTERNS = {
  // SIP (Surat Izin Praktik) - Practice License
  SIP: /^SIP-\d{3,6}(-\d{4})?$/,
  
  // PSI (Psikolog) - Psychologist License
  PSI: /^PSI-\d{6,8}$/,
  
  // CERT (Certification) - Professional Certification
  CERT: /^CERT-[A-Z0-9]+-\d{3,6}$/,
  
  // General professional license pattern
  GENERAL: /^[A-Z]{2,6}-\d{3,8}(-[A-Z0-9]+)?$/,
  
  // Combined pattern for all supported formats
  ALL: /^(SIP-\d{3,6}(-\d{4})?|PSI-\d{6,8}|CERT-[A-Z0-9]+-\d{3,6}|[A-Z]{2,6}-\d{3,8}(-[A-Z0-9]+)?)$/,
} as const;

/**
 * License type enum for validation
 */
export const LICENSE_TYPES = {
  SIP: 'SIP',
  PSI: 'PSI', 
  CERT: 'CERT',
  OTHER: 'OTHER',
} as const;

/**
 * Standardized license number validation for Indonesian professionals
 */
export const licenseValidation = z
  .string()
  .min(5, 'Nomor lisensi minimal 5 karakter')
  .max(50, 'Nomor lisensi maksimal 50 karakter')
  .regex(
    LICENSE_PATTERNS.ALL,
    'Format nomor lisensi tidak valid. Gunakan format: SIP-123456, PSI-12345678, atau CERT-HEALTH-001'
  )
  .refine(
    (val) => {
      // Additional validation for specific formats
      const trimmed = val.trim();
      
      // Check for common invalid patterns
      if (trimmed.includes('  ')) return false; // No double spaces
      if (trimmed.startsWith('-') || trimmed.endsWith('-')) return false; // No leading/trailing dashes
      if (trimmed.includes('--')) return false; // No double dashes
      
      return true;
    },
    'Format nomor lisensi tidak valid'
  );

/**
 * Optional license validation (allows empty strings)
 */
export const optionalLicenseValidation = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine(
    (val) => {
      if (!val || val === '') return true; // Allow empty
      return LICENSE_PATTERNS.ALL.test(val);
    },
    'Format nomor lisensi tidak valid'
  )
  .transform((v) => (v === '' ? undefined : v));

/**
 * Helper function to detect license type
 */
export const detectLicenseType = (licenseNumber: string): keyof typeof LICENSE_TYPES => {
  if (!licenseNumber) return 'OTHER';
  
  if (LICENSE_PATTERNS.SIP.test(licenseNumber)) return 'SIP';
  if (LICENSE_PATTERNS.PSI.test(licenseNumber)) return 'PSI';
  if (LICENSE_PATTERNS.CERT.test(licenseNumber)) return 'CERT';
  
  return 'OTHER';
};

/**
 * Helper function to format license number for display
 */
export const formatLicenseNumber = (licenseNumber: string): string => {
  if (!licenseNumber) return '';
  
  // Return as-is if already properly formatted
  return licenseNumber.trim().toUpperCase();
};

/**
 * Helper function to validate license number format
 */
export const isValidLicenseFormat = (licenseNumber: string): boolean => {
  if (!licenseNumber) return false;
  return LICENSE_PATTERNS.ALL.test(licenseNumber.trim());
};

/**
 * Get validation message for specific license type
 */
export const getLicenseValidationMessage = (licenseType?: string): string => {
  switch (licenseType) {
    case 'SIP':
      return 'Format SIP: SIP-123456 atau SIP-123-2020';
    case 'PSI':
      return 'Format PSI: PSI-12345678';
    case 'CERT':
      return 'Format CERT: CERT-HEALTH-001';
    default:
      return 'Format: SIP-123456, PSI-12345678, atau CERT-HEALTH-001';
  }
};

/**
 * Test license number formats
 */
export const testLicenseFormats = () => {
  const testNumbers = [
    // Valid SIP formats
    'SIP-123456',     // Valid SIP
    'SIP-001-2020',   // Valid SIP with year
    'SIP-123',        // Valid short SIP
    
    // Valid PSI formats
    'PSI-12345678',   // Valid PSI
    'PSI-123456',     // Valid PSI
    
    // Valid CERT formats
    'CERT-HEALTH-001', // Valid CERT
    'CERT-IT-123',     // Valid CERT
    
    // Valid other formats
    'DR-123456',      // Valid other
    'MD-123-2020',    // Valid other with year
    
    // Invalid formats
    'SIP123456',      // Invalid (no dash)
    'SIP-',           // Invalid (incomplete)
    'SIP-ABC-2020',   // Invalid (letters in number)
    '123456',         // Invalid (no prefix)
    'SIP-123456789',  // Invalid (too long)
    'SIP-12',         // Invalid (too short)
  ];
  
  console.log('License validation test results:');
  testNumbers.forEach(number => {
    const isValid = LICENSE_PATTERNS.ALL.test(number);
    const type = detectLicenseType(number);
    console.log(`${number}: ${isValid ? '✅ Valid' : '❌ Invalid'} (${type})`);
  });
};
