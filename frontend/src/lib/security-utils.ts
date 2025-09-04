/**
 * Security utilities for production environment
 */

/**
 * Disables console logging in production to prevent information disclosure
 */
export const disableConsoleInProduction = (): void => {
  if (process.env.NODE_ENV === 'production') {
    // Disable all console methods in production
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.trace = () => {};
    console.table = () => {};
    console.group = () => {};
    console.groupEnd = () => {};
    console.time = () => {};
    console.timeEnd = () => {};
    console.count = () => {};
    console.countReset = () => {};
  }
};

/**
 * Sanitizes sensitive data before logging (for development)
 */
export const sanitizeForLogging = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveKeys = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'authorization',
    'secret',
    'key',
    'hash',
    'ssn',
    'creditCard',
    'cvv',
  ];

  const sanitized = { ...data };
  
  for (const key in sanitized) {
    if (sensitiveKeys.some(sensitiveKey => 
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    )) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeForLogging(sanitized[key]);
    }
  }

  return sanitized;
};

/**
 * Safe logging function that sanitizes data and respects production environment
 */
export const safeLog = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message, data ? sanitizeForLogging(data) : '');
    }
  },
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(message, data ? sanitizeForLogging(data) : '');
    }
  },
  error: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(message, data ? sanitizeForLogging(data) : '');
    }
  },
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(message, data ? sanitizeForLogging(data) : '');
    }
  },
};

/**
 * Validates that sensitive data is not exposed in client-side code
 */
export const validateNoSensitiveData = (data: any): boolean => {
  const sensitivePatterns = [
    /password/i,
    /secret/i,
    /token/i,
    /key/i,
    /hash/i,
    /private/i,
  ];

  const dataString = JSON.stringify(data);
  
  return !sensitivePatterns.some(pattern => pattern.test(dataString));
};

/**
 * Generates a secure random string for tokens
 */
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  if (typeof window !== 'undefined' && window.crypto) {
    // Use Web Crypto API if available
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    // Fallback for environments without Web Crypto API
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return result;
};

/**
 * Checks if the current environment is secure for sensitive operations
 */
export const isSecureEnvironment = (): boolean => {
  // Check if running over HTTPS
  if (typeof window !== 'undefined') {
    return window.location.protocol === 'https:';
  }
  
  // For server-side, assume secure if in production
  return process.env.NODE_ENV === 'production';
};
