'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Selamat datang, {user.name}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Keluar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Informasi Pengguna</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role(s):</strong> {user.roles.join(', ')}</p>
                {user.clinicId && <p><strong>Clinic ID:</strong> {user.clinicId}</p>}
                {user.subscriptionTier && <p><strong>Subscription:</strong> {user.subscriptionTier}</p>}
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Status Multi-Role</h3>
              <p className="text-sm text-green-800">
                {user.roles.length > 1 
                  ? `Anda memiliki ${user.roles.length} role aktif`
                  : 'Anda memiliki 1 role'
                }
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Akses Cepat</h3>
              <p className="text-sm text-purple-800">
                Dashboard sedang dalam pengembangan...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}