'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    // Check if already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    // Wait for Zustand store to rehydrate from localStorage
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Show loading state while store is hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}