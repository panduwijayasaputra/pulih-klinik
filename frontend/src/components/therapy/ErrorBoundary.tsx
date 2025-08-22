'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string, errorId: string) => void;
  onRetry?: () => void;
  onGoHome?: () => void;
  onGoBack?: () => void;
  errorType?: 'component' | 'data' | 'network' | 'validation';
  context?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorInfo: error.message || 'Unknown error occurred',
      errorId,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorString = `${error.toString()}\n${errorInfo.componentStack}`;
    
    this.setState({
      error,
      errorInfo: errorString,
    });

    // Log error for debugging
    console.error('Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: this.props.context,
      errorId: this.state.errorId,
    });
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorString, this.state.errorId || 'unknown');
    }

    // Report error to monitoring service (if available)
    this.reportError(error, errorInfo);
  }

  reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real application, you would send this to your error monitoring service
    // For now, we'll just log it
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.error('Error reported to monitoring service:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        context: this.props.context,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });

    // Call optional retry handler
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleGoHome = () => {
    if (this.props.onGoHome) {
      this.props.onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  handleGoBack = () => {
    if (this.props.onGoBack) {
      this.props.onGoBack();
    } else {
      window.history.back();
    }
  };

  getErrorTypeInfo = () => {
    const { errorType, context } = this.props;
    const { error } = this.state;

    if (errorType === 'network') {
      return {
        title: 'Kesalahan Jaringan',
        description: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        icon: '🌐',
        severity: 'warning' as const,
      };
    }

    if (errorType === 'data') {
      return {
        title: 'Kesalahan Data',
        description: 'Data tidak dapat dimuat atau tidak valid.',
        icon: '📊',
        severity: 'error' as const,
      };
    }

    if (errorType === 'validation') {
      return {
        title: 'Kesalahan Validasi',
        description: 'Data yang dimasukkan tidak valid.',
        icon: '✅',
        severity: 'warning' as const,
      };
    }

    // Default component error
    return {
      title: 'Kesalahan Aplikasi',
      description: 'Terjadi kesalahan yang tidak terduga dalam aplikasi.',
      icon: '⚠️',
      severity: 'error' as const,
    };
  };

  override render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorInfo = this.getErrorTypeInfo();

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md border-red-200 bg-white shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 text-4xl">{errorInfo.icon}</div>
              <CardTitle className="text-red-700">
                {errorInfo.title}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {errorInfo.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Debug Information</AlertTitle>
                  <AlertDescription>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm font-medium">
                        Show Error Details
                      </summary>
                      <pre className="mt-2 text-xs bg-red-50 p-2 rounded border overflow-auto max-h-32">
                        {this.state.error.message}
                        {this.state.error.stack && `\n\n${this.state.error.stack}`}
                      </pre>
                    </details>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Button
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    onClick={this.handleGoBack}
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali
                  </Button>
                  
                  <Button
                    onClick={this.handleGoHome}
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Beranda
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center mt-4">
                Error ID: {this.state.errorId}
                {this.props.context && ` | Context: ${this.props.context}`}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary wrapper for functional components
import { useCallback, useEffect, useState } from 'react';

interface UseErrorHandlerOptions {
  onError?: (error: Error, errorId: string) => void;
  fallbackData?: any;
  context?: string;
}

export function useErrorHandler(options?: UseErrorHandlerOptions) {
  const [error, setError] = useState<Error | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    if (error && options?.onError) {
      options.onError(error, errorId || 'unknown');
    }
  }, [error, errorId, options]);

  const handleError = useCallback((error: Error) => {
    const newErrorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.error('Error handled:', {
      error: error.message,
      context: options?.context,
      errorId: newErrorId,
    });
    setError(error);
    setErrorId(newErrorId);
  }, [options?.context]);

  const clearError = useCallback(() => {
    setError(null);
    setErrorId(null);
  }, []);

  const safeExecute = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      return await fn();
    } catch (error) {
      handleError(error as Error);
      return options?.fallbackData || null;
    }
  }, [handleError, options?.fallbackData]);

  return {
    error,
    errorId,
    hasError: !!error,
    handleError,
    clearError,
    safeExecute,
  };
}

// Convenience wrapper for therapy-specific errors
export function TherapyErrorBoundary({ 
  children, 
  onError,
  onRetry,
  onGoHome,
  onGoBack,
  context = 'therapy'
}: { 
  children: ReactNode; 
  onError?: (error: Error, errorId: string) => void; // Add undefined type to onError
  onRetry?: (() => void) | undefined; // Add undefined type to onRetry
  onGoHome?: (() => void) | undefined; // Add undefined type to onGoHome
  onGoBack?: (() => void) | undefined; // Add undefined type to onGoBack
  context?: string;
}) {
  return (
    <ErrorBoundary
      onError={onError}
      context={context}
      onRetry={onRetry}
      onGoHome={onGoHome}
      onGoBack={onGoBack}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
