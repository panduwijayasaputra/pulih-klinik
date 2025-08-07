import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginFormData } from '@/types/auth';
import { AuthAPI } from '@/lib/api';

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
            // Store user in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(response.user));
            
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
          localStorage.removeItem('user');
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      checkAuth: async () => {
        set({ isLoading: true });
        
        try {
          const user = await AuthAPI.getCurrentUser();
          
          if (user) {
            set({
              user,
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