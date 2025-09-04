'use client';

import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthPageWrapper } from '@/components/layout/AuthPageWrapper';
import { useAuthStore } from '@/store/auth';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function LoginPage() {
  const { clearError } = useAuthStore();

  // Clear any error state when visiting login page
  useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <RouteGuard>
      <AuthPageWrapper
        title="Terapintar"
        description="Sistem AI Hipnoterapi Indonesia"
      >
        <LoginForm />
      </AuthPageWrapper>
    </RouteGuard>
  );
}