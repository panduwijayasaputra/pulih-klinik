// Responsive design utilities and constants
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const CONTAINER_MAX_WIDTHS = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
} as const;

// Responsive spacing utilities
export const RESPONSIVE_SPACING = {
  // Padding
  'p-xs': 'p-2 sm:p-3 md:p-4',
  'p-sm': 'p-3 sm:p-4 md:p-6',
  'p-md': 'p-4 sm:p-6 md:p-8',
  'p-lg': 'p-6 sm:p-8 md:p-12',
  'p-xl': 'p-8 sm:p-12 md:p-16',
  
  // Margin
  'm-xs': 'm-2 sm:m-3 md:m-4',
  'm-sm': 'm-3 sm:m-4 md:m-6',
  'm-md': 'm-4 sm:m-6 md:m-8',
  'm-lg': 'm-6 sm:m-8 md:m-12',
  'm-xl': 'm-8 sm:m-12 md:m-16',
  
  // Gap
  'gap-xs': 'gap-2 sm:gap-3 md:gap-4',
  'gap-sm': 'gap-3 sm:gap-4 md:gap-6',
  'gap-md': 'gap-4 sm:gap-6 md:gap-8',
  'gap-lg': 'gap-6 sm:gap-8 md:gap-12',
  'gap-xl': 'gap-8 sm:gap-12 md:gap-16',
} as const;

// Responsive grid utilities
export const RESPONSIVE_GRID = {
  // Grid columns
  'grid-1': 'grid-cols-1',
  'grid-2': 'grid-cols-1 sm:grid-cols-2',
  'grid-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  'grid-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  'grid-5': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  'grid-6': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  
  // Grid rows
  'grid-rows-1': 'grid-rows-1',
  'grid-rows-2': 'grid-rows-1 sm:grid-rows-2',
  'grid-rows-3': 'grid-rows-1 sm:grid-rows-2 lg:grid-rows-3',
  'grid-rows-4': 'grid-rows-1 sm:grid-rows-2 lg:grid-rows-4',
} as const;

// Responsive flex utilities
export const RESPONSIVE_FLEX = {
  // Flex direction
  'flex-col': 'flex-col',
  'flex-row': 'flex-col sm:flex-row',
  'flex-col-reverse': 'flex-col-reverse',
  'flex-row-reverse': 'flex-col-reverse sm:flex-row-reverse',
  
  // Flex wrap
  'flex-wrap': 'flex-wrap',
  'flex-nowrap': 'flex-nowrap',
  'flex-wrap-reverse': 'flex-wrap-reverse',
  
  // Justify content
  'justify-start': 'justify-start',
  'justify-end': 'justify-end',
  'justify-center': 'justify-center',
  'justify-between': 'justify-between',
  'justify-around': 'justify-around',
  'justify-evenly': 'justify-evenly',
  
  // Align items
  'items-start': 'items-start',
  'items-end': 'items-end',
  'items-center': 'items-center',
  'items-baseline': 'items-baseline',
  'items-stretch': 'items-stretch',
} as const;

// Responsive text utilities
export const RESPONSIVE_TEXT = {
  // Text sizes
  'text-xs': 'text-xs',
  'text-sm': 'text-xs sm:text-sm',
  'text-base': 'text-sm sm:text-base',
  'text-lg': 'text-base sm:text-lg',
  'text-xl': 'text-lg sm:text-xl',
  'text-2xl': 'text-xl sm:text-2xl',
  'text-3xl': 'text-2xl sm:text-3xl',
  'text-4xl': 'text-3xl sm:text-4xl',
  'text-5xl': 'text-4xl sm:text-5xl',
  'text-6xl': 'text-5xl sm:text-6xl',
  
  // Font weights
  'font-light': 'font-light',
  'font-normal': 'font-normal',
  'font-medium': 'font-medium',
  'font-semibold': 'font-semibold',
  'font-bold': 'font-bold',
  'font-extrabold': 'font-extrabold',
} as const;

// Responsive button utilities
export const RESPONSIVE_BUTTON = {
  // Button sizes
  'btn-xs': 'px-2 py-1 text-xs',
  'btn-sm': 'px-3 py-1.5 text-sm',
  'btn-md': 'px-4 py-2 text-sm sm:text-base',
  'btn-lg': 'px-6 py-3 text-base sm:text-lg',
  'btn-xl': 'px-8 py-4 text-lg sm:text-xl',
  
  // Touch-friendly sizes for mobile
  'btn-touch': 'min-h-[44px] min-w-[44px] px-4 py-2 text-base',
  'btn-touch-lg': 'min-h-[48px] min-w-[48px] px-6 py-3 text-lg',
} as const;

// Responsive card utilities
export const RESPONSIVE_CARD = {
  // Card padding
  'card-xs': 'p-3 sm:p-4',
  'card-sm': 'p-4 sm:p-6',
  'card-md': 'p-6 sm:p-8',
  'card-lg': 'p-8 sm:p-12',
  'card-xl': 'p-12 sm:p-16',
  
  // Card spacing
  'card-gap-xs': 'space-y-2 sm:space-y-3',
  'card-gap-sm': 'space-y-3 sm:space-y-4',
  'card-gap-md': 'space-y-4 sm:space-y-6',
  'card-gap-lg': 'space-y-6 sm:space-y-8',
} as const;

// Responsive modal utilities
export const RESPONSIVE_MODAL = {
  // Modal sizes
  'modal-xs': 'w-[95vw] max-w-sm',
  'modal-sm': 'w-[95vw] max-w-md',
  'modal-md': 'w-[95vw] max-w-lg',
  'modal-lg': 'w-[95vw] max-w-xl',
  'modal-xl': 'w-[95vw] max-w-2xl',
  'modal-full': 'w-[95vw] max-w-4xl',
  
  // Modal padding
  'modal-p-xs': 'p-4 sm:p-6',
  'modal-p-sm': 'p-6 sm:p-8',
  'modal-p-md': 'p-8 sm:p-12',
} as const;

// Responsive form utilities
export const RESPONSIVE_FORM = {
  // Form layouts
  'form-1': 'grid-cols-1',
  'form-2': 'grid-cols-1 sm:grid-cols-2',
  'form-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  
  // Form spacing
  'form-gap-xs': 'gap-2 sm:gap-3',
  'form-gap-sm': 'gap-3 sm:gap-4',
  'form-gap-md': 'gap-4 sm:gap-6',
  'form-gap-lg': 'gap-6 sm:gap-8',
  
  // Form padding
  'form-p-xs': 'p-3 sm:p-4',
  'form-p-sm': 'p-4 sm:p-6',
  'form-p-md': 'p-6 sm:p-8',
} as const;

// Responsive table utilities
export const RESPONSIVE_TABLE = {
  // Table layouts
  'table-scroll': 'overflow-x-auto',
  'table-stack': 'block sm:table',
  'table-responsive': 'min-w-full divide-y divide-gray-200',
  
  // Table cell padding
  'table-p-xs': 'px-2 py-1 sm:px-3 sm:py-2',
  'table-p-sm': 'px-3 py-2 sm:px-4 sm:py-3',
  'table-p-md': 'px-4 py-3 sm:px-6 sm:py-4',
} as const;

// Responsive navigation utilities
export const RESPONSIVE_NAV = {
  // Navigation layouts
  'nav-horizontal': 'flex-row',
  'nav-vertical': 'flex-col',
  'nav-responsive': 'flex-col sm:flex-row',
  
  // Navigation spacing
  'nav-gap-xs': 'gap-1 sm:gap-2',
  'nav-gap-sm': 'gap-2 sm:gap-3',
  'nav-gap-md': 'gap-3 sm:gap-4',
  'nav-gap-lg': 'gap-4 sm:gap-6',
} as const;

// Responsive sidebar utilities
export const RESPONSIVE_SIDEBAR = {
  // Sidebar layouts
  'sidebar-mobile': 'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0',
  'sidebar-desktop': 'hidden sm:flex sm:flex-col sm:w-64 sm:fixed sm:inset-y-0 sm:left-0 sm:bg-white sm:shadow-lg',
  
  // Sidebar content
  'sidebar-content': 'flex-1 flex flex-col min-h-0',
  'sidebar-header': 'flex-shrink-0 flex items-center justify-between h-16 px-4 sm:px-6',
  'sidebar-body': 'flex-1 flex flex-col overflow-y-auto',
} as const;

// Responsive utility functions
export const responsiveUtils = {
  // Get responsive class based on screen size
  getResponsiveClass: (baseClass: string, responsiveClasses: Record<string, string>): string => {
    return `${baseClass} ${Object.values(responsiveClasses).join(' ')}`;
  },

  // Get grid columns based on item count and screen size
  getGridColumns: (itemCount: number, maxColumns: number = 4): string => {
    if (itemCount <= 1) return 'grid-cols-1';
    if (itemCount <= 2) return 'grid-cols-1 sm:grid-cols-2';
    if (itemCount <= 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    if (itemCount <= 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    if (itemCount <= 6) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  },

  // Get responsive spacing based on screen size
  getResponsiveSpacing: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): string => {
    const spacingMap = {
      xs: 'p-2 sm:p-3 md:p-4',
      sm: 'p-3 sm:p-4 md:p-6',
      md: 'p-4 sm:p-6 md:p-8',
      lg: 'p-6 sm:p-8 md:p-12',
      xl: 'p-8 sm:p-12 md:p-16',
    };
    return spacingMap[size];
  },

  // Get responsive text size
  getResponsiveText: (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'): string => {
    const textMap = {
      xs: 'text-xs',
      sm: 'text-xs sm:text-sm',
      base: 'text-sm sm:text-base',
      lg: 'text-base sm:text-lg',
      xl: 'text-lg sm:text-xl',
      '2xl': 'text-xl sm:text-2xl',
      '3xl': 'text-2xl sm:text-3xl',
      '4xl': 'text-3xl sm:text-4xl',
      '5xl': 'text-4xl sm:text-5xl',
      '6xl': 'text-5xl sm:text-6xl',
    };
    return textMap[size];
  },

  // Get touch-friendly button size
  getTouchButton: (size: 'sm' | 'md' | 'lg' = 'md'): string => {
    const buttonMap = {
      sm: 'min-h-[40px] min-w-[40px] px-3 py-2 text-sm',
      md: 'min-h-[44px] min-w-[44px] px-4 py-2 text-base',
      lg: 'min-h-[48px] min-w-[48px] px-6 py-3 text-lg',
    };
    return buttonMap[size];
  },

  // Get responsive container class
  getContainer: (size: keyof typeof CONTAINER_MAX_WIDTHS = 'xl'): string => {
    return `w-full mx-auto px-4 sm:px-6 lg:px-8 ${CONTAINER_MAX_WIDTHS[size]}`;
  },

  // Get responsive modal class
  getModal: (size: keyof typeof RESPONSIVE_MODAL = 'modal-md'): string => {
    return RESPONSIVE_MODAL[size];
  },

  // Get responsive form layout
  getFormLayout: (columns: 1 | 2 | 3 = 1): string => {
    const layoutMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    };
    return layoutMap[columns];
  },
};

// Export all utilities
export default {
  BREAKPOINTS,
  CONTAINER_MAX_WIDTHS,
  RESPONSIVE_SPACING,
  RESPONSIVE_GRID,
  RESPONSIVE_FLEX,
  RESPONSIVE_TEXT,
  RESPONSIVE_BUTTON,
  RESPONSIVE_CARD,
  RESPONSIVE_MODAL,
  RESPONSIVE_FORM,
  RESPONSIVE_TABLE,
  RESPONSIVE_NAV,
  RESPONSIVE_SIDEBAR,
  responsiveUtils,
};
