'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { 
  TherapistList, 
  TherapistForm,
  TherapistAssignment
} from '@/components/dashboard';
import {
  UserGroupIcon,
  PlusIcon,
  ChartBarIcon,
  UserPlusIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function TherapistsPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateNew = () => {
    setShowCreateForm(true);
    setActiveTab('create');
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setActiveTab('list');
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
    setActiveTab('list');
  };

  return (
    <RoleGuard allowedRoles={['clinic_admin']}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserGroupIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Therapist</h1>
            <p className="text-gray-600">Kelola tim therapist dan analisis performa mereka</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Daftar Therapist</TabsTrigger>
          <TabsTrigger value="assignments">Penugasan</TabsTrigger>
          <TabsTrigger value="create" disabled={!showCreateForm}>
            Tambah Baru
          </TabsTrigger>
        </TabsList>

        {/* Therapist List Tab */}
        <TabsContent value="list" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">3</p>
                    <p className="text-xs text-blue-700">Total Therapist</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">4.8</p>
                    <p className="text-xs text-green-700">Rating Rata-rata</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">35</p>
                    <p className="text-xs text-yellow-700">Total Klien</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">210</p>
                    <p className="text-xs text-purple-700">Total Sesi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <TherapistList
            onCreateNew={handleCreateNew}
            onViewTherapist={(id) => console.log('View therapist:', id)}
            onEditTherapist={(id) => console.log('Edit therapist:', id)}
            onDeleteTherapist={(id) => console.log('Delete therapist:', id)}
          />
        </TabsContent>

        

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <TherapistAssignment />
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create">
          {showCreateForm && (
            <TherapistForm
              onSuccess={handleCreateSuccess}
              onCancel={handleCreateCancel}
            />
          )}
        </TabsContent>
      </Tabs>
    </RoleGuard>
  );
}