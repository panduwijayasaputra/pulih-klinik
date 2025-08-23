import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginFormData, User } from '@/types/auth';
import { AuthAPI } from '@/lib/api/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (credentials: LoginFormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await AuthAPI.login(credentials);
          
          if (response.success && response.user) {
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            return true;
          } else {
            set({
              error: response.message || 'Login gagal',
              isLoading: false,
            });
            return false;
          }
        } catch {
          set({
            error: 'Terjadi kesalahan saat login',
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await AuthAPI.logout();
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          
          // Redirect to landing page after logout
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        } catch {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      checkAuth: async () => {
        set({ isLoading: true });
        
        try {
          const response = await AuthAPI.getCurrentUser();
          
          if (response.success && response.data) {
            set({
              user: response.data as User,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
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