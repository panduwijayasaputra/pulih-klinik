'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage');
      setLocalStorageData(authStorage || 'No auth-storage found');
    }
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</div>
        <div>isLoading: {isLoading ? 'true' : 'false'}</div>
        <div>user: {user ? 'exists' : 'null'}</div>
        <div>user email: {user?.email || 'N/A'}</div>
        <div>user roles: {user?.roles?.join(', ') || 'N/A'}</div>
        <div className="mt-2">
          <div className="font-bold">localStorage:</div>
          <pre className="text-xs overflow-auto max-h-20">
            {localStorageData}
          </pre>
        </div>
      </div>
    </div>
  );
};
