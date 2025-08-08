import { ClinicSubscription } from '@/types/clinic';

// Mock subscription data for development
export const mockSubscriptionData: ClinicSubscription = {
  clinicId: 'clinic-001',
  tier: 'alpha',
  status: 'active',
  limits: {
    therapists: 3,
    clientsPerDay: 15,
    scriptsPerDay: 50
  },
  usage: {
    therapists: 2,
    clientsToday: 8,
    scriptsToday: 12,
    clientsThisMonth: 120,
    scriptsThisMonth: 180
  },
  billing: {
    amount: 100000,
    currency: 'IDR',
    nextBilling: '2024-03-01T00:00:00.000Z',
    lastPayment: '2024-02-01T00:00:00.000Z',
    paymentMethod: 'Bank Transfer'
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-02-01T00:00:00.000Z'
};

// Initialize mock data in clinic store
export const initializeMockData = async () => {
  if (typeof window !== 'undefined') {
    // Only run in browser environment
    try {
      const { useClinicStore } = await import('@/store/clinic');
      const store = useClinicStore.getState();
      
      if (!store.subscription) {
        console.log('Initializing mock subscription data...');
        store.setSubscription(mockSubscriptionData);
        
        // Verify data was set
        const updatedStore = useClinicStore.getState();
        console.log('Mock data initialized:', updatedStore.subscription);
      }
    } catch (error) {
      console.error('Failed to initialize mock data:', error);
    }
  }
};