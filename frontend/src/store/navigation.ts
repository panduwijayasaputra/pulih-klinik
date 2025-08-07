import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BreadcrumbItem, NavigationState } from '@/types/navigation';
import { UserRole } from '@/types/auth';

interface NavigationStore extends NavigationState {
  setActiveRole: (role: UserRole | null) => void;
  setAvailableRoles: (roles: UserRole[]) => void;
  toggleMenu: () => void;
  setMenuCollapsed: (collapsed: boolean) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  addBreadcrumb: (breadcrumb: BreadcrumbItem) => void;
  clearBreadcrumbs: () => void;
  resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      activeRole: null,
      availableRoles: [],
      menuCollapsed: false,
      breadcrumbs: [],

      setActiveRole: (role: UserRole | null) => {
        set({ activeRole: role });
      },

      setAvailableRoles: (roles: UserRole[]) => {
        const { activeRole } = get();
        set({ 
          availableRoles: roles,
          // Set active role to first available role if not set or invalid
          activeRole: !activeRole || !roles.includes(activeRole) ? roles[0] || null : activeRole
        });
      },

      toggleMenu: () => {
        set(state => ({ menuCollapsed: !state.menuCollapsed }));
      },

      setMenuCollapsed: (collapsed: boolean) => {
        set({ menuCollapsed: collapsed });
      },

      setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => {
        set({ breadcrumbs });
      },

      addBreadcrumb: (breadcrumb: BreadcrumbItem) => {
        const { breadcrumbs } = get();
        // Don't add if already exists
        if (breadcrumbs.find(b => b.id === breadcrumb.id)) return;
        
        set({ breadcrumbs: [...breadcrumbs, breadcrumb] });
      },

      clearBreadcrumbs: () => {
        set({ breadcrumbs: [] });
      },

      resetNavigation: () => {
        set({
          activeRole: null,
          availableRoles: [],
          menuCollapsed: false,
          breadcrumbs: [],
        });
      },
    }),
    {
      name: 'navigation-storage',
      partialize: (state) => ({ 
        menuCollapsed: state.menuCollapsed,
        activeRole: state.activeRole,
      }),
    }
  )
);