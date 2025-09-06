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
  const hasSubscription = !!(clinic?.subscription && clinic.subscription.toString().trim() !== '');
  const isSystemAdmin = user.roles?.includes(UserRoleEnum.Administrator);
  const isTherapist = user.roles?.includes(UserRoleEnum.Therapist);
  const isClinicAdmin = user.roles?.includes(UserRoleEnum.ClinicAdmin);
  
  // For multi-role users, check if they have clinic data in their user object
  // This is a fallback in case the clinic object is not populated
  const hasClinicFromUser = !!(user.clinicId || user.clinicName);
  const hasSubscriptionFromUser = !!(user.subscriptionTier && user.subscriptionTier.trim() !== '');
  

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

