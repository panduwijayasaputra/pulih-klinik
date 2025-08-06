/**
 * Responsive utilities for the Indonesian Hypnotherapy AI System
 * Mobile-first approach with Indonesian cultural considerations
 */

export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Check if current window width matches a breakpoint
 */
export function isBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
}

/**
 * Get current breakpoint
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'sm';
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

/**
 * Check if device is mobile (below md breakpoint)
 */
export function isMobile(): boolean {
  return !isBreakpoint('md');
}

/**
 * Check if device is tablet (md to lg)
 */
export function isTablet(): boolean {
  return isBreakpoint('md') && !isBreakpoint('lg');
}

/**
 * Check if device is desktop (lg and above)
 */
export function isDesktop(): boolean {
  return isBreakpoint('lg');
}

/**
 * Indonesian mobile device detection
 * Common screen sizes in Indonesia based on market research
 */
export const INDONESIAN_DEVICE_SIZES = {
  smallMobile: { width: 360, height: 640 }, // Common Android
  largeMobile: { width: 414, height: 896 }, // iPhone sizes
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1366, height: 768 },
} as const;

/**
 * Check if device matches Indonesian mobile patterns
 */
export function isIndonesianMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  const { innerWidth, innerHeight } = window;
  const aspectRatio = innerWidth / innerHeight;
  
  // Indonesian mobile devices typically have aspect ratios between 0.4-0.7
  return innerWidth < BREAKPOINTS.md && aspectRatio >= 0.4 && aspectRatio <= 0.7;
}

/**
 * Hook for responsive state management
 */
export function useResponsive() {
  if (typeof window === 'undefined') {
    return {
      breakpoint: 'sm' as Breakpoint,
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    };
  }

  const breakpoint = getCurrentBreakpoint();
  
  return {
    breakpoint,
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    isIndonesianMobile: isIndonesianMobile(),
  };
}

/**
 * Media query strings for CSS-in-JS
 */
export const MEDIA_QUERIES = {
  xs: `(min-width: ${BREAKPOINTS.xs}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
} as const;

/**
 * Touch device detection
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - Legacy IE property
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Indonesian cultural responsive patterns
 */
export const INDONESIAN_RESPONSIVE_PATTERNS = {
  // Common Indonesian mobile reading patterns (right-to-left friendly)
  contentWidth: {
    mobile: '100%',
    tablet: '90%',
    desktop: '80%',
  },
  // Indonesian text sizing preferences
  fontSize: {
    mobile: {
      body: '16px', // Minimum for Indonesian readability
      heading: '24px',
    },
    tablet: {
      body: '18px',
      heading: '28px',
    },
    desktop: {
      body: '16px',
      heading: '32px',
    },
  },
  // Touch target sizes for Indonesian users
  touchTargets: {
    minimum: '44px', // WCAG AA standard
    recommended: '48px', // Indonesian mobile UX preference
    comfortable: '56px', // For elderly users
  },
} as const;