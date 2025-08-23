# Frontend Consistency Rules

This document defines the standards and patterns for maintaining consistency across the Smart Therapy frontend application. All new features must follow these rules to ensure a cohesive user experience and maintainable codebase.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Layout & Styling](#layout--styling)
3. [Data Tables](#data-tables)
4. [API Mock & Mock Data](#api-mock--mock-data)
5. [Loading States](#loading-states)
6. [Forms](#forms)
7. [Dialogs & Modals](#dialogs--modals)
8. [State Management](#state-management)
9. [Error Handling](#error-handling)
10. [TypeScript Standards](#typescript-standards)
11. [Component Patterns](#component-patterns)

## Project Structure

### File Organization
```
frontend/src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/               # Layout components
│   ├── [feature]/            # Feature-specific components
│   └── common/               # Shared components
├── hooks/                    # Custom React hooks
├── lib/
│   ├── api/                  # API clients
│   ├── mocks/                # Mock data
│   └── utils/                # Utility functions
├── schemas/                  # Zod validation schemas
├── store/                    # Zustand stores
├── types/                    # TypeScript type definitions
└── app/                      # Next.js app router pages
```

### Naming Conventions
- **Components**: PascalCase (e.g., `ClientFormModal.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useClient.ts`)
- **Types**: PascalCase (e.g., `Client.ts`, `ClientFormData.ts`)
- **Schemas**: camelCase with "Schema" suffix (e.g., `clientSchema.ts`)
- **Stores**: camelCase (e.g., `client.ts`, `clinic.ts`)
- **API files**: camelCase (e.g., `client.ts`, `therapist.ts`)

## Layout & Styling

### Design System
- **Framework**: TailwindCSS with shadcn/ui components
- **Color Palette**: Use semantic colors from Tailwind config
- **Spacing**: Use Tailwind spacing scale (4, 8, 12, 16, 20, 24, 32, etc.)
- **Typography**: Use Tailwind text utilities with consistent sizing

### Layout Patterns

#### Page Layout
```typescript
// Standard page structure
<div className="min-h-screen bg-gray-50">
  <div className="container mx-auto px-4 py-8">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Page content */}
    </div>
  </div>
</div>
```

#### Section Layout
```typescript
// Standard section structure
<div className="border-b border-gray-200 pb-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Section Title</h3>
  <p className="text-sm text-gray-600 mb-4">Section description</p>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Section content */}
  </div>
</div>
```

#### Form Layout
```typescript
// Standard form field structure
<div>
  <Label htmlFor="fieldName">Field Label *</Label>
  <Input 
    id="fieldName" 
    placeholder="Placeholder text" 
    {...register('fieldName')} 
  />
  {errors.fieldName && (
    <p className="mt-1 text-sm text-red-600">{errors.fieldName.message}</p>
  )}
</div>
```

### Responsive Design
- **Mobile-first**: Start with mobile layout, enhance for larger screens
- **Breakpoints**: Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- **Grid**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for responsive grids

## Data Tables

### Table Structure
Use the `DataTable` component from `@/components/ui/data-table.tsx` for all data tables.

#### Table Implementation
```typescript
import { DataTable } from '@/components/ui/data-table';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <span className="text-gray-600">{row.getValue('email')}</span>
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => handleEdit(row.original)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original)}>
          Delete
        </Button>
      </div>
    )
  }
];

const MyTable = ({ data }) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search items..."
      searchKey="name"
    />
  );
};
```

### Table Features
- **Search**: Always include search functionality with clear placeholder
- **Pagination**: Use consistent pagination controls
- **Actions**: Place action buttons in the rightmost column
- **Loading**: Show skeleton loading state while data loads
- **Empty State**: Show meaningful message when no data

### Table Actions Consistency
- **Detail Actions**: Always fetch fresh data, show loading in modal
- **Edit Actions**: Always fetch fresh data, show loading in modal/form
- **Delete Actions**: Use confirmation dialog, loading in dialog
- **Custom Actions**: Use `useDataTableActions` hook for consistent loading states

#### Action Pattern Example
```typescript
import { useDataTableActions } from '@/hooks/useDataTableActions';

const MyTable = () => {
  const { createAction, createDetailAction, createEditAction } = useDataTableActions();

  const actions = [
    createDetailAction(
      (freshData) => {
        setSelectedItem(freshData);
        setShowDetailModal(true);
      },
      {
        fetchData: async (item) => {
          // This function will be called to fetch fresh data
          return await fetchItemDetails(item.id);
        }
      }
    ),
    createEditAction(
      (item) => {
        // Form modals now handle their own data fetching
        setSelectedItem(item);
        setShowEditModal(true);
      }
    ),
    createAction('custom', async (item) => {
      // Custom action with loading state
      await performCustomAction(item);
    }, { showLoading: true })
  ];

  return <DataTable actions={actions} />;
};
```

#### Fixing Inconsistency Example (ClientList)
```typescript
// ❌ Inconsistent - Detail uses existing data, Edit fetches data
const actions: TableAction<Client>[] = [
  {
    key: 'view',
    label: 'Detail',
    onClick: (client) => {
      setSelectedClient(client); // Uses existing data
      setShowDetailsModal(true);
    },
  },
  {
    key: 'edit',
    label: 'Edit',
    onClick: (client) => handleEditClientModal(client), // Fetches data again
  },
];

// ✅ Consistent - Details fetch fresh data, Edit passes ID to form modal
const { createAction, createDetailAction, createEditAction } = useDataTableActions();

const actions: TableAction<Client>[] = [
  createDetailAction(
    (freshData) => {
      setSelectedClient(freshData);
      setShowDetailsModal(true);
    },
    {
      fetchData: async (client) => {
        const response = await ClientAPI.getClient(client.id);
        return response.success ? response.data : client;
      }
    }
  ),
  createEditAction(
    (client) => {
      // Form modal handles its own data fetching
      handleEditClientModal(client);
    }
  ),
];
```

#### Modal Data Fetching Pattern
```typescript
// ✅ Both form modals and details modals handle their own data fetching
export interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  clientId?: string; // For edit mode - form modal fetches data using this ID
  defaultValues?: Partial<ClientFormData>;
  onSubmitSuccess?: (data: ClientFormData) => void;
  onCancel?: () => void;
}

export interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string; // Details modal fetches data using this ID
  isTherapist: boolean;
  onEdit: (client: Client) => void;
  onAssign: (clientId: string) => void;
  onConsultation: (clientId: string) => void;
}

// ✅ Form modal implementation
export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  open,
  onOpenChange,
  mode = 'create',
  clientId,
  defaultValues,
  onSubmitSuccess,
  onCancel,
}) => {
  const [isLoadingClient, setIsLoadingClient] = useState(mode === 'edit');

  // Form modal handles its own data fetching
  React.useEffect(() => {
    if (open && mode === 'edit' && clientId) {
      const loadClientData = async () => {
        setIsLoadingClient(true);
        try {
          const response = await ClientAPI.getClient(clientId);
          if (response.success && response.data) {
            reset(response.data); // Reset form with fresh data
          }
        } catch (error) {
          console.error('Failed to load client data:', error);
        } finally {
          setIsLoadingClient(false);
        }
      };
      loadClientData();
    }
  }, [open, mode, clientId]);

  // ... rest of component
};

// ✅ Details modal implementation
export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  clientId,
  isTherapist,
  onEdit,
  onAssign,
  onConsultation,
}) => {
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<Client | null>(null);

  // Details modal handles its own data fetching
  useEffect(() => {
    if (isOpen && clientId) {
      setLoading(true);
      
      const fetchClientData = async () => {
        try {
          const response = await ClientAPI.getClient(clientId);
          if (response.success && response.data) {
            setClientData(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch client details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchClientData();
    } else {
      setClientData(null);
      setLoading(false);
    }
  }, [isOpen, clientId]);

  // ... rest of component
};
```

#### Complete Implementation Example (ClientList)
```typescript
// ✅ Updated ClientList with form modal data fetching
import { useDataTableActions } from '@/hooks/useDataTableActions';

export const ClientList: React.FC<ClientListProps> = ({ onAssign, onConsultation }) => {
  const { createAction, createDetailAction, createEditAction } = useDataTableActions();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showClientFormModal, setShowClientFormModal] = useState(false);

  // Define table actions with consistent pattern
  const actions: TableAction<Client>[] = React.useMemo(() => {
    const baseActions: TableAction<Client>[] = [
      createDetailAction(
        (freshData) => {
          setSelectedClient(freshData);
          setShowDetailsModal(true);
        },
        {
          fetchData: async (client) => {
            const response = await ClientAPI.getClient(client.id);
            return response.success ? response.data : client;
          }
        }
      ),
      createEditAction(
        (freshData) => {
          setClientFormDefaultValues(freshData);
          setClientFormMode('edit');
          setShowClientFormModal(true);
        },
        {
          fetchData: async (client) => {
            const response = await ClientAPI.getClient(client.id);
            return response.success ? response.data : client;
          }
        }
      ),
    ];

    // Add role-specific actions...
    return baseActions;
  }, []);

  return (
    <DataTable
      data={clients}
      columns={columns}
      actions={actions}
      loading={loading}
      // ... other props
    />
  );
};
```

## API Mock & Mock Data

### Mock Data Structure
Create mock data in `frontend/src/lib/mocks/[feature].ts`

#### Mock Data Pattern
```typescript
// frontend/src/lib/mocks/client.ts
export const mockClients: Client[] = [
  {
    id: 'client-001',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+6281234567890',
    // ... other fields
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

// Always include these fields for consistency:
// - id: unique identifier
// - createdAt: ISO timestamp
// - updatedAt: ISO timestamp
```

### API Mock Structure
Create API mocks in `frontend/src/lib/api/[feature].ts`

#### API Mock Pattern
```typescript
// frontend/src/lib/api/client.ts
export const ClientAPI = {
  getClients: async (page = 1, pageSize = 10, filters?: any): Promise<PaginatedResponse<Client>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter and paginate mock data
    let filteredData = [...mockClients];
    
    if (filters?.search) {
      filteredData = filteredData.filter(client => 
        client.fullName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        items: paginatedData,
        total: filteredData.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredData.length / pageSize)
      },
      message: 'Clients retrieved successfully'
    };
  },

  createClient: async (data: ClientFormData): Promise<ApiResponse<Client>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newClient: Client = {
      id: `client-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: newClient,
      message: 'Client created successfully'
    };
  }
};
```

### API Response Types
```typescript
// Standard API response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  message: string;
}
```

## Loading States

### Loading Patterns

#### Page Loading
```typescript
// Use skeleton loading for page content
const MyPage = () => {
  const { data, loading } = useMyData();
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }
  
  return <div>{/* Page content */}</div>;
};
```

#### Button Loading
```typescript
// Standard button loading pattern
<Button
  type="submit"
  disabled={loading || isSubmitting}
>
  {loading || isSubmitting ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

#### Modal Loading
```typescript
// Modal loading state
if (isLoadingData) {
  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading data...</span>
      </div>
    </FormModal>
  );
}
```

### Loading States to Implement
- **Page loading**: Skeleton screens
- **Button loading**: Spinner + disabled state
- **Modal loading**: Centered spinner with message
- **Table loading**: Skeleton rows
- **Form loading**: Disabled inputs + loading button

## Forms

### Form Structure
Use React Hook Form with Zod validation for all forms.

#### Form Implementation Pattern
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const MyForm = ({ defaultValues, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(mySchema),
    mode: 'onChange',
    defaultValues: {
      // Default values
    }
  });

  const onSubmit = (data: FormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Form fields */}
    </form>
  );
};
```

### Form Validation
```typescript
// Zod schema pattern
import { z } from 'zod';

export const mySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^(\+62|0)[0-9]{9,13}$/, 'Invalid phone format'),
  // ... other fields
});

export type FormData = z.infer<typeof mySchema>;
```

### Form Field Patterns

#### Text Input
```typescript
<div>
  <Label htmlFor="fieldName">Field Label *</Label>
  <Input 
    id="fieldName" 
    placeholder="Placeholder text" 
    {...register('fieldName')} 
  />
  {errors.fieldName && (
    <p className="mt-1 text-sm text-red-600">{errors.fieldName.message}</p>
  )}
</div>
```

#### Select Field
```typescript
<div>
  <Label>Field Label *</Label>
  <Select
    value={watch('fieldName') || ''}
    onValueChange={val => setValue('fieldName', val, { shouldDirty: true, shouldValidate: true })}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select option" />
    </SelectTrigger>
    <SelectContent>
      {options.map(option => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {errors.fieldName && (
    <p className="mt-1 text-sm text-red-600">{(errors.fieldName as any).message}</p>
  )}
</div>
```

#### Checkbox
```typescript
<div className="flex items-center space-x-2">
  <input
    type="checkbox"
    id="fieldName"
    {...register('fieldName')}
    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  />
  <Label htmlFor="fieldName" className="text-sm font-medium text-gray-700">
    Checkbox label
  </Label>
</div>
```

### Submit Button Pattern
```typescript
<Button
  type="submit"
  disabled={
    loading ||
    isSubmitting ||
    !isValid ||
    !isDirty
  }
>
  {loading || isSubmitting ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      {mode === 'edit' ? 'Updating...' : 'Creating...'}
    </>
  ) : !isValid || !isDirty ? (
    mode === 'edit' ? 'Lengkapi Form untuk Update' : 'Lengkapi Form untuk Melanjutkan'
  ) : (
    mode === 'edit' ? 'Update' : 'Create'
  )}
</Button>
```

## Dialogs & Modals

### Modal Structure
Use the `FormModal` component for all forms and `ConfirmationDialog` for confirmations.

#### Form Modal Pattern
```typescript
import { FormModal } from '@/components/ui/form-modal';

const MyFormModal = ({ open, onOpenChange, mode = 'create', defaultValues }) => {
  const title = mode === 'edit' ? 'Edit Item' : 'Create New Item';
  const description = mode === 'edit' 
    ? 'Update existing item information'
    : 'Create a new item';

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="2xl"
    >
      {/* Form content */}
    </FormModal>
  );
};
```

#### Confirmation Dialog Pattern
```typescript
import ConfirmationDialog, { useConfirmationDialog } from '@/components/ui/confirmation-dialog';

const MyComponent = () => {
  const { openDialog, isOpen, config, closeDialog } = useConfirmationDialog();

  const handleDelete = (item) => {
    openDialog({
      title: 'Delete Item',
      description: `Are you sure you want to delete ${item.name}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => {
        // Handle deletion
        closeDialog();
      }
    });
  };

  return (
    <>
      {/* Component content */}
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={closeDialog}
        {...config}
      />
    </>
  );
};
```

### Modal Loading State
```typescript
if (isLoadingData) {
  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading data...</span>
      </div>
    </FormModal>
  );
}
```

## State Management

### Zustand Store Pattern
Create stores in `frontend/src/store/[feature].ts`

#### Store Structure
```typescript
import { create } from 'zustand';

interface MyStoreState {
  // State
  items: Item[];
  selectedItem: Item | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setItems: (items: Item[]) => void;
  setSelectedItem: (item: Item | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetStore: () => void;
}

const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

export const useMyStore = create<MyStoreState>()((set, get) => ({
  ...initialState,

  setItems: (items) => set({ items }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  resetStore: () => set(initialState),
}));
```

### Custom Hook Pattern
Create hooks in `frontend/src/hooks/use[Feature].ts`

#### Hook Structure
```typescript
import { useCallback, useEffect, useState } from 'react';
import { MyAPI } from '@/lib/api/my';

export const useMyData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await MyAPI.getData();
      if (response.success) {
        setData(response.data.items);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
```

## Error Handling

### Error Display Patterns

#### Toast Notifications
```typescript
import { useToast } from '@/components/ui/toast';

const MyComponent = () => {
  const { addToast } = useToast();

  const handleError = (error) => {
    addToast({
      type: 'error',
      title: 'Error Title',
      message: error.message || 'An error occurred',
      duration: 5000,
    });
  };

  const handleSuccess = () => {
    addToast({
      type: 'success',
      title: 'Success Title',
      message: 'Operation completed successfully',
      duration: 3000,
    });
  };
};
```

#### Form Error Display
```typescript
// Display field-specific errors
{errors.fieldName && (
  <p className="mt-1 text-sm text-red-600 flex items-center">
    <XCircleIcon className="w-3 h-3 mr-1" />
    {errors.fieldName.message}
  </p>
)}

// Display form-level errors
{errors.root && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <p className="text-sm text-red-600">{errors.root.message}</p>
  </div>
)}
```

### Error Boundaries
```typescript
// Create error boundaries for major sections
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600">Something went wrong</h2>
          <p className="text-gray-600 mt-2">Please refresh the page and try again</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## TypeScript Standards

### Type Definitions
Create types in `frontend/src/types/[feature].ts`

#### Type Structure
```typescript
// Base entity type
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Feature-specific types
export interface MyEntity extends BaseEntity {
  name: string;
  email: string;
  // ... other fields
}

// Form data type (without id, createdAt, updatedAt)
export interface MyFormData {
  name: string;
  email: string;
  // ... other fields
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  message: string;
}
```

### Enum Definitions
```typescript
// Create enums for consistent values
export enum MyStatusEnum {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}

export const MyStatusLabels: Record<MyStatusEnum, string> = {
  [MyStatusEnum.Active]: 'Active',
  [MyStatusEnum.Inactive]: 'Inactive',
  [MyStatusEnum.Pending]: 'Pending'
};
```

## Component Patterns

### Component Structure
```typescript
// Standard component structure
interface MyComponentProps {
  // Props interface
}

export const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, []);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Render
  return (
    <div className="space-y-4">
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### Component Composition
```typescript
// Use composition over inheritance
const ParentComponent = () => {
  return (
    <div>
      <Header />
      <Content>
        <ChildComponent />
      </Content>
      <Footer />
    </div>
  );
};
```

### Conditional Rendering
```typescript
// Use consistent conditional rendering patterns
{isLoading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage error={error} />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <DataList data={data} />
)}
```

## Accessibility Standards

### ARIA Labels
```typescript
// Always include proper ARIA labels
<button
  aria-label="Delete item"
  onClick={handleDelete}
>
  <TrashIcon className="w-4 h-4" />
</button>
```

### Keyboard Navigation
```typescript
// Ensure all interactive elements are keyboard accessible
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  Clickable content
</div>
```

### Focus Management
```typescript
// Manage focus in modals
useEffect(() => {
  if (open) {
    // Focus first input when modal opens
    const firstInput = document.querySelector('input, select, textarea');
    if (firstInput) {
      (firstInput as HTMLElement).focus();
    }
  }
}, [open]);
```

## Performance Guidelines

### Optimization Patterns
```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.map(item => processItem(item));
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback((id) => {
  onItemClick(id);
}, [onItemClick]);
```

### Code Splitting
```typescript
// Use dynamic imports for route-based code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

## Testing Standards

### Component Testing
```typescript
// Test component rendering and interactions
import { render, screen, fireEvent } from '@testing-library/react';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### Hook Testing
```typescript
// Test custom hooks
import { renderHook, act } from '@testing-library/react';

describe('useMyHook', () => {
  it('should return expected values', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
```

## Git Practices

### Commit Messages
Follow conventional commits format:
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Scope: component or feature affected
Description: imperative mood, lowercase, no period
```

Examples:
- `feat(client): add client form modal`
- `fix(table): resolve pagination issue`
- `docs(rules): update consistency guidelines`

### Branch Naming
- **Feature branches**: `feature/description-of-feature`
- **Bug fixes**: `fix/description-of-fix`
- **Hotfixes**: `hotfix/description-of-hotfix`

## Checklist for New Features

Before implementing a new feature, ensure:

- [ ] **File Structure**: Follows project organization
- [ ] **Naming**: Uses consistent naming conventions
- [ ] **Types**: Has proper TypeScript definitions
- [ ] **Validation**: Uses Zod schemas for forms
- [ ] **API**: Has mock API implementation
- [ ] **Loading**: Implements proper loading states
- [ ] **Error Handling**: Has error boundaries and toast notifications
- [ ] **Accessibility**: Includes ARIA labels and keyboard navigation
- [ ] **Responsive**: Works on all screen sizes
- [ ] **Testing**: Has unit tests for components and hooks
- [ ] **Documentation**: Includes JSDoc comments for complex functions

## Conclusion

Following these consistency rules ensures:
- **Maintainable codebase** with predictable patterns
- **Consistent user experience** across all features
- **Efficient development** with reusable components
- **Quality assurance** through standardized testing
- **Accessibility compliance** for all users

All team members must follow these rules when implementing new features or modifying existing ones. Regular code reviews should ensure compliance with these standards.
