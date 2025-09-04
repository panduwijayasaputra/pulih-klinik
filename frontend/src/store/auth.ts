import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, Clinic } from '@/types/auth';

interface AuthStore extends AuthState {
  // Core auth actions
  login: (data: { user: User; clinic?: Clinic; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  clearError: () => void;
  
  // User and clinic management
  setUser: (user: User | null) => void;
  setClinic: (clinic: Clinic | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  
  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Token management
  updateTokens: (accessToken: string, refreshToken?: string) => void;
  refreshTokens: () => Promise<boolean>;
  
  // Data validation
  setLastValidated: (date: Date) => void;
  isDataStale: () => boolean;
  
  // Helper methods
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isClinicAdmin: () => boolean;
  isTherapist: () => boolean;
  needsOnboarding: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      clinic: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      lastValidated: new Date(),

      // Core auth actions
      login: (data: { user: User; clinic?: Clinic; accessToken: string; refreshToken: string }) => {
        set({
          user: data.user,
          clinic: data.clinic || null,
          isAuthenticated: true,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          lastValidated: new Date(),
          error: null,
        });
      },

      logout: () => {
        set({
          user: null,
          clinic: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          lastValidated: new Date(),
          error: null,
        });
        
        // Redirect to landing page after logout
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },

      clearError: () => set({ error: null }),

      // User and clinic management
      setUser: (user: User | null) => {
        set({ user });
        if (user) {
          set({ lastValidated: new Date() });
        }
      },

      setClinic: (clinic: Clinic | null) => {
        set({ clinic });
        if (clinic) {
          set({ lastValidated: new Date() });
        }
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ 
          accessToken, 
          refreshToken,
          lastValidated: new Date()
        });
      },

      // Loading and error states
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      // Token management
      updateTokens: (accessToken: string, refreshToken?: string) => {
        set({
          accessToken,
          refreshToken: refreshToken || get().refreshToken,
          lastValidated: new Date(),
        });
      },

      refreshTokens: async (): Promise<boolean> => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          // This will be implemented in the auth hook
          // For now, just return false to indicate no refresh happened
          return false;
        } catch (error) {
          set({ error: 'Failed to refresh tokens' });
          return false;
        }
      },

      // Data validation
      setLastValidated: (date: Date) => set({ lastValidated: date }),
      
      isDataStale: (): boolean => {
        const { lastValidated } = get();
        if (!lastValidated) return true;
        
        // Consider data stale after 10 minutes (reduced API calls)
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        return lastValidated < tenMinutesAgo;
      },

      // Helper methods
      hasRole: (role: string): boolean => {
        const { user } = get();
        return user?.roles.includes(role as any) || false;
      },

      isAdmin: (): boolean => {
        return get().hasRole('administrator');
      },

      isClinicAdmin: (): boolean => {
        return get().hasRole('clinic_admin');
      },

      isTherapist: (): boolean => {
        return get().hasRole('therapist');
      },

      needsOnboarding: (): boolean => {
        const { user, clinic } = get();
        if (!user || !get().isClinicAdmin()) return false;
        
        // Clinic admin needs onboarding if no clinic or no subscription
        return !clinic || !clinic.subscription;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        clinic: state.clinic,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        lastValidated: state.lastValidated,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, make sure loading is false
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);