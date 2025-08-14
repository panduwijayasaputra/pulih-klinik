'use client';

import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserRoleEnum } from '@/types/enums';

interface ClinicLayoutProps {
  children: React.ReactNode;
}

export default function ClinicLayout({ children }: ClinicLayoutProps) {
  return (
    <RoleGuard allowedRoles={[UserRoleEnum.ClinicAdmin]}>
      {children}
    </RoleGuard>
  );
}