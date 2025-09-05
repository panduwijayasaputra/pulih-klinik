export interface NetworkError {
  code: string;
  message: string;
  status?: number;
  isRetryable: boolean;
}

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

/**
 * Classifies an error as a network error and determines if it's retryable
 */
export const classifyNetworkError = (error: any): NetworkError => {
  // No response means network error
  if (!error.response) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed',
      isRetryable: true,
    };
  }

  const status = error.response.status;
  const message = error.response.data?.message || error.message || 'Unknown error';

  // 5xx server errors are retryable
  if (status >= 500) {
    return {
      code: 'SERVER_ERROR',
      message: `Server error: ${message}`,
      status,
      isRetryable: true,
    };
  }

  // 429 Too Many Requests is retryable
  if (status === 429) {
    return {
      code: 'RATE_LIMITED',
      message: 'Too many requests, please try again later',
      status,
      isRetryable: true,
    };
  }

  // 408 Request Timeout is retryable
  if (status === 408) {
    return {
      code: 'TIMEOUT',
      message: 'Request timeout',
      status,
      isRetryable: true,
    };
  }

  // 4xx client errors (except above) are not retryable
  if (status >= 400) {
    return {
      code: 'CLIENT_ERROR',
      message: `Client error: ${message}`,
      status,
      isRetryable: false,
    };
  }

  // Other errors
  return {
    code: 'UNKNOWN_ERROR',
    message: message,
    status,
    isRetryable: false,
  };
};

/**
 * Calculates delay for exponential backoff
 */
export const calculateRetryDelay = (
  attempt: number,
  options: RetryOptions = DEFAULT_RETRY_OPTIONS
): number => {
  const delay = options.baseDelay * Math.pow(options.backoffMultiplier, attempt - 1);
  return Math.min(delay, options.maxDelay);
};

/**
 * Executes a function with retry logic for network errors
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = DEFAULT_RETRY_OPTIONS,
  onRetry?: (attempt: number, error: NetworkError) => void
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const networkError = classifyNetworkError(error);

      // If error is not retryable, throw immediately
      if (!networkError.isRetryable) {
        throw error;
      }

      // If this is the last attempt, throw the error
      if (attempt === options.maxRetries) {
        throw error;
      }

      // Calculate delay and wait
      const delay = calculateRetryDelay(attempt, options);
      
      if (onRetry) {
        onRetry(attempt, networkError);
      }

      console.log(`🔄 Retrying in ${delay}ms (attempt ${attempt}/${options.maxRetries}): ${networkError.message}`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Checks if the user is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Sets up offline/online event listeners
 */
export const setupNetworkStatusListener = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  const handleOnline = () => {
    console.log('🌐 Network connection restored');
    onOnline();
  };

  const handleOffline = () => {
    console.log('📴 Network connection lost');
    onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * Creates a network error message for display to users
 */
export const createUserFriendlyErrorMessage = (error: NetworkError, context?: string): string => {
  // Add context-specific error messages
  if (context === 'validation') {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Tidak dapat memvalidasi data. Periksa koneksi internet Anda.';
      case 'SERVER_ERROR':
        return 'Server sedang mengalami masalah. Validasi data gagal.';
      case 'TIMEOUT':
        return 'Validasi data terlalu lama. Silakan coba lagi.';
      case 'CLIENT_ERROR':
        if (error.status === 401) {
          return 'Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.';
        }
        if (error.status === 404) {
          return 'Data pengguna tidak ditemukan. Silakan masuk kembali.';
        }
        return 'Validasi data gagal. Silakan coba lagi.';
      default:
        return 'Terjadi kesalahan saat memvalidasi data. Silakan coba lagi.';
    }
  }

  if (context === 'clinic_deletion') {
    return 'Data klinik telah dihapus. Anda akan diarahkan ke form pendaftaran klinik.';
  }

  // Default error messages
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    case 'SERVER_ERROR':
      return 'Server sedang mengalami masalah. Silakan coba lagi nanti.';
    case 'RATE_LIMITED':
      return 'Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.';
    case 'TIMEOUT':
      return 'Permintaan terlalu lama. Silakan coba lagi.';
    case 'CLIENT_ERROR':
      if (error.status === 401) {
        return 'Sesi Anda telah berakhir. Silakan masuk kembali.';
      }
      if (error.status === 403) {
        return 'Anda tidak memiliki izin untuk melakukan tindakan ini.';
      }
      if (error.status === 404) {
        return 'Data yang diminta tidak ditemukan.';
      }
      return 'Terjadi kesalahan. Silakan coba lagi.';
    default:
      return 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.';
  }
};
