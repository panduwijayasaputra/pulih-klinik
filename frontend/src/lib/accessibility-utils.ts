// Accessibility utilities and constants for consistent implementation
export const ACCESSIBILITY_CONSTANTS = {
  // ARIA labels
  LABELS: {
    CLOSE: 'Tutup',
    SAVE: 'Simpan',
    CANCEL: 'Batal',
    DELETE: 'Hapus',
    EDIT: 'Edit',
    VIEW: 'Lihat',
    ADD: 'Tambah',
    REMOVE: 'Hapus',
    SEARCH: 'Cari',
    FILTER: 'Filter',
    SORT: 'Urutkan',
    LOADING: 'Memuat',
    ERROR: 'Kesalahan',
    SUCCESS: 'Berhasil',
    WARNING: 'Peringatan',
    INFO: 'Informasi',
    REQUIRED: 'Wajib diisi',
    OPTIONAL: 'Opsional',
    BACK: 'Kembali',
    NEXT: 'Selanjutnya',
    PREVIOUS: 'Sebelumnya',
    FIRST: 'Pertama',
    LAST: 'Terakhir',
    MENU: 'Menu',
    NAVIGATION: 'Navigasi',
    MAIN_CONTENT: 'Konten Utama',
    SKIP_TO_CONTENT: 'Langsung ke konten',
  },

  // ARIA roles
  ROLES: {
    BUTTON: 'button',
    LINK: 'link',
    TAB: 'tab',
    TABPANEL: 'tabpanel',
    TABLIST: 'tablist',
    DIALOG: 'dialog',
    ALERT: 'alert',
    ALERTDIALOG: 'alertdialog',
    BANNER: 'banner',
    COMPLEMENTARY: 'complementary',
    CONTENTINFO: 'contentinfo',
    FORM: 'form',
    MAIN: 'main',
    NAVIGATION: 'navigation',
    REGION: 'region',
    SEARCH: 'search',
    STATUS: 'status',
    TOOLBAR: 'toolbar',
    TOOLTIP: 'tooltip',
    LIST: 'list',
    LISTITEM: 'listitem',
    GRID: 'grid',
    GRIDCELL: 'gridcell',
    ROW: 'row',
    ROWGROUP: 'rowgroup',
    COLUMNHEADER: 'columnheader',
    ROWHEADER: 'rowheader',
    TABLE: 'table',
    TABLECELL: 'cell',
    TABLEHEADER: 'columnheader',
    TABLEBODY: 'rowgroup',
    TABLEFOOTER: 'rowgroup',
  },

  // ARIA states
  STATES: {
    EXPANDED: 'expanded',
    COLLAPSED: 'collapsed',
    SELECTED: 'selected',
    CHECKED: 'checked',
    PRESSED: 'pressed',
    DISABLED: 'disabled',
    HIDDEN: 'hidden',
    INVALID: 'invalid',
    REQUIRED: 'required',
    BUSY: 'busy',
    LIVE: 'live',
    ATOMIC: 'atomic',
    RELEVANT: 'relevant',
    ORIENTATION: 'orientation',
    SORT: 'sort',
    DROPEFFECT: 'dropeffect',
    GRABBED: 'grabbed',
    ACTIVEDESCENDANT: 'activedescendant',
    CONTROLS: 'controls',
    DESCRIBEDBY: 'describedby',
    LABELLEDBY: 'labelledby',
    OWNS: 'owns',
    POSINSET: 'posinset',
    SETSIZE: 'setsize',
    VALUEMIN: 'valuemin',
    VALUEMAX: 'valuemax',
    VALUENOW: 'valuenow',
    VALUETEXT: 'valuetext',
  },

  // Live regions
  LIVE_REGIONS: {
    POLITE: 'polite',
    ASSERTIVE: 'assertive',
    OFF: 'off',
  },

  // Keyboard navigation
  KEYS: {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    TAB: 'Tab',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
  },

  // Focus management
  FOCUS: {
    FIRST: 'first',
    LAST: 'last',
    NEXT: 'next',
    PREVIOUS: 'previous',
    SPECIFIC: 'specific',
  },
} as const;

// Accessibility utility functions
export const accessibilityUtils = {
  // Generate unique ID for ARIA relationships
  generateId: (prefix: string = 'id'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Create ARIA label with context
  createAriaLabel: (action: string, context?: string): string => {
    return context ? `${action} ${context}` : action;
  },

  // Create ARIA description
  createAriaDescription: (description: string): string => {
    return description;
  },

  // Handle keyboard navigation for lists
  handleListNavigation: (
    event: React.KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    onSelect: (index: number) => void,
    onClose?: () => void
  ): void => {
    switch (event.key) {
      case ACCESSIBILITY_CONSTANTS.KEYS.ARROW_DOWN:
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % totalItems;
        onSelect(nextIndex);
        break;
      case ACCESSIBILITY_CONSTANTS.KEYS.ARROW_UP:
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
        onSelect(prevIndex);
        break;
      case ACCESSIBILITY_CONSTANTS.KEYS.HOME:
        event.preventDefault();
        onSelect(0);
        break;
      case ACCESSIBILITY_CONSTANTS.KEYS.END:
        event.preventDefault();
        onSelect(totalItems - 1);
        break;
      case ACCESSIBILITY_CONSTANTS.KEYS.ENTER:
      case ACCESSIBILITY_CONSTANTS.KEYS.SPACE:
        event.preventDefault();
        onSelect(currentIndex);
        break;
      case ACCESSIBILITY_CONSTANTS.KEYS.ESCAPE:
        event.preventDefault();
        onClose?.();
        break;
    }
  },

  // Handle keyboard navigation for tabs
  handleTabNavigation: (
    event: React.KeyboardEvent,
    currentIndex: number,
    totalTabs: number,
    onSelect: (index: number) => void
  ): void => {
    switch (event.key) {
      case ACCESSIBILITY_CONSTANTS.KEYS.ARROW_LEFT:
        event.preventDefault();
        const prevTab = currentIndex === 0 ? totalTabs - 1 : currentIndex - 1;
        onSelect(prevTab);
        break;
      case ACCESSIBILITY_CONSTANTS.KEYS.ARROW_RIGHT:
        event.preventDefault();
        const nextTab = (currentIndex + 1) % totalTabs;
        onSelect(nextTab);
        break;
      case ACCESSIBILITY_CONSTANTS.KEYS.HOME:
        event.preventDefault();
        onSelect(0);
        break;
      case ACCESSIBILITY_CONSTANTS.KEYS.END:
        event.preventDefault();
        onSelect(totalTabs - 1);
        break;
    }
  },

  // Handle keyboard navigation for modals
  handleModalNavigation: (
    event: React.KeyboardEvent,
    onClose: () => void,
    onConfirm?: () => void
  ): void => {
    switch (event.key) {
      case ACCESSIBILITY_CONSTANTS.KEYS.ESCAPE:
        event.preventDefault();
        onClose();
        break;
      case ACCESSIBILITY_CONSTANTS.KEYS.ENTER:
        if (event.target instanceof HTMLButtonElement && event.target.type === 'submit') {
          event.preventDefault();
          onConfirm?.();
        }
        break;
    }
  },

  // Trap focus within a container
  trapFocus: (
    containerRef: React.RefObject<HTMLElement>,
    event: React.KeyboardEvent
  ): void => {
    if (event.key !== ACCESSIBILITY_CONSTANTS.KEYS.TAB) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  },

  // Announce message to screen readers
  announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove the announcement after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Create skip link
  createSkipLink: (targetId: string, label: string = 'Langsung ke konten'): JSX.Element => {
    return (
      <a
        href={`#${targetId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={(e) => {
          e.preventDefault();
          const target = document.getElementById(targetId);
          if (target) {
            target.focus();
            target.scrollIntoView();
          }
        }}
      >
        {label}
      </a>
    );
  },

  // Create focus trap hook
  useFocusTrap: (isActive: boolean = true) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!isActive) return;

      const container = containerRef.current;
      if (!container) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        accessibilityUtils.trapFocus(containerRef, event as any);
      };

      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }, [isActive]);

    return containerRef;
  },

  // Create ARIA live region
  createLiveRegion: (
    message: string,
    priority: 'polite' | 'assertive' | 'off' = 'polite'
  ): JSX.Element => {
    return (
      <div
        aria-live={priority}
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {message}
      </div>
    );
  },

  // Validate ARIA attributes
  validateAriaAttributes: (attributes: Record<string, string>): boolean => {
    const validRoles = Object.values(ACCESSIBILITY_CONSTANTS.ROLES);
    const validStates = Object.values(ACCESSIBILITY_CONSTANTS.STATES);
    const validLiveRegions = Object.values(ACCESSIBILITY_CONSTANTS.LIVE_REGIONS);

    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'role' && !validRoles.includes(value as any)) {
        console.warn(`Invalid ARIA role: ${value}`);
        return false;
      }
      if (key === 'aria-live' && !validLiveRegions.includes(value as any)) {
        console.warn(`Invalid ARIA live region: ${value}`);
        return false;
      }
      if (key.startsWith('aria-') && !validStates.includes(key as any)) {
        console.warn(`Invalid ARIA state: ${key}`);
        return false;
      }
    }

    return true;
  },

  // Create accessible button
  createAccessibleButton: (
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      label: string;
      description?: string;
      icon?: React.ReactNode;
    }
  ): React.ButtonHTMLAttributes<HTMLButtonElement> => {
    const { label, description, icon, ...buttonProps } = props;

    return {
      ...buttonProps,
      'aria-label': description ? accessibilityUtils.createAriaLabel(label, description) : label,
      'aria-describedby': description ? accessibilityUtils.generateId('desc') : undefined,
      role: 'button',
      tabIndex: buttonProps.disabled ? -1 : 0,
    };
  },

  // Create accessible link
  createAccessibleLink: (
    props: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      label: string;
      description?: string;
      isExternal?: boolean;
    }
  ): React.AnchorHTMLAttributes<HTMLAnchorElement> => {
    const { label, description, isExternal, ...linkProps } = props;

    const ariaLabel = isExternal 
      ? accessibilityUtils.createAriaLabel(label, '(membuka di tab baru)')
      : description 
        ? accessibilityUtils.createAriaLabel(label, description)
        : label;

    return {
      ...linkProps,
      'aria-label': ariaLabel,
      target: isExternal ? '_blank' : linkProps.target,
      rel: isExternal ? 'noopener noreferrer' : linkProps.rel,
    };
  },

  // Create accessible form field
  createAccessibleFormField: (
    props: {
      id: string;
      label: string;
      description?: string;
      error?: string;
      required?: boolean;
      type?: string;
    }
  ): {
    inputProps: React.InputHTMLAttributes<HTMLInputElement>;
    labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
    descriptionId?: string;
    errorId?: string;
  } => {
    const { id, label, description, error, required, type } = props;

    const descriptionId = description ? accessibilityUtils.generateId('desc') : undefined;
    const errorId = error ? accessibilityUtils.generateId('error') : undefined;

    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
      id,
      'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
      'aria-invalid': error ? 'true' : 'false',
      'aria-required': required ? 'true' : 'false',
      required,
      type,
    };

    const labelProps: React.LabelHTMLAttributes<HTMLLabelElement> = {
      htmlFor: id,
    };

    return {
      inputProps,
      labelProps,
      descriptionId,
      errorId,
    };
  },
};

// Accessibility hooks
export const useAccessibility = () => {
  const [announcements, setAnnouncements] = React.useState<string[]>([]);

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    accessibilityUtils.announceToScreenReader(message, priority);
    setAnnouncements(prev => [...prev, message]);
  }, []);

  const clearAnnouncements = React.useCallback(() => {
    setAnnouncements([]);
  }, []);

  return {
    announcements,
    announce,
    clearAnnouncements,
  };
};

// Export all utilities
export default {
  ACCESSIBILITY_CONSTANTS,
  accessibilityUtils,
  useAccessibility,
};
