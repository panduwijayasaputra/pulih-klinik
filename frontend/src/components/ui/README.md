# UI Components Library

This directory contains a comprehensive set of reusable UI components built with Radix UI primitives and styled with Tailwind CSS. All components follow the design system and are fully accessible.

## Available Components

### Form Components

#### Button
```tsx
import { Button } from '@/components/ui/button'

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
```

#### Link
```tsx
import { CustomLink } from '@/components/ui/link'

<CustomLink href="/dashboard">Go to Dashboard</CustomLink>
<CustomLink href="/profile" variant="outline">View Profile</CustomLink>
<CustomLink href="/settings" variant="ghost" size="sm">Settings</CustomLink>
```

#### Input
```tsx
import { Input } from '@/components/ui/input'

<Input placeholder="Enter text..." />
<Input type="email" placeholder="Email" />
```

#### Label
```tsx
import { Label } from '@/components/ui/label'

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

#### Textarea
```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea placeholder="Enter description..." />
```

#### Select
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Layout Components

#### Card
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

#### Separator
```tsx
import { Separator } from '@/components/ui/separator'

<Separator />
<Separator orientation="vertical" />
```

### Display Components

#### Badge
```tsx
import { Badge } from '@/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
```

#### Avatar
```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

<Avatar>
  <AvatarImage src="https://example.com/image.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Feedback Components

#### Progress
```tsx
import { Progress } from '@/components/ui/progress'

<Progress value={33} />
```

#### Alert
```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

### Navigation Components

#### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

<Tabs defaultValue="account" className="w-full">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account settings
  </TabsContent>
  <TabsContent value="password">
    Password settings
  </TabsContent>
</Tabs>
```

#### Dropdown Menu
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Overlay Components

#### Dialog
```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Usage Guidelines

### Importing Components
```tsx
// Import individual components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Or import from the index file
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
```

### Styling
- All components use Tailwind CSS classes
- Components follow the design system color palette
- Use the `className` prop to add custom styles
- Components are responsive by default

### Accessibility
- All components are built with accessibility in mind
- Proper ARIA labels and roles are included
- Keyboard navigation is supported
- Screen reader friendly

### Variants
Most components support multiple variants:
- `default` - Primary styling
- `secondary` - Secondary styling
- `destructive` - Error/danger styling
- `outline` - Outlined styling
- `ghost` - Minimal styling

### Sizes
Components that support sizing typically offer:
- `default` - Standard size
- `sm` - Small size
- `lg` - Large size
- `icon` - Square icon size (for buttons)

## Dependencies

This component library requires:
- `@radix-ui/react-*` - UI primitives
- `class-variance-authority` - Variant management
- `clsx` - Conditional classes
- `tailwind-merge` - Class merging
- `lucide-react` - Icons

## Example Usage

See `example-usage.tsx` for a comprehensive demonstration of all components in action. 