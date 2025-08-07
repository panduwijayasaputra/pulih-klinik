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

// Navigation items for Administrator
export const adminNavigationItems: NavigationItem[] = [
  {
    id: 'admin-dashboard',
    label: 'Dashboard Admin',
    href: '/admin',
    icon: HomeIcon,
    description: 'Ringkasan sistem dan statistik',
    requiredRoles: ['administrator'],
  },
  {
    id: 'admin-clinics',
    label: 'Kelola Klinik',
    href: '/admin/clinics',
    icon: BuildingOfficeIcon,
    description: 'Manajemen klinik terdaftar',
    requiredRoles: ['administrator'],
  },
  {
    id: 'admin-users',
    label: 'Kelola Pengguna',
    href: '/admin/users',
    icon: UserGroupIcon,
    description: 'Manajemen akun pengguna',
    requiredRoles: ['administrator'],
  },
  {
    id: 'admin-system',
    label: 'Pengaturan Sistem',
    href: '/admin/system',
    icon: CogIcon,
    description: 'Konfigurasi sistem global',
    requiredRoles: ['administrator'],
  },
  {
    id: 'admin-analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: ChartBarIcon,
    description: 'Laporan dan analisis penggunaan',
    requiredRoles: ['administrator'],
  },
];

// Navigation items for Clinic Admin
export const clinicAdminNavigationItems: NavigationItem[] = [
  {
    id: 'clinic-dashboard',
    label: 'Dashboard Klinik',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Ringkasan aktivitas klinik',
    requiredRoles: ['clinic_admin'],
  },
  {
    id: 'clinic-therapists',
    label: 'Kelola Therapist',
    href: '/clinic/therapists',
    icon: UserGroupIcon,
    description: 'Manajemen therapist klinik',
    requiredRoles: ['clinic_admin'],
  },
  {
    id: 'clinic-clients',
    label: 'Data Klien',
    href: '/clients',
    icon: UserIcon,
    description: 'Manajemen data klien',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
  {
    id: 'clinic-sessions',
    label: 'Sesi Hipnoterapi',
    href: '/sessions',
    icon: ClipboardDocumentListIcon,
    description: 'Riwayat dan jadwal sesi',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
  {
    id: 'clinic-scripts',
    label: 'Script Library',
    href: '/scripts',
    icon: DocumentTextIcon,
    description: 'Koleksi script hipnoterapi',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
  {
    id: 'clinic-billing',
    label: 'Billing & Tagihan',
    href: '/clinic/billing',
    icon: BanknotesIcon,
    description: 'Manajemen pembayaran',
    requiredRoles: ['clinic_admin'],
  },
  {
    id: 'clinic-settings',
    label: 'Pengaturan Klinik',
    href: '/clinic/settings',
    icon: CogIcon,
    description: 'Konfigurasi klinik',
    requiredRoles: ['clinic_admin'],
  },
];

// Navigation items for Therapist
export const therapistNavigationItems: NavigationItem[] = [
  {
    id: 'therapist-dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Ringkasan aktivitas harian',
    requiredRoles: ['therapist'],
  },
  {
    id: 'therapist-clients',
    label: 'Klien Saya',
    href: '/clients',
    icon: UserIcon,
    description: 'Daftar klien yang ditangani',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
  {
    id: 'therapist-sessions',
    label: 'Sesi Hari Ini',
    href: '/sessions',
    icon: ClipboardDocumentListIcon,
    description: 'Jadwal sesi hipnoterapi',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
  {
    id: 'therapist-scripts',
    label: 'Script Hipnoterapi',
    href: '/scripts',
    icon: DocumentTextIcon,
    description: 'Koleksi script tersedia',
    requiredRoles: ['clinic_admin', 'therapist'],
  },
];

// Common navigation items (available to all authenticated users)
export const commonNavigationItems: NavigationItem[] = [
  {
    id: 'profile',
    label: 'Profil Saya',
    href: '/profile',
    icon: UserIcon,
    description: 'Pengaturan akun pribadi',
    requiredRoles: ['administrator', 'clinic_admin', 'therapist'],
  },
];

// Dashboard configurations for each role
export const dashboardConfigs: Record<UserRole, DashboardConfig> = {
  administrator: {
    role: 'administrator',
    defaultRoute: '/admin',
    allowedRoutes: [
      '/admin',
      '/admin/clinics',
      '/admin/users', 
      '/admin/system',
      '/admin/analytics',
      '/profile',
    ],
    menuItems: [...adminNavigationItems, ...commonNavigationItems],
  },
  clinic_admin: {
    role: 'clinic_admin',
    defaultRoute: '/dashboard',
    allowedRoutes: [
      '/dashboard',
      '/clinic/therapists',
      '/clients',
      '/clients/[code]',
      '/sessions',
      '/scripts',
      '/clinic/billing',
      '/clinic/settings',
      '/profile',
    ],
    menuItems: [...clinicAdminNavigationItems, ...commonNavigationItems],
  },
  therapist: {
    role: 'therapist',
    defaultRoute: '/dashboard',
    allowedRoutes: [
      '/dashboard',
      '/clients',
      '/clients/[code]',
      '/sessions', 
      '/scripts',
      '/profile',
    ],
    menuItems: [...therapistNavigationItems, ...commonNavigationItems],
  },
};

// Get navigation items for user based on their roles
export const getNavigationItemsForUser = (userRoles: UserRole[]): NavigationItem[] => {
  const allItems = new Map<string, NavigationItem>();

  // Collect all navigation items from user's roles
  userRoles.forEach(role => {
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