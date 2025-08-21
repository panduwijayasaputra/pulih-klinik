'use client';

import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserRoleEnum } from '@/types/enums';

interface TherapistLayoutProps {
  children: React.ReactNode;
}

export default function TherapistLayout({ children }: TherapistLayoutProps) {
  return (
    <RoleGuard allowedRoles={[UserRoleEnum.Therapist]}>
      {children}
    </RoleGuard>
  );
}   