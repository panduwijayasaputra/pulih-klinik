# Authentication System Migration Guide

This document outlines the changes made during the authentication system refactor and provides guidance for developers working with the new system.

## 🚀 Overview

The authentication system has been completely refactored to provide a simplified, production-ready solution with enhanced error handling, real-time data validation, and improved user experience.

## 📋 Key Changes

### 1. Simplified Data Structure

**Before:**
```typescript
// Complex nested role structure
interface User {
  roles: Array<{ id: string; role: UserRole }>;
  // ... other fields
}
```

**After:**
```typescript
// Simplified string array
interface User {
  roles: string[];
  // ... other fields
}
```

### 2. Enhanced Error Handling

**New Features:**
- Network error classification and retry logic
- Exponential backoff for failed requests
- User-friendly error messages in Indonesian
- Offline/online detection with graceful degradation

### 3. Real-time Data Validation

**New Features:**
- Automatic auth state validation on page reload
- Critical data change detection (clinic deletion, subscription cancellation)
- Data synchronization with server state
- Automatic logout on critical changes

### 4. Automatic Token Refresh

**New Features:**
- JWT expiration monitoring
- Automatic token refresh 5 minutes before expiry
- Seamless token renewal without user interruption
- Proper error handling for refresh failures

## 🔧 Developer Guide

### Using the Auth Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { 
    user, 
    clinic, 
    isAuthenticated, 
    isLoading, 
    error, 
    isOnline,
    login, 
    logout, 
    clearError 
  } = useAuth();

  // Check user roles
  const isAdmin = user?.roles.includes('administrator');
  const isClinicAdmin = user?.roles.includes('clinic_admin');
  const isTherapist = user?.roles.includes('therapist');

  // Handle login
  const handleLogin = async (credentials) => {
    const success = await login(credentials);
    if (success) {
      // User will be automatically redirected based on role
    }
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!isOnline && <div>Offline mode</div>}
      {/* Your component content */}
    </div>
  );
}
```

### Route Protection

```typescript
import { RouteGuard } from '@/components/auth/RouteGuard';

function ProtectedPage() {
  return (
    <RouteGuard>
      <div>This content is only visible to authenticated users</div>
    </RouteGuard>
  );
}
```


## 🗂️ File Structure

### New Files Added
```
frontend/src/
├── lib/
│   ├── network-error-handler.ts    # Network error handling utilities
│   ├── data-sync.ts               # Data synchronization utilities
│   └── api/
│       └── auth-types.ts          # API response type definitions
├── components/auth/
│   ├── RegistrationForm.tsx       # User registration form
│   ├── EmailVerificationForm.tsx  # Email verification form
│   └── RegistrationSuccess.tsx    # Registration success page
└── schemas/
    └── authSchema.ts              # Auth validation schemas
```

### Modified Files
```
frontend/src/
├── types/auth.ts                  # Simplified auth types
├── store/auth.ts                  # Enhanced auth store
├── hooks/useAuth.ts               # Enhanced auth hook
├── components/auth/RouteGuard.tsx # Simplified route guard
└── lib/api/auth.ts                # Enhanced auth API client
```

## 🔄 Migration Steps

### For Existing Components

1. **Update Role Checks:**
   ```typescript
   // Before
   const isAdmin = user?.roles.some(role => role.role === 'administrator');
   
   // After
   const isAdmin = user?.roles.includes('administrator');
   ```

2. **Update Auth State Access:**
   ```typescript
   // Before
   const { user, token, isAuthenticated } = useAuth();
   
   // After
   const { user, accessToken, isAuthenticated, isOnline } = useAuth();
   ```

3. **Update Error Handling:**
   ```typescript
   // Before
   if (error) {
     console.error('Auth error:', error);
   }
   
   // After
   if (error) {
     // Error messages are now user-friendly and in Indonesian
     setErrorMessage(error);
   }
   ```

### For API Integration

1. **Update API Response Handling:**
   ```typescript
   // Before
   const response = await AuthAPI.login(credentials);
   if (response.success) {
     // Handle success
   }
   
   // After
   const success = await login(credentials);
   if (success) {
     // User is automatically redirected based on role
   }
   ```

2. **Update Token Management:**
   ```typescript
   // Before
   const token = AuthAPI.getToken();
   
   // After
   const { accessToken } = useAuth();
   // Token is automatically managed and refreshed
   ```

## 🧪 Testing

### Unit Tests
```typescript
import { renderHook } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

test('should handle login correctly', async () => {
  const { result } = renderHook(() => useAuth());
  
  const success = await result.current.login({
    email: 'test@example.com',
    password: 'password123'
  });
  
  expect(success).toBe(true);
  expect(result.current.isAuthenticated).toBe(true);
});
```

### Integration Tests
```typescript
import { render, screen } from '@testing-library/react';
import { RouteGuard } from '@/components/auth/RouteGuard';

test('should redirect unauthenticated users to login', () => {
  render(
    <RouteGuard>
      <div>Protected Content</div>
    </RouteGuard>
  );
  
  expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();
});
```

## 🚨 Breaking Changes

### Removed Features
- `withRouteGuard` HOC (use `RouteGuard` component instead)
- `getDefaultRouteForUser` function (handled automatically)
- Complex role object structure (now uses string arrays)
- `AuthDebug` component (removed for production)

### Changed APIs
- `useAuth` hook now returns `accessToken` instead of `token`
- `useAuth` hook now includes `isOnline` status
- Role checks now use string arrays instead of objects
- Error messages are now in Indonesian and user-friendly

## 🔒 Security Considerations

### Token Management
- Access tokens are automatically refreshed before expiration
- Refresh tokens are properly invalidated on logout
- Tokens are stored securely in localStorage with proper cleanup

### Data Validation
- Critical data changes (clinic deletion, subscription cancellation) trigger automatic logout
- Real-time validation ensures data consistency with server
- Network errors are handled gracefully without exposing sensitive information

### Error Handling
- User-friendly error messages prevent information leakage
- Network errors are retried with exponential backoff
- Offline mode provides graceful degradation

## 📚 Additional Resources

- [Auth System PRD](./prd/prd-auth-system-refactor.md)
- [Task List](./tasks/tasks-prd-auth-system-refactor.md)
- [API Documentation](./api-endpoints.md)
- [Frontend Consistency Rules](./frontend-consistency-rules.md)

## 🤝 Contributing

When working with the authentication system:

1. **Always use the `useAuth` hook** for auth state management
2. **Use `RouteGuard` component** for route protection
3. **Handle errors gracefully** with user-friendly messages
4. **Test network error scenarios** including offline mode
5. **Follow the established patterns** for consistency

For questions or issues, please refer to the project documentation or create an issue in the repository.
