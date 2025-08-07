import { UserRole } from './auth';

// Navigation item interface
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
  requiredRoles: UserRole[];
  children?: NavigationItem[];
  badge?: string | number;
  isActive?: boolean;
  isDisabled?: boolean;
}

// Route protection configuration
export interface RouteConfig {
  path: string;
  requiredRoles: UserRole[];
  allowPublic?: boolean;
  redirectTo?: string;
  exactMatch?: boolean;
}

// Navigation state
export interface NavigationState {
  activeRole: UserRole | null;
  availableRoles: UserRole[];
  menuCollapsed: boolean;
  breadcrumbs: BreadcrumbItem[];
}

// Breadcrumb item
export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  isActive?: boolean;
}

// Role switching data
export interface RoleSwitchOption {
  role: UserRole;
  label: string;
  description: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
}

// Dashboard config for each role
export interface DashboardConfig {
  role: UserRole;
  defaultRoute: string;
  allowedRoutes: string[];
  menuItems: NavigationItem[];
}