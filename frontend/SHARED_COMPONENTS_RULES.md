# Shared Components Rules for Smart Therapy Frontend

## Overview
This document defines the rules and patterns for using shared components across the Smart Therapy frontend application. These rules ensure consistency, maintainability, and proper component usage.

## Core Shared Components

### 1. Page Wrappers

#### PortalPageWrapper
**Purpose**: Standard wrapper for portal pages with consistent header and layout
**Location**: `@/components/layout/PortalPageWrapper`

```typescript
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';

export default function MyPage() {
  return (
    <PortalPageWrapper
      title="Page Title"
      description="Page description"
      actions={
        <Button onClick={handleAction}>Action</Button>
      }
    >
      {/* Page content */}
    </PortalPageWrapper>
  );
}
```

**Props**:
- `title?: string` - Page title
- `description?: string` - Page description
- `actions?: React.ReactNode` - Header actions (buttons, etc.)
- `showBackButton?: boolean` - Show back button
- `backButtonLabel?: string` - Custom back button label
- `onBackClick?: () => void` - Custom back button handler

#### PageWrapper
**Purpose**: Base page wrapper with more customization options
**Location**: `@/components/layout/PageWrapper`

```typescript
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function MyPage() {
  return (
    <PageWrapper
      title="Page Title"
      subtitle="Page Subtitle"
      description="Page description"
      center={true}
      className="custom-class"
    >
      {/* Page content */}
    </PageWrapper>
  );
}
```

### 2. Data Table Component

#### DataTable
**Purpose**: Reusable table component with search, filtering, pagination, and actions
**Location**: `@/components/ui/data-table`

```typescript
import { DataTable, TableColumn, TableAction } from '@/components/ui/data-table';

interface MyData {
  id: string;
  name: string;
  status: string;
}

const columns: TableColumn<MyData>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (item) => <span>{item.name}</span>,
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    render: (item) => <Badge>{item.status}</Badge>,
  },
];

const actions: TableAction<MyData>[] = [
  {
    key: 'view',
    label: 'View',
    icon: EyeIcon,
    variant: 'outline',
    onClick: (item) => handleView(item),
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: PencilIcon,
    onClick: (item) => handleEdit(item),
  },
];

export default function MyListPage() {
  return (
    <DataTable
      title="My Data"
      description="Manage your data"
      data={data}
      columns={columns}
      actions={actions}
      loading={loading}
      searchKeys={['name']}
      searchPlaceholder="Search by name..."
      filters={[
        {
          key: 'status',
          label: 'Status',
          options: [
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
          ],
          value: statusFilter,
          onChange: setStatusFilter,
        },
      ]}
      refreshAction={{
        label: 'Refresh',
        onClick: handleRefresh,
        loading: refreshing,
      }}
      createAction={{
        label: 'Add New',
        icon: PlusIcon,
        onClick: handleCreate,
      }}
    />
  );
}
```

**Key Features**:
- **Search**: Multi-key search functionality
- **Filters**: Dropdown filters for data filtering
- **Actions**: Row-level actions with icons and variants
- **Loading States**: Built-in loading and empty states
- **Refresh**: Refresh button with loading state
- **Create Action**: Add new item button
- **Responsive**: Mobile-friendly design

### 3. Form Modal Component

#### FormModal
**Purpose**: Reusable modal wrapper for forms
**Location**: `@/components/ui/form-modal`

```typescript
import { FormModal } from '@/components/ui/form-modal';

export function MyFormModal({ open, onOpenChange, data }) {
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Item"
      description="Fill in the details below"
      size="2xl"
      showCloseButton={false}
    >
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </FormModal>
  );
}
```

**Props**:
- `open: boolean` - Modal visibility
- `onOpenChange: (open: boolean) => void` - Visibility change handler
- `title: string` - Modal title
- `description?: string` - Modal description
- `size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'` - Modal size
- `showCloseButton?: boolean` - Show close button in header

### 4. UI Components

#### Button
**Location**: `@/components/ui/button`

```typescript
import { Button, buttonVariants } from '@/components/ui/button';

// Usage
<Button variant="default" size="default" disabled={false}>
  Click me
</Button>

// With icon
<Button variant="outline" size="sm">
  <PlusIcon className="w-4 h-4 mr-2" />
  Add New
</Button>
```

#### Badge
**Location**: `@/components/ui/badge`

```typescript
import { Badge, badgeVariants } from '@/components/ui/badge';

// Usage
<Badge variant="success">Active</Badge>
<Badge variant="destructive">Inactive</Badge>
<Badge variant="outline">Pending</Badge>
```

#### Card
**Location**: `@/components/ui/card`

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

#### Dialog
**Location**: `@/components/ui/dialog`

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Dialog content */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 5. Toast Notifications

#### useToast Hook
**Location**: `@/components/ui/toast`

```typescript
import { useToast } from '@/components/ui/toast';

export function MyComponent() {
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast({
      type: 'success',
      title: 'Success',
      message: 'Operation completed successfully',
    });
  };

  const handleError = () => {
    addToast({
      type: 'error',
      title: 'Error',
      message: 'Something went wrong',
    });
  };
}
```

## State Management Patterns

### 1. Zustand Stores
**Location**: `@/src/store/`

```typescript
// Store pattern
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyStore {
  data: MyData[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setData: (data: MyData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchData: () => Promise<void>;
}

export const useMyStore = create<MyStore>()(
  persist(
    (set, get) => ({
      data: [],
      loading: false,
      error: null,
      
      setData: (data) => set({ data }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      fetchData: async () => {
        set({ loading: true, error: null });
        try {
          const data = await api.getData();
          set({ data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
    }),
    {
      name: 'my-store',
    }
  )
);
```

### 2. Custom Hooks
**Location**: `@/src/hooks/`

```typescript
// Hook pattern
import { useState, useCallback, useEffect } from 'react';
import { useMyStore } from '@/store/myStore';

export const useMyData = () => {
  const { data, loading, error, fetchData, setData } = useMyStore();
  
  const createItem = useCallback(async (item: CreateItemData) => {
    try {
      const newItem = await api.createItem(item);
      setData([...data, newItem]);
      return newItem;
    } catch (error) {
      throw error;
    }
  }, [data, setData]);

  const updateItem = useCallback(async (id: string, updates: Partial<Item>) => {
    try {
      const updatedItem = await api.updateItem(id, updates);
      setData(data.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (error) {
      throw error;
    }
  }, [data, setData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    createItem,
    updateItem,
    refresh: fetchData,
  };
};
```

## Type Definitions

### 1. Enums
**Location**: `@/src/types/enums.ts`

```typescript
export enum StatusEnum {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

export enum UserRoleEnum {
  Administrator = 'administrator',
  ClinicAdmin = 'clinic_admin',
  Therapist = 'therapist',
}
```

### 2. Interfaces
**Location**: `@/src/types/`

```typescript
// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Specific entity interface
export interface MyEntity extends BaseEntity {
  name: string;
  status: StatusEnum;
  description?: string;
}

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

## Form Patterns

### 1. React Hook Form with Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  status: z.enum(['active', 'inactive']),
});

type FormData = z.infer<typeof formSchema>;

export function MyForm({ defaultValues, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select {...register('status')}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
```

## API Patterns

### 1. API Client Functions
**Location**: `@/src/lib/api/`

```typescript
// API client pattern
export const MyAPI = {
  // Get all items
  getItems: async (page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<MyEntity>>> => {
    try {
      const response = await fetch(`/api/items?page=${page}&pageSize=${pageSize}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get single item
  getItem: async (id: string): Promise<ApiResponse<MyEntity>> => {
    try {
      const response = await fetch(`/api/items/${id}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create item
  createItem: async (item: CreateItemData): Promise<ApiResponse<MyEntity>> => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update item
  updateItem: async (id: string, updates: Partial<MyEntity>): Promise<ApiResponse<MyEntity>> => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete item
  deleteItem: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await fetch(`/api/items/${id}`, { method: 'DELETE' });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
```

## Component Organization Rules

### 1. File Structure
```
src/
├── components/
│   ├── ui/                    # Shared UI components
│   ├── layout/               # Layout components
│   ├── [feature]/            # Feature-specific components
│   │   ├── [ComponentName].tsx
│   │   ├── [ComponentName]Modal.tsx
│   │   └── index.ts          # Export all components
│   └── index.ts              # Export all shared components
├── hooks/
│   ├── use[Feature].ts        # Feature-specific hooks
│   └── index.ts              # Export all hooks
├── store/
│   ├── [feature].ts           # Feature-specific stores
│   └── index.ts              # Export all stores
├── types/
│   ├── [feature].ts           # Feature-specific types
│   ├── enums.ts              # Shared enums
│   └── index.ts              # Export all types
└── lib/
    ├── api/
    │   ├── [feature].ts       # Feature-specific API
    │   └── index.ts          # Export all API
    └── utils.ts              # Utility functions
```

### 2. Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useUser.ts`)
- **Stores**: camelCase (e.g., `userStore.ts`)
- **Types**: PascalCase (e.g., `User.ts`)
- **API**: PascalCase with "API" suffix (e.g., `UserAPI.ts`)
- **Enums**: PascalCase with "Enum" suffix (e.g., `UserRoleEnum`)

### 3. Import Order
```typescript
// 1. React and Next.js imports
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 3. Internal components (UI first, then feature-specific)
import { Button, Card, Badge } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { UserForm } from '@/components/users';

// 4. Hooks and stores
import { useUser } from '@/hooks/useUser';
import { useUserStore } from '@/store/user';

// 5. Types and utilities
import { User, UserRoleEnum } from '@/types';
import { UserAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

// 6. Icons (last)
import { UserIcon, PlusIcon } from '@heroicons/react/24/outline';
```

## Best Practices

### 1. Component Composition
- Prefer composition over inheritance
- Use props for configuration
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

### 2. State Management
- Use Zustand for global state
- Use React state for local component state
- Use React Query for server state (if implemented)
- Implement optimistic updates for better UX

### 3. Error Handling
- Always handle API errors gracefully
- Show user-friendly error messages
- Use toast notifications for feedback
- Implement retry mechanisms where appropriate

### 4. Performance
- Use React.memo for expensive components
- Use useMemo and useCallback for expensive calculations
- Implement proper loading states
- Use pagination for large datasets

### 5. Accessibility
- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios

### 6. Testing
- Write unit tests for utility functions
- Write integration tests for components
- Test error scenarios
- Mock external dependencies

## Common Patterns

### 1. List Page Pattern
```typescript
export default function MyListPage() {
  const { data, loading, error, refresh } = useMyData();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <PortalPageWrapper
      title="My Items"
      description="Manage your items"
      actions={
        <Button onClick={() => setShowCreateModal(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New
        </Button>
      }
    >
      <DataTable
        title="Items"
        data={data}
        columns={columns}
        actions={actions}
        loading={loading}
        refreshAction={{
          label: 'Refresh',
          onClick: refresh,
        }}
      />

      <MyFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        mode="create"
        onSubmitSuccess={() => {
          setShowCreateModal(false);
          refresh();
        }}
      />
    </PortalPageWrapper>
  );
}
```

### 2. Detail Page Pattern
```typescript
export default function MyDetailPage({ params }) {
  const { data: item, loading, error, updateItem } = useMyData(params.id);
  const [showEditModal, setShowEditModal] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <PortalPageWrapper
      title={item.name}
      description={`ID: ${item.id}`}
      actions={
        <Button onClick={() => setShowEditModal(true)}>
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Item details */}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Action buttons */}
            </CardContent>
          </Card>
        </div>
      </div>

      <MyFormModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        mode="edit"
        defaultValues={item}
        onSubmitSuccess={() => setShowEditModal(false)}
      />
    </PortalPageWrapper>
  );
}
```

This document should be referenced whenever creating new components or features to ensure consistency across the application.
