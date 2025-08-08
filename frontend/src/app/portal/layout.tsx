'use client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}