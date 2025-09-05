import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BreadcrumbItem, NavigationState } from '@/types/navigation';
import { UserRole } from '@/types/auth';

interface NavigationStore extends NavigationState {
  isRoleSwitching: boolean;
  setActiveRole: (role: UserRole | null) => void;
  setAvailableRoles: (roles: UserRole[]) => void;
  toggleMenu: () => void;
  setMenuCollapsed: (collapsed: boolean) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  addBreadcrumb: (breadcrumb: BreadcrumbItem) => void;
  clearBreadcrumbs: () => void;
  resetNavigation: () => void;
  setRoleSwitching: (switching: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      activeRole: null,
      availableRoles: [],
      menuCollapsed: false,
      breadcrumbs: [],
      isRoleSwitching: false,

      setActiveRole: (role: UserRole | null) => {
        const { availableRoles } = get();
        // Validate that the role is available for the current user
        if (role && !availableRoles.includes(role)) {
          console.warn(`Role ${role} is not available for current user`);
          return;
        }
        set({ activeRole: role });
      },

      setAvailableRoles: (roles: UserRole[]) => {
        const { activeRole } = get();
        
        // Only update activeRole if it's currently null or invalid
        // Don't override manually selected roles
        let newActiveRole = activeRole;
        
        // Only reset active role if it's invalid, but don't auto-set to first role
        // Let the useNavigation hook handle auto-setting based on path
        if (activeRole && !roles.includes(activeRole)) {
          newActiveRole = null;
        }
        
        set({ 
          availableRoles: roles,
          activeRole: newActiveRole
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
          isRoleSwitching: false,
        });
      },

      setRoleSwitching: (switching: boolean) => {
        set({ isRoleSwitching: switching });
      },
    }),
    {
      name: 'navigation-storage',
      partialize: (state) => ({ 
        menuCollapsed: state.menuCollapsed,
        activeRole: state.activeRole,
        availableRoles: state.availableRoles, // Include availableRoles in persistence
      }),
    }
  )
);