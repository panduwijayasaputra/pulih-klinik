'use client';

import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthPageWrapper } from '@/components/layout/AuthPageWrapper';
import { useAuthStore } from '@/store/auth';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { clearError } = useAuthStore();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Clear any error state when visiting login page
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/portal');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <AuthPageWrapper
      title="Terapintar"
      description="Sistem AI Hipnoterapi Indonesia"
    >
      <LoginForm />
    </AuthPageWrapper>
  );
}