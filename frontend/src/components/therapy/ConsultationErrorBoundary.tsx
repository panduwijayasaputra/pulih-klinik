'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ConsultationErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

interface ConsultationErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
  onRetry?: () => void;
}

class ConsultationErrorBoundary extends Component<
  ConsultationErrorBoundaryProps,
  ConsultationErrorBoundaryState
> {
  constructor(props: ConsultationErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ConsultationErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: error.message || 'Unknown error occurred',
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorString = `${error.toString()}\n${errorInfo.componentStack}`;
    
    this.setState({
      error,
      errorInfo: errorString,
    });

    // Log error for debugging
    console.error('Consultation Error Boundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorString);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional retry handler
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  override render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Kesalahan Data Konsultasi
            </CardTitle>
            <CardDescription className="text-red-600">
              Terjadi kesalahan saat memproses data konsultasi. Data mungkin tidak valid atau rusak.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-red-600">
              <strong>Detail Kesalahan:</strong>
              <p className="mt-1 font-mono text-xs bg-red-100 p-2 rounded border">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
            
            <div className="text-xs text-red-500 mt-4">
              Jika masalah terus berlanjut, silakan hubungi administrator sistem.
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary wrapper for functional components
import { useEffect, useState } from 'react';

interface UseConsultationErrorBoundaryOptions {
  onError?: (error: Error) => void;
  fallbackData?: any;
}

export function useConsultationErrorHandler(options?: UseConsultationErrorBoundaryOptions) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error && options?.onError) {
      options.onError(error);
    }
  }, [error, options]);

  const handleError = (error: Error) => {
    console.error('Consultation data error:', error);
    setError(error);
  };

  const clearError = () => {
    setError(null);
  };

  const safeExecute = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      return await fn();
    } catch (error) {
      handleError(error as Error);
      return options?.fallbackData || null;
    }
  };

  return {
    error,
    hasError: !!error,
    handleError,
    clearError,
    safeExecute,
  };
}

// Consultation-specific error boundary with built-in fallback
export function ConsultationDataErrorBoundary({ 
  children, 
  onRetry 
}: { 
  children: ReactNode; 
  onRetry?: (() => void) | undefined; // Add undefined type to onRetry  
}) {
  return (
    <ConsultationErrorBoundary
      onRetry={onRetry}
      fallback={
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              Data Konsultasi Tidak Tersedia
            </CardTitle>
            <CardDescription className="text-yellow-600">
              Data konsultasi tidak dapat dimuat atau tidak valid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8 text-yellow-600">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada data konsultasi yang valid untuk ditampilkan.</p>
                {onRetry && (
                  <Button
                    onClick={onRetry}
                    variant="outline"
                    size="sm"
                    className="mt-4 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Muat Ulang
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      {children}
    </ConsultationErrorBoundary>
  );
}

export default ConsultationErrorBoundary;