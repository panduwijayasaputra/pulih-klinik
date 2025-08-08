import { 
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  PaintBrushIcon,
  DocumentArrowUpIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { NavigationItem } from '@/types/navigation';
import { UserRole } from '@/types/auth';

// Dashboard Navigation Items for Clinic Management
export const dashboardNavigationItems: NavigationItem[] = [
  // Dashboard Home
  {
    id: 'dashboard-home',
    label: 'Dashboard',
    href: '/portal',
    icon: HomeIcon,
    description: 'Halaman utama dashboard',
    requiredRoles: ['administrator', 'clinic_admin', 'therapist'],
  },
  // Therapist Management (for clinic admins)
  {
    id: 'therapist-management',
    label: 'Manajemen Therapist',
    href: '/portal/therapists',
    icon: UserGroupIcon,
    description: 'Kelola dan pantau therapist klinik',
    requiredRoles: ['clinic_admin'],
  },
];

// Get navigation items filtered by user roles
export const getDashboardNavigationForRoles = (userRoles: UserRole[]): NavigationItem[] => {
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
  });
};

// Quick access items for dashboard overview
export const quickAccessItems = [
  {
    id: 'clinic-profile-quick',
    label: 'Edit Profil Klinik',
    href: '/portal/clinic#profile',
    icon: BuildingOfficeIcon,
    description: 'Perbarui informasi klinik',
    requiredRoles: ['clinic_admin'] as UserRole[],
  },
  {
    id: 'therapist-list-quick',
    label: 'Kelola Therapist',
    href: '/portal/therapists',
    icon: UserGroupIcon,
    description: 'Lihat dan kelola therapist',
    requiredRoles: ['clinic_admin'] as UserRole[],
  },


];

// Breadcrumb mapping for dashboard routes
export const dashboardBreadcrumbMapping: Record<string, { label: string; parent?: string }> = {
  '/portal': { label: 'Dashboard' },
  
  // Clinic routes
  '/portal/clinic': { label: 'Manajemen Klinik', parent: '/portal' },
  
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