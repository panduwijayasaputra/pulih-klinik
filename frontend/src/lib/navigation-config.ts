import {
  BuildingOfficeIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UserIcon,
  PaintBrushIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';
import { DashboardConfig, NavigationItem, RoleDisplayInfo } from '@/types/navigation';
import { UserRole } from '@/types/auth';
import { UserRoleEnum } from '@/types/enums';

// Main Dashboard Navigation Items with hierarchical structure
export const dashboardNavigationItems: NavigationItem[] = [
  // Dashboard Home
  {
    id: 'dashboard-home',
    label: 'Dashboard',
    href: '/portal',
    icon: HomeIcon,
    description: 'Halaman utama dashboard',
    requiredRoles: [UserRoleEnum.Administrator, UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist],
  },

  // Clinic Management (for clinic admins)
  {
    id: 'clinic-management',
    label: 'Manajemen Klinik',
    href: '/portal/clinic',
    icon: BuildingOfficeIcon,
    description: 'Kelola profil dan pengaturan klinik',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
    children: [
      {
        id: 'clinic-profile',
        label: 'Profil Klinik',
        href: '/portal/clinic',
        icon: BuildingOfficeIcon,
        description: 'Edit informasi dasar klinik',
        requiredRoles: [UserRoleEnum.ClinicAdmin],
      },
      {
        id: 'clinic-documents',
        label: 'Dokumen Klinik',
        href: '/portal/clinic/documents',
        icon: DocumentArrowUpIcon,
        description: 'Kelola dokumen dan sertifikat',
        requiredRoles: [UserRoleEnum.ClinicAdmin],
      },
      {
        id: 'clinic-branding',
        label: 'Branding & Tampilan',
        href: '/portal/clinic/branding',
        icon: PaintBrushIcon,
        description: 'Atur warna dan tampilan klinik',
        requiredRoles: [UserRoleEnum.ClinicAdmin],
      },
    ],
  },

  // Therapist Management (for clinic admins)
  {
    id: 'therapist-management',
    label: 'Manajemen Therapist',
    href: '/portal/therapists',
    icon: UserGroupIcon,
    description: 'Kelola dan pantau therapist klinik',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },

  // Client Management (now enabled)
  {
    id: 'client-management',
    label: 'Manajemen Klien',
    href: '/portal/clients',
    icon: UserIcon,
    description: 'Kelola data dan histori klien',
    requiredRoles: [UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist],
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
];

// Get navigation items filtered by user roles
export const getNavigationItemsForUser = (userRoles: UserRole[]): NavigationItem[] => {
  return dashboardNavigationItems.filter(item => {
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
    id: 'clinic-profile-quick',
    label: 'Edit Profil Klinik',
    href: '/portal/clinic',
    icon: BuildingOfficeIcon,
    description: 'Perbarui informasi klinik',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },
  {
    id: 'clinic-documents-quick',
    label: 'Kelola Dokumen',
    href: '/portal/clinic/documents',
    icon: DocumentArrowUpIcon,
    description: 'Upload dan kelola dokumen klinik',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },
  {
    id: 'therapist-list-quick',
    label: 'Kelola Therapist',
    href: '/portal/therapists',
    icon: UserGroupIcon,
    description: 'Lihat dan kelola therapist',
    requiredRoles: [UserRoleEnum.ClinicAdmin],
  },
];

// Breadcrumb mapping for dashboard routes
export const dashboardBreadcrumbMapping: Record<string, { label: string; parent?: string }> = {
  '/portal': { label: 'Dashboard' },

  // Clinic routes
  '/portal/clinic': { label: 'Manajemen Klinik', parent: '/portal' },
  '/portal/clinic/documents': { label: 'Dokumen Klinik', parent: '/portal/clinic' },
  '/portal/clinic/branding': { label: 'Branding & Tampilan', parent: '/portal/clinic' },

  // Therapist routes
  '/portal/therapists': { label: 'Manajemen Therapist', parent: '/portal' },
  '/portal/therapists/new': { label: 'Tambah Therapist', parent: '/portal/therapists' },
  '/portal/therapists/edit/[id]': { label: 'Edit Therapist', parent: '/portal/therapists' },
  '/portal/therapists/assignments': { label: 'Penugasan Therapist', parent: '/portal/therapists' },

  // Future routes (placeholder)
  '/portal/clients': { label: 'Manajemen Klien', parent: '/portal' },
  '/portal/assessments': { label: 'Sistem Assessment', parent: '/portal' },
  '/portal/reports': { label: 'Laporan & Analytics', parent: '/portal' },
};

// Dashboard configurations for each role
export const dashboardConfigs: Record<UserRole, DashboardConfig> = {
  [UserRoleEnum.Administrator]: {
    role: UserRoleEnum.Administrator,
    defaultRoute: '/portal',
    allowedRoutes: [
      '/portal',
      '/portal/profile',
      '/portal/clinic/*',
      '/portal/therapists/*',
    ],
    menuItems: [], // Will be populated by getNavigationItemsForUser
  },
  [UserRoleEnum.ClinicAdmin]: {
    role: UserRoleEnum.ClinicAdmin,
    defaultRoute: '/portal',
    allowedRoutes: [
      '/portal',
      '/portal/profile',
      '/portal/clinic/*',
      '/portal/therapists/*',
    ],
    menuItems: [], // Will be populated by getNavigationItemsForUser
  },
  [UserRoleEnum.Therapist]: {
    role: UserRoleEnum.Therapist,
    defaultRoute: '/portal',
    allowedRoutes: [
      '/portal',
      '/portal/profile',
    ],
    menuItems: [], // Will be populated by getNavigationItemsForUser
  },
};

// Get primary dashboard config for user's primary role
export const getPrimaryDashboardConfig = (userRoles: UserRole[]): DashboardConfig | null => {
  if (!userRoles || userRoles.length === 0) return null;

  const primaryRole = userRoles[0];
  if (!primaryRole) return null;

  return dashboardConfigs[primaryRole] || null;
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