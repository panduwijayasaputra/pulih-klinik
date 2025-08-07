import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './useAuth';
import { useNavigationStore } from '@/store/navigation';
import { 
  getNavigationItemsForUser, 
  getPrimaryDashboardConfig,
  roleDisplayInfo 
} from '@/lib/navigation-config';
import { BreadcrumbItem, NavigationItem } from '@/types/navigation';
import { UserRole } from '@/types/auth';

export const useNavigation = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const {
    activeRole,
    availableRoles,
    menuCollapsed,
    breadcrumbs,
    setActiveRole,
    setAvailableRoles,
    toggleMenu,
    setMenuCollapsed,
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs,
    resetNavigation,
  } = useNavigationStore();

  // Update available roles when user changes
  useEffect(() => {
    if (user?.roles) {
      setAvailableRoles(user.roles);
    } else {
      resetNavigation();
    }
  }, [user, setAvailableRoles, resetNavigation]);

  // Get navigation items for current user
  const navigationItems = useMemo(() => {
    if (!user?.roles) return [];
    return getNavigationItemsForUser(user.roles);
  }, [user?.roles]);

  // Get filtered navigation items for active role (if multi-role user wants to focus)
  const filteredNavigationItems = useMemo(() => {
    if (!activeRole) return navigationItems;
    
    return navigationItems.filter(item => 
      item.requiredRoles.includes(activeRole)
    );
  }, [navigationItems, activeRole]);

  // Get primary dashboard configuration
  const primaryDashboard = useMemo(() => {
    if (!user?.roles) return null;
    return getPrimaryDashboardConfig(user.roles);
  }, [user?.roles]);

  // Check if current path matches navigation item
  const isActiveItem = (item: NavigationItem): boolean => {
    if (item.href === pathname) return true;
    
    // Handle dynamic routes
    const dynamicPattern = item.href.replace(/\[.*?\]/g, '[^/]+');
    const regex = new RegExp(`^${dynamicPattern}(/|$)`);
    return regex.test(pathname);
  };

  // Get active navigation item
  const activeNavigationItem = useMemo(() => {
    return navigationItems.find(item => isActiveItem(item));
  }, [navigationItems, pathname]);

  // Role switching functions
  const switchToRole = (role: UserRole) => {
    if (availableRoles.includes(role)) {
      setActiveRole(role);
    }
  };

  const clearActiveRole = () => {
    setActiveRole(null);
  };

  // Role display helpers
  const getRoleDisplayInfo = (role: UserRole) => {
    return roleDisplayInfo[role];
  };

  const getRoleOptions = () => {
    return availableRoles.map(role => ({
      role,
      ...roleDisplayInfo[role],
      isActive: activeRole === role,
    }));
  };

  // Breadcrumb helpers
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      {
        id: 'home',
        label: 'Dashboard',
        href: primaryDashboard?.defaultRoute || '/dashboard',
      }
    ];

    // Build breadcrumbs based on path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Find navigation item for this path
      const navItem = navigationItems.find(item => 
        item.href === currentPath || item.href.includes(`[${segment}]`)
      );

      if (navItem) {
        breadcrumbs.push({
          id: `breadcrumb-${index}`,
          label: navItem.label,
          href: currentPath,
          isActive: index === pathSegments.length - 1,
        });
      } else {
        // Fallback for dynamic segments
        breadcrumbs.push({
          id: `breadcrumb-${index}`,
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
          isActive: index === pathSegments.length - 1,
        });
      }
    });

    return breadcrumbs;
  };

  // Auto-update breadcrumbs when pathname changes
  useEffect(() => {
    const newBreadcrumbs = generateBreadcrumbs();
    setBreadcrumbs(newBreadcrumbs);
  }, [pathname, navigationItems, primaryDashboard, setBreadcrumbs]);

  return {
    // State
    user,
    activeRole,
    availableRoles,
    menuCollapsed,
    breadcrumbs,
    navigationItems,
    filteredNavigationItems,
    activeNavigationItem,
    primaryDashboard,
    
    // Actions
    setActiveRole,
    switchToRole,
    clearActiveRole,
    toggleMenu,
    setMenuCollapsed,
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs,
    
    // Helpers
    isActiveItem,
    getRoleDisplayInfo,
    getRoleOptions,
    generateBreadcrumbs,
    
    // Booleans
    isMultiRole: availableRoles.length > 1,
    hasActiveRole: !!activeRole,
    canSwitchRoles: availableRoles.length > 1,
  };
};