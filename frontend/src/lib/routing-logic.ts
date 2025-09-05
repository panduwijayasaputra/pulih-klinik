import { UserRoleEnum } from '@/types/enums';

export interface UserState {
  isAuthenticated: boolean;
  user: any;
  clinic: any;
  isLoading: boolean;
  activeRole?: string | null; // Add active role to user state
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
  const { isAuthenticated, user, clinic, isLoading, activeRole } = userState;

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

  // Use active role if available, otherwise fall back to role detection
  const currentRole = activeRole || 
    (isSystemAdmin ? UserRoleEnum.Administrator : 
     isTherapist ? UserRoleEnum.Therapist : 
     isClinicAdmin ? UserRoleEnum.ClinicAdmin : null);

  // System Admin and Therapist logic
  if (currentRole === UserRoleEnum.Administrator || currentRole === UserRoleEnum.Therapist) {
    const roleBasedPortal = currentRole === UserRoleEnum.Administrator ? '/portal/admin' : '/portal/therapist';
    
    if (pathname.startsWith('/portal')) {
      // Check if they're on the correct role-based portal
      if (pathname === roleBasedPortal || pathname.startsWith(roleBasedPortal + '/')) {
        return {
          shouldRedirect: false,
          redirectPath: null,
          allowAccess: true,
          reason: `${currentRole === UserRoleEnum.Administrator ? 'System admin' : 'Therapist'} accessing correct portal`
        };
      } else {
        // Redirect to their role-specific portal
        return {
          shouldRedirect: true,
          redirectPath: roleBasedPortal,
          allowAccess: false,
          reason: `Redirecting ${currentRole === UserRoleEnum.Administrator ? 'system admin' : 'therapist'} to role-specific portal`
        };
      }
    }
    if (pathname.startsWith('/onboarding')) {
      return {
        shouldRedirect: true,
        redirectPath: roleBasedPortal,
        allowAccess: false,
        reason: `${currentRole === UserRoleEnum.Administrator ? 'System admin' : 'Therapist'} should not be in onboarding`
      };
    }
  }

  // Clinic Admin logic - this is where the main logic lives
  if (currentRole === UserRoleEnum.ClinicAdmin) {
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
      const clinicPortalPath = '/portal/clinic';
      
      if (targetStep === 'complete') {
        // Check if they're on the correct clinic portal
        if (pathname === clinicPortalPath || pathname.startsWith(clinicPortalPath + '/')) {
          return {
            shouldRedirect: false,
            redirectPath: null,
            allowAccess: true,
            reason: 'Clinic admin with complete data accessing correct portal'
          };
        } else {
          // Redirect to clinic portal
          return {
            shouldRedirect: true,
            redirectPath: clinicPortalPath,
            allowAccess: false,
            reason: 'Redirecting clinic admin to clinic portal'
          };
        }
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
          reason: 'Clinic admin with complete data should be in clinic portal'
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

  // Default fallback - redirect based on current role
  const roleBasedPortal = currentRole === UserRoleEnum.Administrator ? '/portal/admin' : 
                         currentRole === UserRoleEnum.Therapist ? '/portal/therapist' : 
                         currentRole === UserRoleEnum.ClinicAdmin ? '/portal/clinic' : '/portal';
  
  return {
    shouldRedirect: true,
    redirectPath: roleBasedPortal,
    allowAccess: false,
    reason: `Default redirect to ${roleBasedPortal}`
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
