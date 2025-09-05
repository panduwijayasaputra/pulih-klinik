import { UserRoleEnum } from '@/types/enums';

export interface UserState {
  isAuthenticated: boolean;
  user: any;
  clinic: any;
  isLoading: boolean;
}

export interface RoutingDecision {
  shouldRedirect: boolean;
  redirectPath: string | null;
  allowAccess: boolean;
  reason: string;
}

/**
 * Unified routing logic that determines where a user should be based on their state
 * This eliminates conflicts between RouteGuard and OnboardingFlow
 */
export const getRoutingDecision = (
  pathname: string,
  userState: UserState
): RoutingDecision => {
  const { isAuthenticated, user, clinic, isLoading } = userState;

  // Still loading, don't make decisions yet
  if (isLoading) {
    return {
      shouldRedirect: false,
      redirectPath: null,
      allowAccess: false,
      reason: 'Still loading user data'
    };
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    const publicRoutes = ['/', '/login', '/register'];
    if (publicRoutes.includes(pathname)) {
      return {
        shouldRedirect: false,
        redirectPath: null,
        allowAccess: true,
        reason: 'Public route, not authenticated'
      };
    }
    return {
      shouldRedirect: true,
      redirectPath: '/login',
      allowAccess: false,
      reason: 'Not authenticated, redirecting to login'
    };
  }

  // User is authenticated, determine their state
  const hasClinic = !!clinic;
  const hasSubscription = !!clinic?.subscription;
  const isSystemAdmin = user.roles?.includes(UserRoleEnum.Administrator);
  const isTherapist = user.roles?.includes(UserRoleEnum.Therapist);
  const isClinicAdmin = user.roles?.includes(UserRoleEnum.ClinicAdmin);

  // Debug logging to understand the issue
  console.log('🔍 Routing Logic Debug:', {
    pathname,
    user: user ? { id: user.id, email: user.email, roles: user.roles } : null,
    clinic: clinic ? { id: clinic.id, name: clinic.name, subscription: clinic.subscription } : null,
    hasClinic,
    hasSubscription,
    isSystemAdmin,
    isTherapist,
    isClinicAdmin,
  });

  // System Admin and Therapist logic
  if (isSystemAdmin || isTherapist) {
    if (pathname.startsWith('/portal')) {
      return {
        shouldRedirect: false,
        redirectPath: null,
        allowAccess: true,
        reason: 'System admin or therapist accessing portal'
      };
    }
    if (pathname.startsWith('/onboarding')) {
      return {
        shouldRedirect: true,
        redirectPath: isSystemAdmin ? '/portal/admin' : '/portal/therapist',
        allowAccess: false,
        reason: 'System admin or therapist should not be in onboarding'
      };
    }
  }

  // Clinic Admin logic - this is where the main logic lives
  if (isClinicAdmin) {
    // Determine what step they should be on
    let targetStep: string;
    if (!hasClinic) {
      targetStep = 'clinic_info';
    } else if (!hasSubscription) {
      targetStep = 'subscription';
    } else {
      targetStep = 'complete';
    }

    // Portal access logic
    if (pathname.startsWith('/portal')) {
      if (targetStep === 'complete') {
        return {
          shouldRedirect: false,
          redirectPath: null,
          allowAccess: true,
          reason: 'Clinic admin with complete data accessing portal'
        };
      } else {
        return {
          shouldRedirect: true,
          redirectPath: `/onboarding?step=${targetStep}`,
          allowAccess: false,
          reason: `Clinic admin missing ${targetStep === 'clinic_info' ? 'clinic' : 'subscription'} data`
        };
      }
    }

    // Onboarding access logic
    if (pathname.startsWith('/onboarding')) {
      if (targetStep === 'complete') {
        return {
          shouldRedirect: true,
          redirectPath: '/portal/clinic',
          allowAccess: false,
          reason: 'Clinic admin with complete data should be in portal'
        };
      } else {
        // Check if they're on the right step
        const currentStep = pathname.includes('step=') 
          ? pathname.split('step=')[1] 
          : 'clinic_info'; // default step
        
        if (currentStep !== targetStep) {
          return {
            shouldRedirect: true,
            redirectPath: `/onboarding?step=${targetStep}`,
            allowAccess: false,
            reason: `Redirecting to correct step: ${targetStep}`
          };
        }
        
        return {
          shouldRedirect: false,
          redirectPath: null,
          allowAccess: true,
          reason: `Clinic admin on correct onboarding step: ${targetStep}`
        };
      }
    }
  }

  // Default fallback
  return {
    shouldRedirect: true,
    redirectPath: '/portal',
    allowAccess: false,
    reason: 'Default redirect to portal'
  };
};

/**
 * Helper function to get the correct onboarding step based on user state
 */
export const getOnboardingStep = (userState: UserState): string => {
  const { clinic } = userState;
  const hasClinic = !!clinic;
  const hasSubscription = !!clinic?.subscription;

  if (!hasClinic) return 'clinic_info';
  if (!hasSubscription) return 'subscription';
  return 'complete';
};
