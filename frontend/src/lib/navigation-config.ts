import {
  BanknotesIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  DocumentTextIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { DashboardConfig, NavigationItem } from '@/types/navigation';
import { UserRole } from '@/types/auth';

// Navigation items for Administrator (without dashboard - handled separately)
export const adminNavigationItems: NavigationItem[] = [
];

// Navigation items for Clinic Admin (without dashboard - handled separately)
export const clinicAdminNavigationItems: NavigationItem[] = [
  {
    id: 'clinic-therapists',
    label: 'Manajemen Therapist',
    href: '/portal/therapists',
    icon: UserGroupIcon,
    description: 'Kelola dan pantau therapist klinik',
    requiredRoles: ['clinic_admin'],
  }
];

// Navigation items for Therapist (without dashboard - handled separately)
export const therapistNavigationItems: NavigationItem[] = [
];

// Dashboard navigation item (appears first for all users)
export const dashboardNavigationItem: NavigationItem = {
  id: 'main-dashboard',
  label: 'Dashboard',
  href: '/portal',
  icon: HomeIcon,
  description: 'Halaman utama dashboard',
  requiredRoles: ['administrator', 'clinic_admin', 'therapist'],
};

// Common navigation items (available to all authenticated users)
export const commonNavigationItems: NavigationItem[] = [
  {
    id: 'profile',
    label: 'Profil Saya',
    href: '/portal/profile',
    icon: UserIcon,
    description: 'Pengaturan akun pribadi',
    requiredRoles: ['administrator', 'clinic_admin', 'therapist'],
  },
];

// Dashboard configurations for each role
export const dashboardConfigs: Record<UserRole, DashboardConfig> = {
  administrator: {
    role: 'administrator',
    defaultRoute: '/portal',
    allowedRoutes: [
      '/portal',
      '/portal/profile',
    ],
    menuItems: [...adminNavigationItems, ...commonNavigationItems],
  },
  clinic_admin: {
    role: 'clinic_admin',
    defaultRoute: '/portal',
    allowedRoutes: [
      '/portal',
      '/portal/therapists',
      '/portal/therapists/new',
      '/portal/therapists/edit/[id]',
      '/portal/profile',
    ],
    menuItems: [...clinicAdminNavigationItems, ...commonNavigationItems],
  },
  therapist: {
    role: 'therapist',
    defaultRoute: '/portal',
    allowedRoutes: [
      '/portal',
      '/portal/profile',
    ],
    menuItems: [...therapistNavigationItems, ...commonNavigationItems],
  },
};

// Get navigation items for user based on their roles with proper ordering
export const getNavigationItemsForUser = (userRoles: UserRole[]): NavigationItem[] => {
  const allItems = new Map<string, NavigationItem>();

  // Always add dashboard first
  allItems.set(dashboardNavigationItem.id, dashboardNavigationItem);

  // Define priority order for navigation sections
  const rolePriority: UserRole[] = ['administrator', 'clinic_admin', 'therapist'];

  // Add items in priority order
  rolePriority.forEach(role => {
    if (userRoles.includes(role)) {
      const config = dashboardConfigs[role];
      if (config) {
        config.menuItems.forEach(item => {
          // Check if user has required role for this item
          const hasRequiredRole = item.requiredRoles.some(requiredRole =>
            userRoles.includes(requiredRole)
          );

          if (hasRequiredRole) {
            allItems.set(item.id, item);
          }
        });
      }
    }
  });

  return Array.from(allItems.values());
};

// Get primary dashboard config for user's primary role
export const getPrimaryDashboardConfig = (userRoles: UserRole[]): DashboardConfig | null => {
  if (!userRoles || userRoles.length === 0) return null;

  const primaryRole = userRoles[0];
  if (!primaryRole) return null;

  return dashboardConfigs[primaryRole] || null;
};

// Role display information
export const roleDisplayInfo = {
  administrator: {
    label: 'Administrator Sistem',
    description: 'Akses penuh ke semua fitur sistem',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: ShieldCheckIcon,
  },
  clinic_admin: {
    label: 'Administrator Klinik',
    description: 'Mengelola klinik dan therapist',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: BuildingOfficeIcon,
  },
  therapist: {
    label: 'Therapist',
    description: 'Menangani klien dan sesi hipnoterapi',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: UserIcon,
  },
};