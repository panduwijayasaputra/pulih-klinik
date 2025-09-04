'use client';

import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function OnboardingPage() {
  return (
    <RouteGuard>
      <OnboardingFlow />
    </RouteGuard>
  );
}