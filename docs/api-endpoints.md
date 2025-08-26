# Smart Therapy API Endpoints

## Overview

This document outlines all the API endpoints required for the Smart Therapy Management System backend, based on analysis of the frontend codebase.

## Base URL
```
https://api.smarttherapy.com/v1
```

## Authentication
All endpoints (except public ones) require JWT authentication via Bearer token:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this standard format:
```typescript
interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data?: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  message?: string;
  errorCode?: string;
}
```

---

## 1. Authentication & Users

### 1.1 Login
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Description**: Authenticate user and return JWT token
- **Request Body**:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    user?: User;
    token?: string;
    refreshToken?: string;
    expiresIn?: number;
    message?: string;
  }
  ```

### 1.2 Logout
- **Method**: `POST`
- **Endpoint**: `/auth/logout`
- **Description**: Invalidate current session
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    message: string;
  }
  ```

### 1.3 Get Current User
- **Method**: `GET`
- **Endpoint**: `/auth/me`
- **Description**: Get current authenticated user
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: User;
    message?: string;
  }
  ```

### 1.4 Refresh Token
- **Method**: `POST`
- **Endpoint**: `/auth/refresh`
- **Description**: Get new access token using refresh token
- **Request Body**:
  ```typescript
  {
    refreshToken: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    token?: string;
    refreshToken?: string;
    expiresIn?: number;
    message?: string;
  }
  ```

### 1.5 Forgot Password
- **Method**: `POST`
- **Endpoint**: `/auth/forgot-password`
- **Description**: Send password reset email
- **Request Body**:
  ```typescript
  {
    email: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    message: string;
  }
  ```

### 1.6 Reset Password
- **Method**: `POST`
- **Endpoint**: `/auth/reset-password`
- **Description**: Reset password using token
- **Request Body**:
  ```typescript
  {
    token: string;
    password: string;
    confirmPassword: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    message: string;
  }
  ```

---

## 2. User Profiles

### 2.1 Get User Profile
- **Method**: `GET`
- **Endpoint**: `/users/{userId}/profile`
- **Description**: Get user profile information
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Profile;
    message?: string;
  }
  ```

### 2.2 Update User Profile
- **Method**: `PUT`
- **Endpoint**: `/users/{userId}/profile`
- **Description**: Update user profile information
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    bio?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Profile;
    message?: string;
  }
  ```

### 2.3 Upload Avatar
- **Method**: `POST`
- **Endpoint**: `/users/{userId}/avatar`
- **Description**: Upload user avatar image
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Request Body**: Form data with file
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: { avatarUrl: string };
    message?: string;
  }
  ```

### 2.4 Change Password
- **Method**: `POST`
- **Endpoint**: `/users/{userId}/change-password`
- **Description**: Change user password
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    currentPassword: string;
    newPassword: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    message?: string;
  }
  ```

---

## 3. Clinics

### 3.1 Get Clinic Profile
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}`
- **Description**: Get clinic profile information
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: ClinicProfile;
    message?: string;
  }
  ```

### 3.2 Update Clinic Profile
- **Method**: `PUT`
- **Endpoint**: `/clinics/{clinicId}`
- **Description**: Update clinic profile information
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    description?: string;
    workingHours?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: ClinicProfile;
    message?: string;
  }
  ```

### 3.3 Upload Clinic Document
- **Method**: `POST`
- **Endpoint**: `/clinics/{clinicId}/documents`
- **Description**: Upload clinic document
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Request Body**: Form data with file and metadata
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: ClinicDocument;
    message?: string;
  }
  ```

### 3.4 Get Clinic Documents
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/documents`
- **Description**: Get all clinic documents
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: ClinicDocument[];
    message?: string;
  }
  ```

### 3.5 Delete Clinic Document
- **Method**: `DELETE`
- **Endpoint**: `/clinics/{clinicId}/documents/{documentId}`
- **Description**: Delete clinic document
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    message?: string;
  }
  ```

### 3.6 Update Clinic Branding
- **Method**: `PUT`
- **Endpoint**: `/clinics/{clinicId}/branding`
- **Description**: Update clinic branding settings
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: ClinicProfile;
    message?: string;
  }
  ```

### 3.7 Update Clinic Settings
- **Method**: `PUT`
- **Endpoint**: `/clinics/{clinicId}/settings`
- **Description**: Update clinic settings
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    timezone: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: ClinicProfile;
    message?: string;
  }
  ```

### 3.8 Get Clinic Statistics
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/stats`
- **Description**: Get clinic statistics
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: ClinicStats;
    message?: string;
  }
  ```

---

## 4. Therapists

### 4.1 Get Therapists (Paginated)
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/therapists`
- **Description**: Get paginated list of therapists
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `pageSize`: number (default: 10)
  - `status`: string (optional)
  - `specializations`: string[] (optional)
  - `employmentType`: string (optional)
  - `licenseType`: string (optional)
  - `search`: string (optional)
  - `maxLoad`: number (optional)
  - `sortBy`: 'name' | 'joinDate' | 'clientCount' (optional)
  - `sortOrder`: 'asc' | 'desc' (optional)
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: {
      items: Therapist[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
    message?: string;
  }
  ```

### 4.2 Get Therapist
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}`
- **Description**: Get specific therapist details
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Therapist;
    message?: string;
  }
  ```

### 4.3 Create Therapist
- **Method**: `POST`
- **Endpoint**: `/clinics/{clinicId}/therapists`
- **Description**: Create new therapist
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    fullName: string;
    email: string;
    phone: string;
    licenseNumber: string;
    licenseType: string;
    specializations: string[];
    yearsOfExperience: number;
    employmentType: string;
    maxClients: number;
    education: TherapistEducation[];
    certifications: TherapistCertification[];
    preferences: TherapistPreferences;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Therapist;
    message?: string;
  }
  ```

### 4.4 Update Therapist
- **Method**: `PUT`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}`
- **Description**: Update therapist information
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Partial TherapistFormData
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Therapist;
    message?: string;
  }
  ```

### 4.5 Delete Therapist
- **Method**: `DELETE`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}`
- **Description**: Delete therapist
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    message?: string;
  }
  ```

### 4.6 Update Therapist Status
- **Method**: `PATCH`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/status`
- **Description**: Update therapist status
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    status: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Therapist;
    message?: string;
  }
  ```

### 4.7 Get Therapist Assignments
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/assignments`
- **Description**: Get therapist client assignments
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistAssignment[];
    message?: string;
  }
  ```

---

## 5. Clients

### 5.1 Get Clients (Paginated)
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/clients`
- **Description**: Get paginated list of clients
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `pageSize`: number (default: 10)
  - `status`: string (optional)
  - `therapist`: string (optional)
  - `search`: string (optional)
  - `province`: string (optional)
  - `dateRange.from`: string (optional)
  - `dateRange.to`: string (optional)
  - `primaryIssue`: string (optional)
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: {
      items: Client[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
    message?: string;
  }
  ```

### 5.2 Get Client
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/clients/{clientId}`
- **Description**: Get specific client details
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Client;
    message?: string;
  }
  ```

### 5.3 Create Client
- **Method**: `POST`
- **Endpoint**: `/clinics/{clinicId}/clients`
- **Description**: Create new client
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: ClientFormData
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Client;
    message?: string;
  }
  ```

### 5.4 Update Client
- **Method**: `PUT`
- **Endpoint**: `/clinics/{clinicId}/clients/{clientId}`
- **Description**: Update client information
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Partial ClientFormData
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Client;
    message?: string;
  }
  ```

### 5.5 Delete Client
- **Method**: `DELETE`
- **Endpoint**: `/clinics/{clinicId}/clients/{clientId}`
- **Description**: Delete client
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    message?: string;
  }
  ```

### 5.6 Assign Client to Therapist
- **Method**: `POST`
- **Endpoint**: `/clinics/{clinicId}/clients/{clientId}/assign`
- **Description**: Assign client to therapist
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    therapistId: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: { clientId: string; therapistId: string };
    message?: string;
  }
  ```

### 5.7 Unassign Client
- **Method**: `DELETE`
- **Endpoint**: `/clinics/{clinicId}/clients/{clientId}/assign`
- **Description**: Unassign client from therapist
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: { clientId: string };
    message?: string;
  }
  ```

### 5.8 Get Client Sessions
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/clients/{clientId}/sessions`
- **Description**: Get client therapy sessions
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `pageSize`: number (default: 10)
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: {
      items: TherapySession[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
    message?: string;
  }
  ```

---

## 6. Client Status Management

### 6.1 Get Client Status
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/clients/{clientId}/status`
- **Description**: Get current client status
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: {
      currentStatus: string;
      statusHistory: StatusTransition[];
    };
    message?: string;
  }
  ```

### 6.2 Update Client Status
- **Method**: `POST`
- **Endpoint**: `/clinics/{clinicId}/clients/{clientId}/status`
- **Description**: Update client status with transition
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    toStatus: string;
    reason?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: StatusTransition;
    message?: string;
  }
  ```

### 6.3 Get Available Status Transitions
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/clients/{clientId}/status/transitions`
- **Description**: Get available status transitions for client
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: string[];
    message?: string;
  }
  ```

---

## 7. Client-Therapist Assignments

### 7.1 Get Client-Therapist Assignments
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/assignments`
- **Description**: Get all client-therapist assignments
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `therapistId`: string (optional)
  - `clientId`: string (optional)
  - `status`: string (optional)
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistAssignment[];
    message?: string;
  }
  ```

### 7.2 Create Assignment
- **Method**: `POST`
- **Endpoint**: `/clinics/{clinicId}/assignments`
- **Description**: Create new client-therapist assignment
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    clientId: string;
    therapistId: string;
    notes?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistAssignment;
    message?: string;
  }
  ```

### 7.3 Update Assignment
- **Method**: `PUT`
- **Endpoint**: `/clinics/{clinicId}/assignments/{assignmentId}`
- **Description**: Update assignment details
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    status?: string;
    notes?: string;
    endDate?: string;
    transferReason?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistAssignment;
    message?: string;
  }
  ```

---

## 8. Therapist Clients

### 8.1 Get Therapist Clients
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/clients`
- **Description**: Get clients assigned to therapist
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `pageSize`: number (default: 10)
  - `status`: string (optional)
  - `search`: string (optional)
  - `assignedDate.from`: string (optional)
  - `assignedDate.to`: string (optional)
  - `lastSessionDate.from`: string (optional)
  - `lastSessionDate.to`: string (optional)
  - `sessionCount.min`: number (optional)
  - `sessionCount.max`: number (optional)
  - `sortBy`: string (optional)
  - `sortOrder`: 'asc' | 'desc' (optional)
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: {
      items: TherapistClient[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
    message?: string;
  }
  ```

### 8.2 Get Therapist Client
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/clients/{clientId}`
- **Description**: Get specific therapist client details
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistClient;
    message?: string;
  }
  ```

### 8.3 Get Therapist Client Stats
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/clients/stats`
- **Description**: Get therapist client statistics
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistClientStats;
    message?: string;
  }
  ```

### 8.4 Get Therapist Client Sessions
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/clients/{clientId}/sessions`
- **Description**: Get sessions for specific client
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistClientSession[];
    message?: string;
  }
  ```

### 8.5 Get Therapist Client Progress
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/clients/{clientId}/progress`
- **Description**: Get client progress information
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistClientProgress;
    message?: string;
  }
  ```

### 8.6 Update Therapist Client Notes
- **Method**: `PUT`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/clients/{clientId}/notes`
- **Description**: Update client notes
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    progressNotes?: string;
    therapistNotes?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistClient;
    message?: string;
  }
  ```

### 8.7 Schedule Next Session
- **Method**: `POST`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/clients/{clientId}/schedule`
- **Description**: Schedule next session for client
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    sessionDate: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistClient;
    message?: string;
  }
  ```

### 8.8 Update Therapist Client Status
- **Method**: `PATCH`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/clients/{clientId}/status`
- **Description**: Update client status
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    status: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapistClient;
    message?: string;
  }
  ```

---

## 9. Therapy Sessions

### 9.1 Get Therapy Sessions
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/sessions`
- **Description**: Get therapist's therapy sessions
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `pageSize`: number (default: 10)
  - `status`: string (optional)
  - `search`: string (optional)
  - `sortBy`: 'date' | 'client' | 'sessionNumber' (optional)
  - `sortOrder`: 'asc' | 'desc' (optional)
  - `dateFrom`: string (optional)
  - `dateTo`: string (optional)
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: {
      items: SessionWithClient[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
    message?: string;
  }
  ```

### 9.2 Get Therapy Session
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/sessions/{sessionId}`
- **Description**: Get specific therapy session
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapySession;
    message?: string;
  }
  ```

### 9.3 Create Therapy Session
- **Method**: `POST`
- **Endpoint**: `/clinics/{clinicId}/sessions`
- **Description**: Create new therapy session
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    clientId: string;
    therapistId: string;
    title: string;
    description?: string;
    date: string;
    time: string;
    duration?: number;
    status?: string;
    techniques?: string[];
    issues?: string[];
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapySession;
    message?: string;
  }
  ```

### 9.4 Update Therapy Session
- **Method**: `PUT`
- **Endpoint**: `/clinics/{clinicId}/sessions/{sessionId}`
- **Description**: Update therapy session
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Partial UpdateTherapySessionData
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: TherapySession;
    message?: string;
  }
  ```

### 9.5 Delete Therapy Session
- **Method**: `DELETE`
- **Endpoint**: `/clinics/{clinicId}/sessions/{sessionId}`
- **Description**: Delete therapy session
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    message?: string;
  }
  ```

### 9.6 Update Session Status
- **Method**: `PATCH`
- **Endpoint**: `/clinics/{clinicId}/sessions/{sessionId}/status`
- **Description**: Update session status
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```typescript
  {
    status: string;
    notes?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: SessionWithClient;
    message?: string;
  }
  ```

### 9.7 Get Session Statistics
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/therapists/{therapistId}/sessions/stats`
- **Description**: Get therapist session statistics
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: {
      totalSessions: number;
      completedSessions: number;
      scheduledSessions: number;
      plannedSessions: number;
      inProgressSessions: number;
      cancelledSessions: number;
      upcomingSessions: number;
    };
    message?: string;
  }
  ```

### 9.8 Generate AI Predictions
- **Method**: `POST`
- **Endpoint**: `/clinics/{clinicId}/clients/{clientId}/ai-predictions`
- **Description**: Generate AI predictions for client
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: AIPredictions;
    message?: string;
  }
  ```

---

## 10. Consultations

### 10.1 Get Consultations
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/consultations`
- **Description**: Get consultations
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `clientId`: string (optional)
  - `page`: number (default: 1)
  - `pageSize`: number (default: 10)
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: {
      items: Consultation[];
      total: number;
      page: number;
      pageSize: number;
    };
    message?: string;
  }
  ```

### 10.2 Get Consultation
- **Method**: `GET`
- **Endpoint**: `/clinics/{clinicId}/consultations/{consultationId}`
- **Description**: Get specific consultation
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Consultation;
    message?: string;
  }
  ```

### 10.3 Create Consultation
- **Method**: `POST`
- **Endpoint**: `/clinics/{clinicId}/consultations`
- **Description**: Create new consultation
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: CreateConsultationData
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Consultation;
    message?: string;
  }
  ```

### 10.4 Update Consultation
- **Method**: `PUT`
- **Endpoint**: `/clinics/{clinicId}/consultations/{consultationId}`
- **Description**: Update consultation
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: UpdateConsultationData
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: Consultation;
    message?: string;
  }
  ```

### 10.5 Delete Consultation
- **Method**: `DELETE`
- **Endpoint**: `/clinics/{clinicId}/consultations/{consultationId}`
- **Description**: Delete consultation
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```typescript
  {
    success: boolean;
    message?: string;
  }
  ```

---

## 11. Registration

### 11.1 Start Registration
- **Method**: `POST`
- **Endpoint**: `/registration/start`
- **Description**: Start clinic registration process
- **Request Body**:
  ```typescript
  {
    email: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: RegistrationStatus;
    message?: string;
  }
  ```

### 11.2 Submit Clinic Data
- **Method**: `POST`
- **Endpoint**: `/registration/{registrationId}/clinic`
- **Description**: Submit clinic information
- **Request Body**:
  ```typescript
  {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    description?: string;
    workingHours?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: RegistrationStatus;
    message?: string;
  }
  ```

### 11.3 Submit Verification Documents
- **Method**: `POST`
- **Endpoint**: `/registration/{registrationId}/documents`
- **Description**: Upload verification documents
- **Content-Type**: `multipart/form-data`
- **Request Body**: Form data with files
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: RegistrationStatus;
    message?: string;
  }
  ```

### 11.4 Process Payment
- **Method**: `POST`
- **Endpoint**: `/registration/{registrationId}/payment`
- **Description**: Process registration payment
- **Request Body**:
  ```typescript
  {
    subscriptionTier: string;
    paymentMethod: string;
    billingCycle: 'monthly' | 'yearly';
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: PaymentStatus;
    message?: string;
  }
  ```

### 11.5 Complete Registration
- **Method**: `POST`
- **Endpoint**: `/registration/{registrationId}/complete`
- **Description**: Complete registration process
- **Request Body**:
  ```typescript
  {
    subscriptionId: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: RegistrationStatus;
    message?: string;
  }
  ```

### 11.6 Get Registration Status
- **Method**: `GET`
- **Endpoint**: `/registration/{registrationId}`
- **Description**: Get registration status
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: RegistrationStatus;
    message?: string;
  }
  ```

### 11.7 Validate Payment Method
- **Method**: `POST`
- **Endpoint**: `/registration/validate-payment`
- **Description**: Validate payment method
- **Request Body**:
  ```typescript
  {
    paymentMethod: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: boolean;
    message?: string;
  }
  ```

### 11.8 Resend Verification Email
- **Method**: `POST`
- **Endpoint**: `/registration/resend-verification`
- **Description**: Resend verification email
- **Request Body**:
  ```typescript
  {
    email: string;
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean;
    message?: string;
  }
  ```

### 11.9 Cancel Registration
- **Method**: `DELETE`
- **Endpoint**: `/registration/{registrationId}`
- **Description**: Cancel registration
- **Response**:
  ```typescript
  {
    success: boolean;
    message?: string;
  }
  ```

---

## 12. Health & Monitoring

### 12.1 Health Check
- **Method**: `GET`
- **Endpoint**: `/health`
- **Description**: Check API health status
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      version?: string;
      uptime?: number;
      dependencies?: Record<string, 'healthy' | 'unhealthy'>;
    };
    message?: string;
  }
  ```

### 12.2 API Status
- **Method**: `GET`
- **Endpoint**: `/status`
- **Description**: Get API status information
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: {
      version: string;
      environment: string;
      timestamp: string;
      services: Record<string, any>;
    };
    message?: string;
  }
  ```

---

## Error Codes

### Authentication Errors
- `INVALID_CREDENTIALS`: Invalid email or password
- `TOKEN_EXPIRED`: JWT token has expired
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `EMAIL_NOT_VERIFIED`: Email not verified

### Validation Errors
- `VALIDATION_ERROR`: Request validation failed
- `REQUIRED_FIELD_MISSING`: Required field is missing
- `INVALID_FORMAT`: Invalid data format

### Resource Errors
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `RESOURCE_ALREADY_EXISTS`: Resource already exists
- `RESOURCE_CONFLICT`: Resource conflict

### Business Logic Errors
- `INSUFFICIENT_CAPACITY`: Therapist at maximum capacity
- `OPERATION_NOT_ALLOWED`: Operation not allowed in current state
- `INVALID_STATUS_TRANSITION`: Invalid status transition

### File Upload Errors
- `FILE_TOO_LARGE`: File size exceeds limit
- `INVALID_FILE_TYPE`: Invalid file type
- `UPLOAD_FAILED`: File upload failed

### Payment Errors
- `PAYMENT_FAILED`: Payment processing failed
- `CARD_VERIFICATION_FAILED`: Card verification failed

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **File upload endpoints**: 10 requests per minute
- **AI prediction endpoints**: 20 requests per minute

---

## Pagination

All paginated endpoints support:
- `page`: Page number (1-based)
- `pageSize`: Items per page (default: 10, max: 100)
- Response includes pagination metadata

---

## File Upload

File upload endpoints support:
- **Max file size**: 10MB
- **Allowed formats**: PDF, JPG, PNG, DOC, DOCX
- **Progress tracking**: Via multipart upload
- **Virus scanning**: Automatic scanning of uploaded files

---

## Webhooks

The API supports webhooks for:
- Client status changes
- Session scheduling
- Payment processing
- Document approval/rejection

Webhook endpoints:
- `POST /webhooks/client-status`
- `POST /webhooks/session-scheduled`
- `POST /webhooks/payment-processed`
- `POST /webhooks/document-reviewed`

---

*This API specification covers all endpoints required by the Smart Therapy Management System frontend.*
