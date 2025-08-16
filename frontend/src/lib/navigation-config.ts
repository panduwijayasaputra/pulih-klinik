import {
  BuildingOfficeIcon,
  CalendarIcon,
  CogIcon,
  DocumentArrowUpIcon,
  HeartIcon,
  HomeIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { NavigationItem, PortalConfig, RoleDisplayInfo } from '@/types/navigation';
import { UserRole } from '@/types/auth';
import { UserRoleEnum } from '@/types/enums';

// Main Portal Navigation Items with hierarchical structure
export const portalNavigationItems: NavigationItem[] = [
  // Portal Home - Role-specific portals
  {
    id: 'portal-clinic',
    label: 'Portal',
    href: '/portal/clinic',
    icon: HomeIcon,
    description: 'Portal klinik',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },
  {
    id: 'portal-therapist',
    label: 'Portal',
    href: '/portal/therapist',
    icon: HomeIcon,
    description: 'Portal therapist',
    requiredRoles: [UserRoleEnum.Therapist],
  },
  {
    id: 'portal-admin',
    label: 'Portal',
    href: '/portal/admin',
    icon: HomeIcon,
    description: 'Portal administrator',
    requiredRoles: [UserRoleEnum.Administrator],
  },

  // Clinic Admin Routes
  {
    id: 'clinic-management',
    label: 'Manajemen Klinik',
    href: '/portal/clinic/manage',
    icon: BuildingOfficeIcon,
    description: 'Kelola profil dan pengaturan klinik',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },
  {
    id: 'clinic-therapist-management',
    label: 'Manajemen Therapist',
    href: '/portal/clinic/therapists',
    icon: UserGroupIcon,
    description: 'Kelola dan pantau therapist klinik',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },
  {
    id: 'clinic-client-management',
    label: 'Manajemen Klien',
    href: '/portal/clinic/clients',
    icon: UserIcon,
    description: 'Kelola data dan histori klien',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },

  // Therapist Routes
  {
    id: 'therapist-clients',
    label: 'Klien Saya',
    href: '/portal/therapist/clients',
    icon: UserIcon,
    description: 'Kelola klien yang ditugaskan kepada Anda',
    requiredRoles: [UserRoleEnum.Therapist],
  },
  {
    id: 'therapist-sessions',
    label: 'Sesi Terapi',
    href: '/portal/therapist/sessions',
    icon: CalendarIcon,
    description: 'Kelola sesi terapi dan jadwal',
    requiredRoles: [UserRoleEnum.Therapist],
  },

  // Admin Routes
  {
    id: 'admin-clinic-management',
    label: 'Manajemen Klinik',
    href: '/portal/admin/clinics',
    icon: BuildingOfficeIcon,
    description: 'Kelola semua klinik dalam sistem',
    requiredRoles: [UserRoleEnum.Administrator],
  },
];

// Common navigation items (available to all authenticated users)
export const commonNavigationItems: NavigationItem[] = [
  {
    id: 'profile',
    label: 'Profil Saya',
    href: '/portal/profile',
    icon: UserIcon,
    description: 'Pengaturan akun pribadi',
    requiredRoles: [UserRoleEnum.Administrator, UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist],
  },
  {
    id: 'settings',
    label: 'Pengaturan',
    href: '/portal/settings',
    icon: CogIcon,
    description: 'Pengaturan sistem',
    requiredRoles: [UserRoleEnum.Administrator, UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist],
  },
];

// Get navigation items filtered by user roles
export const getNavigationItemsForUser = (userRoles: UserRole[]): NavigationItem[] => {
  return portalNavigationItems.filter(item => {
    return item.requiredRoles.some(requiredRole => userRoles.includes(requiredRole));
  }).map(item => {
    // Filter children based on roles too
    if (item.children) {
      const filteredChildren = item.children.filter(child =>
        child.requiredRoles.some(requiredRole => userRoles.includes(requiredRole))
      );
      return {
        ...item,
        children: filteredChildren
      };
    }
    return item;
  }).concat(commonNavigationItems.filter(item =>
    item.requiredRoles.some(requiredRole => userRoles.includes(requiredRole))
  ));
};

// Quick access items for dashboard overview
export const quickAccessItems = [
  {
    id: 'clinic-management-quick',
    label: 'Manajemen Klinik',
    href: '/portal/clinic/manage',
    icon: BuildingOfficeIcon,
    description: 'Kelola profil dan pengaturan klinik',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },
  {
    id: 'therapist-list-quick',
    label: 'Kelola Therapist',
    href: '/portal/clinic/therapists',
    icon: UserGroupIcon,
    description: 'Lihat dan kelola therapist',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },
  {
    id: 'clinic-clients-quick',
    label: 'Manajemen Klien',
    href: '/portal/clinic/clients',
    icon: UserIcon,
    description: 'Kelola data dan histori klien klinik',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },
  {
    id: 'my-clients-quick',
    label: 'Klien Saya',
    href: '/portal/therapist/clients',
    icon: UserIcon,
    description: 'Lihat dan kelola klien yang ditugaskan',
    requiredRoles: [UserRoleEnum.Therapist],
  },
  {
    id: 'therapist-sessions-quick',
    label: 'Sesi Terapi',
    href: '/portal/therapist/sessions',
    icon: CalendarIcon,
    description: 'Kelola sesi terapi dan jadwal',
    requiredRoles: [UserRoleEnum.Therapist],
  },
  {
    id: 'admin-clinics-quick',
    label: 'Manajemen Klinik',
    href: '/portal/admin/clinics',
    icon: BuildingOfficeIcon,
    description: 'Kelola semua klinik dalam sistem',
    requiredRoles: [UserRoleEnum.Administrator],
  },
];

// Breadcrumb mapping for portal routes
export const portalBreadcrumbMapping: Record<string, { label: string; parent?: string }> = {
  '/portal': { label: 'Portal' },

  // Role-specific portals (show as Dashboard)
  '/portal/admin': { label: 'Dashboard', parent: '/portal' },
  '/portal/clinic': { label: 'Dashboard', parent: '/portal' },
  '/portal/therapist': { label: 'Dashboard', parent: '/portal' },

  // Clinic Admin routes
  '/portal/clinic/manage': { label: 'Manajemen Klinik', parent: '/portal' },
  '/portal/clinic/therapists': { label: 'Manajemen Therapist', parent: '/portal' },
  '/portal/clinic/therapists/new': { label: 'Tambah Therapist', parent: '/portal/clinic/therapists' },
  '/portal/clinic/therapists/edit/[id]': { label: 'Edit Therapist', parent: '/portal/clinic/therapists' },
  '/portal/clinic/clients': { label: 'Manajemen Klien', parent: '/portal' },
  '/portal/clinic/clients/[code]': { label: 'Detail Klien', parent: '/portal/clinic/clients' },

  // Therapist routes
  '/portal/therapist/clients': { label: 'Klien Saya', parent: '/portal' },
  '/portal/therapist/clients/[id]': { label: 'Detail Klien', parent: '/portal/therapist/clients' },
  '/portal/therapist/therapy/[clientId]': { label: 'Sesi Terapi', parent: '/portal/therapist/clients' },
  '/portal/therapist/sessions': { label: 'Sesi Terapi', parent: '/portal' },
  '/portal/therapist/sessions/[id]': { label: 'Detail Sesi', parent: '/portal/therapist/sessions' },
  '/portal/therapist/session/[sessionId]': { label: 'Detail Sesi', parent: '/portal/therapist/sessions' },

  // System Admin routes
  '/portal/admin/clinics': { label: 'Manajemen Klinik', parent: '/portal' },
  '/portal/admin/clinics/[id]': { label: 'Detail Klinik', parent: '/portal/admin/clinics' },

  // Common routes
  '/portal/profile': { label: 'Profil Saya', parent: '/portal' },
  '/portal/settings': { label: 'Pengaturan', parent: '/portal' },
};

// Portal configurations for each role
export const portalConfigs: Record<UserRole, PortalConfig> = {
  [UserRoleEnum.Administrator]: {
    role: UserRoleEnum.Administrator,
    defaultRoute: '/portal/admin',
    allowedRoutes: [
      '/portal',
      '/portal/admin/*',
      '/portal/profile',
      '/portal/settings',
    ],
    menuItems: [], // Will be populated by getNavigationItemsForUser
  },
  [UserRoleEnum.ClinicAdmin]: {
    role: UserRoleEnum.ClinicAdmin,
    defaultRoute: '/portal/clinic',
    allowedRoutes: [
      '/portal',
      '/portal/clinic/*',
      '/portal/profile',
      '/portal/settings',
    ],
    menuItems: [], // Will be populated by getNavigationItemsForUser
  },
  [UserRoleEnum.Therapist]: {
    role: UserRoleEnum.Therapist,
    defaultRoute: '/portal/therapist',
    allowedRoutes: [
      '/portal',
      '/portal/therapist/*',
      '/portal/therapist/therapy/*',
      '/portal/therapist/session/*',
      '/portal/profile',
      '/portal/settings',
    ],
    menuItems: [], // Will be populated by getNavigationItemsForUser
  },
};

// Get primary portal config for user's primary role
export const getPrimaryPortalConfig = (userRoles: UserRole[]): PortalConfig | null => {
  if (!userRoles || userRoles.length === 0) return null;

  const primaryRole = userRoles[0];
  if (!primaryRole) return null;

  return portalConfigs[primaryRole] || null;
};

// Role display information
export const roleDisplayInfo: Record<UserRole, RoleDisplayInfo> = {
  [UserRoleEnum.Administrator]: {
    label: 'Administrator Sistem',
    description: 'Akses penuh ke semua fitur sistem',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: ShieldCheckIcon,
  },
  [UserRoleEnum.ClinicAdmin]: {
    label: 'Administrator Klinik',
    description: 'Mengelola klinik dan therapist',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: BuildingOfficeIcon,
  },
  [UserRoleEnum.Therapist]: {
    label: 'Therapist',
    description: 'Menangani klien dan sesi hipnoterapi',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: UserIcon,
  },
};