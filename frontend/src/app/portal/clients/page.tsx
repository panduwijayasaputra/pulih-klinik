'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClientFilters, useClients } from '@/hooks/useClients';
import { useClientStore } from '@/store/clients';
import { ClientList } from '@/components/dashboard/ClientList';
import { ClientForm } from '@/components/dashboard/ClientForm';
import { ClientProfile } from '@/components/dashboard/ClientProfile';
import { ClientAssignment } from '@/components/dashboard/ClientAssignment';
import { UsageMetrics } from '@/components/dashboard/UsageMetrics';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, UserCheck, BarChart3 } from 'lucide-react';

export default function ClientsPage() {
  const searchParams = useSearchParams();
  const { clients, loading, error, addClient } = useClients();
  const {
    filters,
    selectedClient,
    isCreateModalOpen,
    isProfileModalOpen,
    setFilters,
    openCreateModal,
    closeCreateModal,
    closeProfileModal
  } = useClientStore();

  const filteredClients = useClientFilters(clients, filters);

  // Get initial tab from URL params
  const initialTab = searchParams.get('tab') || 'list';

  const handleAssignmentChange = () => {
    // Trigger a refresh or re-fetch if needed
    // For now, the components will update automatically through their hooks
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Klien</h1>
          <p className="text-gray-600">Kelola data klien dan pantau progres terapi</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Klien
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Tabs for Different Views */}
      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Daftar Klien
          </TabsTrigger>
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Penugasan Terapis
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Metrik Penggunaan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <ClientList
            clients={filteredClients}
            loading={loading}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </TabsContent>

        <TabsContent value="assignment" className="space-y-6">
          <ClientAssignment 
            clients={clients} 
            onAssignmentChange={handleAssignmentChange}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <UsageMetrics />
        </TabsContent>
      </Tabs>

      {/* Create Client Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Klien Baru</DialogTitle>
          </DialogHeader>
          <ClientForm onSubmit={addClient} onCancel={closeCreateModal} />
        </DialogContent>
      </Dialog>

      {/* Client Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={closeProfileModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profil Klien</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientProfile client={selectedClient} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}