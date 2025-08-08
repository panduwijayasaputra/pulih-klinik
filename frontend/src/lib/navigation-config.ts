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
  {
    id: 'admin-clinics',
    label: 'Kelola Klinik',
    href: '/portal#clinics',
    icon: BuildingOfficeIcon,
    description: 'Manajemen klinik terdaftar',
    requiredRoles: ['administrator'],
  },
  {
    id: 'admin-users',
    label: 'Kelola Pengguna',
    href: '/portal#users',
    icon: UserGroupIcon,
    description: 'Manajemen akun pengguna',
    requiredRoles: ['administrator'],
  },
  {
    id: 'admin-system',
    label: 'Pengaturan Sistem',
    href: '/portal#system',
    icon: CogIcon,
    description: 'Konfigurasi sistem global',
    requiredRoles: ['administrator'],
  },
  {
    id: 'admin-analytics',
    label: 'Analytics',
    href: '/portal#analytics',
    icon: ChartBarIcon,
    description: 'Laporan dan analisis penggunaan',
    requiredRoles: ['administrator'],
  },
];

// Navigation items for Clinic Admin (without dashboard - handled separately)
export const clinicAdminNavigationItems: NavigationItem[] = [
  {
    id: 'clinic-therapists',
    label: 'Kelola Therapist',
    href: '/portal/clinic/therapists',
    icon: UserGroupIcon,
    description: 'Manajemen therapist klinik',
    requiredRoles: ['clinic_admin'],
  },
  {
    id: 'clinic-clients',
    label: 'Data Klien',
    href: '/portal/clients',
    icon: UserIcon,
    description: 'Manajemen data klien',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
  {
    id: 'clinic-sessions',
    label: 'Sesi Hipnoterapi',
    href: '/portal/sessions',
    icon: ClipboardDocumentListIcon,
    description: 'Riwayat dan jadwal sesi',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
  {
    id: 'clinic-scripts',
    label: 'Script Library',
    href: '/portal/scripts',
    icon: DocumentTextIcon,
    description: 'Koleksi script hipnoterapi',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
  {
    id: 'clinic-billing',
    label: 'Billing & Tagihan',
    href: '/portal/clinic/billing',
    icon: BanknotesIcon,
    description: 'Manajemen pembayaran',
    requiredRoles: ['clinic_admin'],
  },
  {
    id: 'clinic-settings',
    label: 'Pengaturan Klinik',
    href: '/portal/clinic/settings',
    icon: CogIcon,
    description: 'Konfigurasi klinik',
    requiredRoles: ['clinic_admin'],
  },
];

// Navigation items for Therapist (without dashboard - handled separately)
export const therapistNavigationItems: NavigationItem[] = [
  {
    id: 'therapist-clients',
    label: 'Klien Saya',
    href: '/portal/clients',
    icon: UserIcon,
    description: 'Daftar klien yang ditangani',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
  {
    id: 'therapist-sessions',
    label: 'Sesi Hari Ini',
    href: '/portal/sessions',
    icon: ClipboardDocumentListIcon,
    description: 'Jadwal sesi hipnoterapi',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
  {
    id: 'therapist-scripts',
    label: 'Script Hipnoterapi',
    href: '/portal/scripts',
    icon: DocumentTextIcon,
    description: 'Koleksi script tersedia',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
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
      '/portal/clinic/therapists',
      '/portal/clients',
      '/portal/clients/[code]',
      '/portal/sessions',
      '/portal/scripts',
      '/portal/clinic/billing',
      '/portal/clinic/settings',
      '/portal/profile',
    ],
    menuItems: [...clinicAdminNavigationItems, ...commonNavigationItems],
  },
  therapist: {
    role: 'therapist',
    defaultRoute: '/portal',
    allowedRoutes: [
      '/portal',
      '/portal/clients',
      '/portal/clients/[code]',
      '/portal/sessions', 
      '/portal/scripts',
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