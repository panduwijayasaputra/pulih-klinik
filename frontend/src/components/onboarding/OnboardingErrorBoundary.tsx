'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class OnboardingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Onboarding Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service (if available)
    if (typeof window !== 'undefined' && (window as any).logError) {
      (window as any).logError(error, {
        component: 'OnboardingErrorBoundary',
        errorInfo,
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Terjadi Kesalahan
              </h1>
              <p className="text-gray-600 text-sm">
                Maaf, terjadi kesalahan saat memproses onboarding. Silakan coba lagi atau hubungi tim support jika masalah berlanjut.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Error Details (Development):</h3>
                <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-600 cursor-pointer">Stack Trace</summary>
                    <pre className="text-xs text-gray-600 overflow-auto max-h-32 mt-1">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
              
              <Button
                onClick={this.handleRefresh}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Halaman
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                className="w-full"
                variant="ghost"
              >
                <Home className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Jika masalah berlanjut, silakan hubungi tim support dengan kode error: {this.state.error?.name || 'UNKNOWN'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useOnboardingErrorHandler = () => {
  const router = useRouter();

  const handleError = (error: Error, errorInfo?: any) => {
    console.error('🚨 Onboarding error:', error, errorInfo);
    
    // Log error to monitoring service (if available)
    if (typeof window !== 'undefined' && (window as any).logError) {
      (window as any).logError(error, {
        component: 'OnboardingHook',
        errorInfo,
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  };

  const retryOnboarding = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const goToHome = () => {
    router.push('/');
  };

  return {
    handleError,
    retryOnboarding,
    goToHome,
  };
};
