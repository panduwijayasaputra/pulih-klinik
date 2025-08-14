import type React from 'react';
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

// Role display info (used for showing role badges, selectors, etc.)
export interface RoleDisplayInfo {
  label: string;
  description: string;
  color: string; // Tailwind text color class
  bgColor: string; // Tailwind background color class
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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

// Portal config for each role
export interface PortalConfig {
  role: UserRole;
  defaultRoute: string;
  allowedRoutes: string[];
  menuItems: NavigationItem[];
}