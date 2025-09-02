import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (data: { user: User; token?: string; refreshToken?: string }) => void;
  logout: () => void;
  clearAuthState: () => void;
  clearError: () => void;
  updateTokens: (accessToken: string, refreshToken?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,

      login: (data: { user: User; token?: string; refreshToken?: string }) => {
        set({
          user: data.user,
          isAuthenticated: true,
          token: data.token || null,
          refreshToken: data.refreshToken || null,
          error: null,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          refreshToken: null,
          error: null,
        });
        
        // Redirect to landing page after logout
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },

      clearAuthState: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          refreshToken: null,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      updateTokens: (accessToken: string, refreshToken?: string) => {
        set({
          token: accessToken,
          refreshToken: refreshToken || get().refreshToken,
        });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        refreshToken: state.refreshToken
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