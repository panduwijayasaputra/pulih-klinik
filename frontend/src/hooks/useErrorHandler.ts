import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/toast';

export interface ErrorInfo {
  id: string;
  error: Error;
  context?: string;
  timestamp: Date;
  userAction?: string;
  metadata?: Record<string, any>;
}

export interface ErrorHandlerOptions {
  onError?: (errorInfo: ErrorInfo) => void;
  showToast?: boolean;
  toastDuration?: number;
  logToConsole?: boolean;
  reportToMonitoring?: boolean;
  context?: string;
  fallbackMessage?: string;
}

export interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onMaxRetriesExceeded?: (error: Error) => void;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const {
    onError,
    showToast = true,
    toastDuration = 5000,
    logToConsole = true,
    reportToMonitoring = process.env.NODE_ENV === 'production',
    context = 'general',
    fallbackMessage = 'Terjadi kesalahan yang tidak terduga',
  } = options;

  const { addToast } = useToast();
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [isHandlingError, setIsHandlingError] = useState(false);
  const retryCountRef = useRef<Record<string, number>>({});

  // Generate unique error ID
  const generateErrorId = useCallback(() => {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Log error to console
  const logError = useCallback((errorInfo: ErrorInfo) => {
    if (logToConsole) {
      console.error('Error handled:', {
        id: errorInfo.id,
        message: errorInfo.error.message,
        stack: errorInfo.error.stack,
        context: errorInfo.context,
        timestamp: errorInfo.timestamp,
        userAction: errorInfo.userAction,
        metadata: errorInfo.metadata,
      });
    }
  }, [logToConsole]);

  // Report error to monitoring service
  const reportError = useCallback((errorInfo: ErrorInfo) => {
    if (reportToMonitoring) {
      // In a real application, you would send this to your error monitoring service
      // Example: Sentry.captureException(errorInfo.error, { extra: errorInfo });
      console.error('Error reported to monitoring service:', {
        error: errorInfo.error.message,
        stack: errorInfo.error.stack,
        context: errorInfo.context,
        errorId: errorInfo.id,
        timestamp: errorInfo.timestamp.toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        metadata: errorInfo.metadata,
      });
    }
  }, [reportToMonitoring]);

  // Show error toast
  const showErrorToast = useCallback((errorInfo: ErrorInfo) => {
    if (showToast) {
      const isNetworkError = errorInfo.error.message.includes('fetch') || 
                            errorInfo.error.message.includes('network') ||
                            errorInfo.error.message.includes('Failed to fetch');

      addToast({
        type: isNetworkError ? 'warning' : 'error',
        title: isNetworkError ? 'Kesalahan Jaringan' : 'Kesalahan',
        message: errorInfo.error.message || fallbackMessage,
        duration: toastDuration,
      });
    }
  }, [showToast, addToast, toastDuration, fallbackMessage]);

  // Main error handler
  const handleError = useCallback((error: Error, userAction?: string, metadata?: Record<string, any>) => {
    setIsHandlingError(true);

    const errorInfo: ErrorInfo = {
      id: generateErrorId(),
      error,
      context,
      timestamp: new Date(),
      userAction,
      metadata,
    };

    // Add to errors list
    setErrors(prev => [...prev, errorInfo]);

    // Log error
    logError(errorInfo);

    // Report to monitoring
    reportError(errorInfo);

    // Show toast
    showErrorToast(errorInfo);

    // Call custom error handler
    if (onError) {
      onError(errorInfo);
    }

    setIsHandlingError(false);
  }, [
    generateErrorId,
    context,
    logError,
    reportError,
    showErrorToast,
    onError,
  ]);

  // Clear specific error
  const clearError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Get latest error
  const getLatestError = useCallback(() => {
    return errors[errors.length - 1] || null;
  }, [errors]);

  // Check if has errors
  const hasErrors = errors.length > 0;

  // Retry mechanism
  const retry = useCallback(async <T,>(
    fn: () => Promise<T>,
    retryOptions: RetryOptions = {}
  ): Promise<T> => {
    const {
      maxRetries = 3,
      delay = 1000,
      backoffMultiplier = 2,
      onRetry,
      onMaxRetriesExceeded,
    } = retryOptions;

    const operationId = generateErrorId();
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          // Max retries exceeded
          if (onMaxRetriesExceeded) {
            onMaxRetriesExceeded(lastError);
          }
          throw lastError;
        }

        // Call retry callback
        if (onRetry) {
          onRetry(attempt + 1, lastError);
        }

        // Calculate delay with exponential backoff
        const currentDelay = delay * Math.pow(backoffMultiplier, attempt);
        const jitter = Math.random() * 0.1 * currentDelay; // Add 10% jitter
        
        await new Promise(resolve => setTimeout(resolve, currentDelay + jitter));
      }
    }

    throw lastError!;
  }, [generateErrorId]);

  // Safe execute with error handling
  const safeExecute = useCallback(async <T,>(
    fn: () => Promise<T>,
    userAction?: string,
    metadata?: Record<string, any>
  ): Promise<T | null> => {
    try {
      return await fn();
    } catch (error) {
      handleError(error as Error, userAction, metadata);
      return null;
    }
  }, [handleError]);

  // Network error detection
  const isNetworkError = useCallback((error: Error): boolean => {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('Failed to fetch') ||
           error.message.includes('Network Error');
  }, []);

  // Validation error detection
  const isValidationError = useCallback((error: Error): boolean => {
    return error.message.includes('validation') ||
           error.message.includes('Validation') ||
           error.message.includes('invalid') ||
           error.message.includes('Invalid');
  }, []);

  // API error detection
  const isAPIError = useCallback((error: Error): boolean => {
    return error.message.includes('API') ||
           error.message.includes('api') ||
           error.message.includes('server') ||
           error.message.includes('Server');
  }, []);

  // Get error type
  const getErrorType = useCallback((error: Error): 'network' | 'validation' | 'api' | 'unknown' => {
    if (isNetworkError(error)) return 'network';
    if (isValidationError(error)) return 'validation';
    if (isAPIError(error)) return 'api';
    return 'unknown';
  }, [isNetworkError, isValidationError, isAPIError]);

  // Get user-friendly error message
  const getUserFriendlyMessage = useCallback((error: Error): string => {
    const errorType = getErrorType(error);

    switch (errorType) {
      case 'network':
        return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      case 'validation':
        return 'Data yang dimasukkan tidak valid. Periksa kembali input Anda.';
      case 'api':
        return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
      default:
        return error.message || fallbackMessage;
    }
  }, [getErrorType, fallbackMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setErrors([]);
    };
  }, []);

  return {
    // State
    errors,
    hasErrors,
    isHandlingError,
    
    // Actions
    handleError,
    clearError,
    clearAllErrors,
    
    // Utilities
    getLatestError,
    retry,
    safeExecute,
    
    // Error type detection
    isNetworkError,
    isValidationError,
    isAPIError,
    getErrorType,
    getUserFriendlyMessage,
  };
}

// Specialized error handlers
export function useNetworkErrorHandler(options?: ErrorHandlerOptions) {
  return useErrorHandler({
    context: 'network',
    fallbackMessage: 'Kesalahan jaringan terjadi',
    ...options,
  });
}

export function useValidationErrorHandler(options?: ErrorHandlerOptions) {
  return useErrorHandler({
    context: 'validation',
    fallbackMessage: 'Data tidak valid',
    ...options,
  });
}

export function useAPIErrorHandler(options?: ErrorHandlerOptions) {
  return useErrorHandler({
    context: 'api',
    fallbackMessage: 'Kesalahan server terjadi',
    ...options,
  });
}

export default useErrorHandler;
