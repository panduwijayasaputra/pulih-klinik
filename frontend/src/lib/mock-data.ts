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
export const initializeMockData = () => {
  if (typeof window !== 'undefined') {
    // Only run in browser environment
    import('@/store/clinic').then(({ useClinicStore }) => {
      const store = useClinicStore.getState();
      if (!store.subscription) {
        store.setSubscription(mockSubscriptionData);
      }
    });
  }
};