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
  
  // Clinic Management Section
  {
    id: 'clinic-management',
    label: 'Manajemen Klinik',
    href: '/portal/clinic',
    icon: BuildingOfficeIcon,
    description: 'Kelola profil dan pengaturan klinik',
    requiredRoles: ['clinic_admin'],
    children: [
      {
        id: 'clinic-overview',
        label: 'Overview Klinik',
        href: '/portal/clinic',
        icon: HomeIcon,
        description: 'Ringkasan status klinik',
        requiredRoles: ['clinic_admin'],
      },
      {
        id: 'clinic-profile',
        label: 'Profil Klinik',
        href: '/portal/clinic#profile',
        icon: BuildingOfficeIcon,
        description: 'Edit informasi dasar klinik',
        requiredRoles: ['clinic_admin'],
      },
      {
        id: 'clinic-branding',
        label: 'Branding',
        href: '/portal/clinic#branding',
        icon: PaintBrushIcon,
        description: 'Kustomisasi logo dan warna',
        requiredRoles: ['clinic_admin'],
      },
      {
        id: 'clinic-settings',
        label: 'Pengaturan',
        href: '/portal/clinic#settings',
        icon: Cog6ToothIcon,
        description: 'Zona waktu dan notifikasi',
        requiredRoles: ['clinic_admin'],
      },
      {
        id: 'clinic-documents',
        label: 'Dokumen',
        href: '/portal/clinic#documents',
        icon: DocumentArrowUpIcon,
        description: 'Upload dokumen legal',
        requiredRoles: ['clinic_admin'],
      },

    ]
  },

  // Therapist Management Section
  {
    id: 'therapist-management',
    label: 'Manajemen Therapist',
    href: '/portal/therapists',
    icon: UserGroupIcon,
    description: 'Kelola tim therapist klinik',
    requiredRoles: ['clinic_admin'],
    children: [
      {
        id: 'therapist-list',
        label: 'Daftar Therapist',
        href: '/portal/therapists',
        icon: UsersIcon,
        description: 'Lihat dan kelola therapist',
        requiredRoles: ['clinic_admin'],
      },
      {
        id: 'therapist-new',
        label: 'Tambah Therapist',
        href: '/portal/therapists/new',
        icon: UserIcon,
        description: 'Daftarkan therapist baru',
        requiredRoles: ['clinic_admin'],
      },

      {
        id: 'therapist-assignments',
        label: 'Penugasan',
        href: '/portal/therapists/assignments',
        icon: CalendarIcon,
        description: 'Atur penugasan therapist ke klien',
        requiredRoles: ['clinic_admin'],
      },
    ]
  },

  // Client Management (to be implemented in next task)
  {
    id: 'client-management',
    label: 'Manajemen Klien',
    href: '/clients',
    icon: UserIcon,
    description: 'Kelola data dan sesi klien',
    requiredRoles: ['administrator', 'clinic_admin', 'therapist'],
    isDisabled: true, // Will be enabled when 4.0-FE-Client-Management is implemented
    children: [
      {
        id: 'client-list',
        label: 'Daftar Klien',
        href: '/clients',
        icon: UsersIcon,
        description: 'Lihat dan kelola klien',
        requiredRoles: ['administrator', 'clinic_admin', 'therapist'],
        isDisabled: true,
      },
      {
        id: 'client-new',
        label: 'Tambah Klien',
        href: '/clients/new',
        icon: UserIcon,
        description: 'Daftarkan klien baru',
        requiredRoles: ['administrator', 'clinic_admin', 'therapist'],
        isDisabled: true,
      },
    ]
  },

  // Assessment System (to be implemented)
  {
    id: 'assessment-system',
    label: 'Sistem Assessment',
    href: '/assessments',
    icon: ClipboardDocumentListIcon,
    description: 'Kelola assessment dan skrip hipnoterapi',
    requiredRoles: ['administrator', 'clinic_admin', 'therapist'],
    isDisabled: true, // Will be enabled when 5.0-FE-Assessment-System is implemented
  },

  // Reports & Analytics
  {
    id: 'reports-analytics',
    label: 'Laporan & Analytics',
    href: '/reports',
    icon: ChartBarIcon,
    description: 'Laporan kinerja dan usage analytics',
    requiredRoles: ['administrator', 'clinic_admin'],
    isDisabled: true, // Will be implemented later
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

  '/portal/therapists/assignments': { label: 'Penugasan Therapist', parent: '/portal/therapists' },
  
  // Future routes (placeholder)
  '/portal/clients': { label: 'Manajemen Klien', parent: '/portal' },
  '/portal/assessments': { label: 'Sistem Assessment', parent: '/portal' },
  '/portal/reports': { label: 'Laporan & Analytics', parent: '/portal' },
};