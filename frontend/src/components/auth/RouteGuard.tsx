'use client';

import React from 'react';
import { useRouteGuard } from '@/hooks/useRouteGuard';

interface RouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const { isLoading, canAccess, shouldRedirect, reason } = useRouteGuard();

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Memeriksa izin akses...</p>
        </div>
      </div>
    );
  }

  // Show fallback or access denied if user can't access
  if (!canAccess || shouldRedirect) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-destructive" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Akses Ditolak
          </h1>
          <p className="text-muted-foreground mb-6">
            {reason || 'Anda tidak memiliki izin untuk mengakses halaman ini.'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
};

// HOC for protecting specific routes
export const withRouteGuard = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <RouteGuard fallback={fallback}>
        <Component {...props} />
      </RouteGuard>
    );
  };

  WrappedComponent.displayName = `withRouteGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};