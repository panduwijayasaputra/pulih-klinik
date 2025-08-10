# Quick Reference - Shared Components

## 🚀 Most Used Components

### Page Wrapper
```typescript
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';

<PortalPageWrapper
  title="Page Title"
  description="Description"
  actions={<Button>Action</Button>}
>
  {/* Content */}
</PortalPageWrapper>
```

### Data Table
```typescript
import { DataTable, TableColumn, TableAction } from '@/components/ui/data-table';

<DataTable
  title="My Data"
  data={data}
  columns={columns}
  actions={actions}
  loading={loading}
  searchKeys={['name', 'email']}
  refreshAction={{ label: 'Refresh', onClick: refresh }}
  createAction={{ label: 'Add New', icon: PlusIcon, onClick: create }}
/>
```

### Form Modal
```typescript
import { FormModal } from '@/components/ui/form-modal';

<FormModal
  open={open}
  onOpenChange={setOpen}
  title="Form Title"
  size="2xl"
>
  {/* Form content */}
</FormModal>
```

### Toast Notifications
```typescript
import { useToast } from '@/components/ui/toast';

const { addToast } = useToast();
addToast({ type: 'success', title: 'Success', message: 'Done!' });
```

## 🎨 UI Components

### Button
```typescript
<Button variant="default" size="sm">
  <PlusIcon className="w-4 h-4 mr-2" />
  Add New
</Button>
```

### Badge
```typescript
<Badge variant="success">Active</Badge>
<Badge variant="destructive">Inactive</Badge>
```

### Card
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## 📊 State Management

### Zustand Store
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      data: [],
      loading: false,
      setData: (data) => set({ data }),
      setLoading: (loading) => set({ loading }),
    }),
    { name: 'my-store' }
  )
);
```

### Custom Hook
```typescript
export const useMyData = () => {
  const { data, loading, setData } = useMyStore();
  
  const createItem = useCallback(async (item) => {
    const newItem = await api.createItem(item);
    setData([...data, newItem]);
  }, [data, setData]);

  return { data, loading, createItem };
};
```

## 📝 Form Pattern
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(formSchema),
});

<form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register('name')} />
  {errors.name && <span>{errors.name.message}</span>}
</form>
```

## 🔄 Common Patterns

### List Page
```typescript
export default function ListPage() {
  const { data, loading, refresh } = useMyData();
  const [showModal, setShowModal] = useState(false);

  return (
    <PortalPageWrapper
      title="My Items"
      actions={<Button onClick={() => setShowModal(true)}>Add New</Button>}
    >
      <DataTable
        title="Items"
        data={data}
        columns={columns}
        actions={actions}
        loading={loading}
        refreshAction={{ label: 'Refresh', onClick: refresh }}
      />
      
      <MyFormModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmitSuccess={() => {
          setShowModal(false);
          refresh();
        }}
      />
    </PortalPageWrapper>
  );
}
```

### Detail Page
```typescript
export default function DetailPage({ params }) {
  const { data: item, loading } = useMyData(params.id);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <PortalPageWrapper
      title={item?.name}
      actions={<Button onClick={() => setShowEditModal(true)}>Edit</Button>}
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
      </div>
    </PortalPageWrapper>
  );
}
```

## 📁 File Structure
```
src/
├── components/
│   ├── ui/              # Shared UI components
│   ├── layout/          # Page wrappers
│   └── [feature]/       # Feature components
├── hooks/
│   └── use[Feature].ts  # Custom hooks
├── store/
│   └── [feature].ts     # Zustand stores
├── types/
│   ├── [feature].ts     # TypeScript types
│   └── enums.ts         # Shared enums
└── lib/
    └── api/
        └── [feature].ts # API functions
```

## 🏷️ Naming Conventions
- **Components**: `UserProfile.tsx`
- **Hooks**: `useUser.ts`
- **Stores**: `userStore.ts`
- **Types**: `User.ts`
- **API**: `UserAPI.ts`
- **Enums**: `UserRoleEnum`

## 📦 Import Order
1. React/Next.js
2. Third-party libraries
3. UI components
4. Layout components
5. Feature components
6. Hooks/Stores
7. Types/API
8. Icons
