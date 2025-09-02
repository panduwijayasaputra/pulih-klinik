'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthPageWrapper } from '@/components/layout/AuthPageWrapper';
import { useAuthStore } from '@/store/auth';
import { getDefaultRouteForUser } from '@/lib/route-protection';

export default function LoginPage() {
  const router = useRouter();
  const { clearAuthState } = useAuthStore();

  // Clear any existing auth state when visiting login page (without redirect)
  useEffect(() => {
    clearAuthState();
  }, [clearAuthState]);

  const handleLoginSuccess = () => {
    // Use a small delay to ensure auth state is updated
    setTimeout(() => {
      const { user: currentUser } = useAuthStore.getState();
      if (currentUser) {
        const defaultRoute = getDefaultRouteForUser(currentUser);
        router.push(defaultRoute as any);
      }
    }, 100);
  };


  return (
    <AuthPageWrapper
      title="Terapintar"
      description="Sistem AI Hipnoterapi Indonesia"
    >
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthPageWrapper>
  );
}