'use client';

import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserRoleEnum } from '@/types/enums';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RoleGuard allowedRoles={[UserRoleEnum.Administrator]}>
      {children}
    </RoleGuard>
  );
}