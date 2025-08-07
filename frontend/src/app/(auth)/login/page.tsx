'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, getPrimaryRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on primary role
      const primaryRole = getPrimaryRole();
      
      switch (primaryRole) {
        case 'administrator':
          router.push('/dashboard');
          break;
        case 'clinic_admin':
          router.push('/dashboard');
          break;
        case 'therapist':
          router.push('/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router, getPrimaryRole]);

  const handleLoginSuccess = () => {
    // Redirect is handled by the useEffect above
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Memeriksa status login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Terapintar
          </h1>
          <p className="text-gray-600">
            Sistem AI Hipnoterapi Indonesia
          </p>
        </div>
        
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}