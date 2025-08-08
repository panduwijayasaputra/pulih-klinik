import { useCallback, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './useAuth';
import { useNavigationStore } from '@/store/navigation';
import { 
  getNavigationItemsForUser, 
  getPrimaryDashboardConfig,
  roleDisplayInfo,
  dashboardBreadcrumbMapping 
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
    
    // Use full navigation items for portal routes
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
  const isActiveItem = useCallback((item: NavigationItem): boolean => {
    if (item.href === pathname) return true;
    
    // Handle dynamic routes
    const dynamicPattern = item.href.replace(/\[.*?\]/g, '[^/]+');
    const regex = new RegExp(`^${dynamicPattern}(/|$)`);
    return regex.test(pathname);
  }, [pathname]);

  // Get active navigation item
  const activeNavigationItem = useMemo(() => {
    return navigationItems.find(item => isActiveItem(item));
  }, [navigationItems, isActiveItem]);

  // Role switching functions with validation
  const switchToRole = useCallback((role: UserRole) => {
    if (availableRoles.includes(role)) {
      setActiveRole(role);
    } else {
      console.warn(`Cannot switch to role ${role}: not available for current user`);
    }
  }, [availableRoles, setActiveRole]);

  const clearActiveRole = useCallback(() => {
    setActiveRole(null);
  }, [setActiveRole]);

  // Role display helpers
  const getRoleDisplayInfo = useCallback((role: UserRole) => {
    return roleDisplayInfo[role];
  }, []);

  const getRoleOptions = useMemo(() => {
    return availableRoles.map(role => ({
      role,
      ...roleDisplayInfo[role],
      isActive: activeRole === role,
    }));
  }, [availableRoles, activeRole, getRoleDisplayInfo]);

  // Breadcrumb helpers
  const generateBreadcrumbs = useCallback((): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Portal-based breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = [
      {
        id: 'home',
        label: 'Dashboard',
        href: '/portal',
      }
    ];

    // If we're already on the root portal route, don't add additional breadcrumbs
    if (pathname === '/portal') {
      return breadcrumbs;
    }

    // Use the dashboard breadcrumb mapping for portal routes
    const mapping = dashboardBreadcrumbMapping[pathname];
    if (mapping) {
      // Build breadcrumb chain
      const chain: BreadcrumbItem[] = [];
      let currentPath = pathname;
      let counter = 0;
      
      while (currentPath && counter < 10) { // Prevent infinite loops
        const pathMapping = dashboardBreadcrumbMapping[currentPath];
        if (pathMapping) {
          chain.unshift({
            id: `breadcrumb-${counter}`,
            label: pathMapping.label,
            href: currentPath,
            isActive: currentPath === pathname,
          });
          currentPath = pathMapping.parent || '';
        } else {
          break;
        }
        counter++;
      }
      
      // Remove the portal breadcrumb if it's already added
      const filteredChain = chain.filter(item => item.href !== '/portal');
      breadcrumbs.push(...filteredChain);
    } else {
      // Fallback for unmapped routes
      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        
        // Skip if this is the portal route (already added as first breadcrumb)
        if (currentPath === '/portal') {
          return;
        }
        
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
    }

    return breadcrumbs;
  }, [pathname, navigationItems]);

  // Auto-update breadcrumbs when pathname changes
  useEffect(() => {
    const newBreadcrumbs = generateBreadcrumbs();
    setBreadcrumbs(newBreadcrumbs);
  }, [generateBreadcrumbs, setBreadcrumbs]);

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