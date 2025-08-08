'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';

interface Therapist {
  id: string;
  name: string;
  email: string;
  specialization: string;
  status: 'active' | 'pending_setup' | 'inactive';
  sessions_completed: number;
  client_satisfaction: number;
  lastActive?: string;
  registrationDate: string;
}

export const TherapistDashboard: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  
  const { user } = useAuth();
  const { addToast } = useToast();

  // Load therapist data
  const loadTherapistData = useCallback(async () => {
    console.log('🔄 TherapistDashboard: Starting to load therapist data...');
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 400));

      // Mock therapists data
      setTherapists([
        {
          id: 'th-1',
          name: 'Dr. Budi Santoso',
          email: 'budi@kliniksehat.com',
          specialization: 'Anxiety Disorders',
          status: 'active',
          sessions_completed: 45,
          client_satisfaction: 4.8,
          lastActive: '2 hours ago',
          registrationDate: '2024-01-10'
        },
        {
          id: 'th-2',
          name: 'Dr. Siti Rahayu',
          email: 'siti@kliniksehat.com',
          specialization: 'Depression',
          status: 'active',
          sessions_completed: 32,
          client_satisfaction: 4.9,
          lastActive: '4 hours ago',
          registrationDate: '2024-01-08'
        },
        {
          id: 'th-3',
          name: 'Dr. Ahmad Pratama',
          email: 'ahmad@kliniksehat.com',
          specialization: 'PTSD',
          status: 'pending_setup',
          sessions_completed: 0,
          client_satisfaction: 0,
          lastActive: 'Never',
          registrationDate: '2024-01-12'
        },
        {
          id: 'th-4',
          name: 'Dr. Maya Sari',
          email: 'maya@kliniksehat.com',
          specialization: 'Anxiety Disorders',
          status: 'pending_setup',
          sessions_completed: 0,
          client_satisfaction: 0,
          lastActive: 'Never',
          registrationDate: '2024-01-14'
        }
      ]);

      console.log('✅ TherapistDashboard: Therapist data loaded successfully');
    } catch (error) {
      console.error('Failed to load data:', error);
      addToast({
        type: 'error',
        title: 'Loading Failed',
        message: 'Failed to load therapist data. Please refresh the page.'
      });
    } finally {
      setLoading(false);
    }
  }, []); // Remove addToast dependency

  useEffect(() => {
    loadTherapistData();
  }, []); // Remove loadTherapistData dependency

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending_setup':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Setup</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : 'N/A';
  };

  const filteredTherapists = therapists.filter(therapist => {
    if (selectedFilter === 'all') return true;
    return therapist.status === selectedFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading therapists...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">Therapist List</h2>
          
          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filter:</span>
            {(['all', 'active', 'pending', 'inactive'] as const).map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="text-xs"
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                {filter !== 'all' && (
                  <Badge variant="secondary" className="ml-1">
                    {therapists.filter(t => filter === 'all' ? true : t.status === filter).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredTherapists.length} of {therapists.length} therapists
        </div>
      </div>

      {/* Therapist List */}
      <div className="space-y-4">
        {filteredTherapists.map((therapist) => (
          <Card key={therapist.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{therapist.name}</h3>
                    {getStatusBadge(therapist.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Email:</span> {therapist.email}
                    </div>
                    <div>
                      <span className="font-medium">Specialization:</span> {therapist.specialization}
                    </div>
                    <div>
                      <span className="font-medium">Sessions:</span> {therapist.sessions_completed}
                    </div>
                    <div>
                      <span className="font-medium">Rating:</span> {formatRating(therapist.client_satisfaction)}/5
                    </div>
                  </div>
                  
                  {therapist.lastActive && (
                    <div className="mt-2 text-xs text-gray-500">
                      Last active: {therapist.lastActive}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTherapists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No therapists found</h3>
          <p className="text-gray-600">
            {selectedFilter === 'all' 
              ? 'No therapists have been added yet.' 
              : `No therapists with status "${selectedFilter}" found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};
