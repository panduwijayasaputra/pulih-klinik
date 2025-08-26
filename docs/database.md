# Smart Therapy Database Schema

## Overview

This document contains the comprehensive database schema design for the Smart Therapy Management System, based on analysis of the frontend codebase and business requirements.

## System Architecture

### **System Overview**
This is a multi-tenant therapy management platform with:
- **Multi-role system**: Administrator, Clinic Admin, Therapist
- **Clinic-based architecture**: Each clinic manages its own therapists and clients
- **Subscription tiers**: Alpha, Beta, Gamma for users; Alpha, Beta, Theta, Delta for clinics
- **Comprehensive client management**: From registration to therapy completion
- **AI-powered therapy sessions**: With predictions and progress tracking

### **Technology Stack**
- **Database**: PostgreSQL (for complex relationships, JSON support, and ACID compliance)
- **ORM**: Prisma (type-safe, excellent TypeScript support)
- **Framework**: NestJS (enterprise-grade, modular architecture)
- **Authentication**: JWT with refresh tokens
- **File Storage**: AWS S3 or similar for documents and avatars

## Core Entities

### 1. **Users & Authentication**
- Multi-role user system (Administrator, Clinic Admin, Therapist)
- Email-based authentication with subscription tiers
- Profile management with avatar support

### 2. **Clinics**
- Multi-tenant clinic system
- Document management (licenses, certificates, insurance, tax)
- Branding and settings customization
- Subscription management

### 3. **Therapists**
- Professional credentials (license types, certifications, education)
- Specialization management
- Schedule and availability tracking
- Client assignment and load management

### 4. **Clients**
- Comprehensive demographic data
- Guardian information for minors
- Status tracking (New → Assigned → Consultation → Therapy → Done)
- Emergency contact information

### 5. **Consultations**
- Multiple form types (General, Drug Addiction, Minor)
- Structured assessment data
- Progress tracking

### 6. **Therapy Sessions**
- Session scheduling and management
- AI predictions for issues and techniques
- Progress tracking and notes

### 7. **Client-Therapist Relationships**
- Assignment management
- Progress tracking
- Session history

## Database Schema

```sql
-- =============================================
-- CORE AUTHENTICATION & USERS
-- =============================================

-- Users table (central authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles junction table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('administrator', 'clinic_admin', 'therapist')),
    clinic_id UUID, -- NULL for administrator, required for clinic_admin and therapist
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role, clinic_id)
);

-- User profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    bio TEXT,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CLINICS & SUBSCRIPTIONS
-- =============================================

-- Clinics
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    logo_url VARCHAR(500),
    description TEXT,
    working_hours TEXT,
    
    -- Branding
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    secondary_color VARCHAR(7) DEFAULT '#1F2937',
    font_family VARCHAR(100) DEFAULT 'Inter',
    
    -- Settings
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    language VARCHAR(10) DEFAULT 'id',
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT FALSE,
    
    -- Status & Subscription
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'pending', 'inactive')),
    subscription_tier VARCHAR(20) DEFAULT 'alpha' CHECK (subscription_tier IN ('alpha', 'beta', 'theta', 'delta')),
    subscription_expires TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinic documents
CREATE TABLE clinic_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('license', 'certificate', 'insurance', 'tax', 'other')),
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id)
);

-- =============================================
-- THERAPISTS
-- =============================================

-- Therapists
CREATE TABLE therapists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic info
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    avatar_url VARCHAR(500),
    
    -- Professional info
    license_number VARCHAR(100) NOT NULL,
    license_type VARCHAR(50) NOT NULL CHECK (license_type IN ('psychologist', 'psychiatrist', 'counselor', 'hypnotherapist')),
    years_of_experience INTEGER DEFAULT 0,
    
    -- Status & employment
    status VARCHAR(20) DEFAULT 'pending_setup' CHECK (status IN ('active', 'inactive', 'on_leave', 'suspended', 'pending_setup')),
    employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'freelance')),
    join_date DATE NOT NULL,
    
    -- Capacity
    max_clients INTEGER DEFAULT 10,
    current_load INTEGER DEFAULT 0,
    
    -- Schedule preferences
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    session_duration INTEGER DEFAULT 60, -- minutes
    break_between_sessions INTEGER DEFAULT 15, -- minutes
    max_sessions_per_day INTEGER DEFAULT 8,
    working_days INTEGER[] DEFAULT '{1,2,3,4,5}', -- Monday to Friday
    
    -- Admin notes
    admin_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(clinic_id, license_number)
);

-- Therapist specializations
CREATE TABLE therapist_specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(therapist_id, specialization)
);

-- Therapist education
CREATE TABLE therapist_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    field VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapist certifications
CREATE TABLE therapist_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    certificate_number VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapist schedules
CREATE TABLE therapist_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(therapist_id, day_of_week)
);

-- =============================================
-- CLIENTS
-- =============================================

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    
    -- Basic info
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
    birth_place VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    religion VARCHAR(50) NOT NULL CHECK (religion IN ('Islam', 'Christianity', 'Catholicism', 'Hinduism', 'Buddhism', 'Konghucu', 'Other')),
    occupation VARCHAR(255) NOT NULL,
    education VARCHAR(50) NOT NULL CHECK (education IN ('Elementary', 'Middle', 'High School', 'Associate', 'Bachelor', 'Master', 'Doctorate')),
    education_major VARCHAR(255),
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    hobbies TEXT,
    
    -- Marital status
    marital_status VARCHAR(20) NOT NULL CHECK (marital_status IN ('Single', 'Married', 'Widowed')),
    spouse_name VARCHAR(255),
    relationship_with_spouse VARCHAR(20) CHECK (relationship_with_spouse IN ('Good', 'Average', 'Bad')),
    
    -- Visit info
    first_visit BOOLEAN DEFAULT TRUE,
    previous_visit_details TEXT,
    province VARCHAR(100),
    
    -- Emergency contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    emergency_contact_address TEXT,
    
    -- Minor-specific fields
    is_minor BOOLEAN DEFAULT FALSE,
    school VARCHAR(255),
    grade VARCHAR(50),
    
    -- Guardian information
    guardian_full_name VARCHAR(255),
    guardian_relationship VARCHAR(50) CHECK (guardian_relationship IN ('Father', 'Mother', 'Legal guardian', 'Other')),
    guardian_phone VARCHAR(20),
    guardian_address TEXT,
    guardian_occupation VARCHAR(255),
    guardian_marital_status VARCHAR(50) CHECK (guardian_marital_status IN ('Married', 'Divorced', 'Widowed', 'Other')),
    guardian_legal_custody BOOLEAN,
    guardian_custody_docs_attached BOOLEAN,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'consultation', 'therapy', 'done')),
    join_date DATE DEFAULT CURRENT_DATE,
    total_sessions INTEGER DEFAULT 0,
    last_session_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    notes TEXT,
    
    -- Legacy fields for backward compatibility
    name VARCHAR(255), -- Legacy field
    age INTEGER, -- Legacy field
    primary_issue TEXT, -- Legacy field
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CLIENT-THERAPIST ASSIGNMENTS
-- =============================================

-- Client-therapist assignments
CREATE TABLE client_therapist_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    assigned_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'transferred', 'cancelled')),
    notes TEXT,
    end_date DATE,
    transfer_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(client_id, therapist_id, status) WHERE status = 'active'
);

-- Client status transitions (audit trail)
CREATE TABLE client_status_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL CHECK (to_status IN ('new', 'assigned', 'consultation', 'therapy', 'done')),
    user_id UUID NOT NULL REFERENCES users(id),
    reason TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CONSULTATIONS
-- =============================================

-- Consultations
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    
    -- Basic info
    form_type VARCHAR(50) NOT NULL CHECK (form_type IN ('general', 'drug_addiction', 'minor')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
    session_date DATE NOT NULL,
    session_duration INTEGER NOT NULL, -- minutes
    consultation_notes TEXT,
    
    -- Client background
    previous_therapy_experience BOOLEAN DEFAULT FALSE,
    previous_therapy_details TEXT,
    current_medications BOOLEAN DEFAULT FALSE,
    current_medications_details TEXT,
    
    -- Presenting concerns
    primary_concern TEXT NOT NULL,
    secondary_concerns TEXT[], -- Array of concerns
    symptom_severity INTEGER CHECK (symptom_severity BETWEEN 1 AND 5),
    symptom_duration VARCHAR(100),
    
    -- Goals and expectations
    treatment_goals TEXT[], -- Array of goals
    client_expectations TEXT,
    
    -- Assessment results
    initial_assessment TEXT,
    recommended_treatment_plan TEXT,
    
    -- Form-specific data (JSON fields for flexibility)
    form_data JSONB, -- Stores form-specific fields
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- THERAPY SESSIONS
-- =============================================

-- Therapy sessions
CREATE TABLE therapy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    
    -- Session info
    session_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration INTEGER DEFAULT 60, -- minutes
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'scheduled', 'in-progress', 'completed', 'cancelled')),
    
    -- Session content
    notes TEXT,
    techniques TEXT[], -- Array of techniques used
    issues TEXT[], -- Array of issues addressed
    progress TEXT,
    
    -- AI predictions
    ai_predictions JSONB, -- Stores AI predictions for issues and techniques
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SUBSCRIPTIONS & PAYMENTS
-- =============================================

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('alpha', 'beta', 'gamma')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    
    -- Payment info
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- AUDIT & LOGGING
-- =============================================

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_email_verified ON users(email_verified) WHERE email_verified = TRUE;

-- User roles
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_clinic_id ON user_roles(clinic_id);

-- Clinics
CREATE INDEX idx_clinics_status ON clinics(status);
CREATE INDEX idx_clinics_subscription_tier ON clinics(subscription_tier);

-- Therapists
CREATE INDEX idx_therapists_clinic_id ON therapists(clinic_id);
CREATE INDEX idx_therapists_status ON therapists(status);
CREATE INDEX idx_therapists_license_number ON therapists(license_number);

-- Clients
CREATE INDEX idx_clients_clinic_id ON clients(clinic_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_assigned_therapist ON clients(id) WHERE status IN ('assigned', 'consultation', 'therapy');
CREATE INDEX idx_clients_join_date ON clients(join_date);

-- Client-therapist assignments
CREATE INDEX idx_client_therapist_assignments_client_id ON client_therapist_assignments(client_id);
CREATE INDEX idx_client_therapist_assignments_therapist_id ON client_therapist_assignments(therapist_id);
CREATE INDEX idx_client_therapist_assignments_status ON client_therapist_assignments(status);

-- Consultations
CREATE INDEX idx_consultations_client_id ON consultations(client_id);
CREATE INDEX idx_consultations_therapist_id ON consultations(therapist_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_session_date ON consultations(session_date);

-- Therapy sessions
CREATE INDEX idx_therapy_sessions_client_id ON therapy_sessions(client_id);
CREATE INDEX idx_therapy_sessions_therapist_id ON therapy_sessions(therapist_id);
CREATE INDEX idx_therapy_sessions_status ON therapy_sessions(status);
CREATE INDEX idx_therapy_sessions_session_date ON therapy_sessions(session_date);

-- Audit logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type_entity_id ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_therapists_updated_at BEFORE UPDATE ON therapists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_therapist_assignments_updated_at BEFORE UPDATE ON client_therapist_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_therapy_sessions_updated_at BEFORE UPDATE ON therapy_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Key Design Decisions

### 1. **Multi-tenant Architecture**
- All data is scoped to clinics using `clinic_id` foreign keys
- Ensures data isolation between different clinics
- Supports future multi-tenant features

### 2. **Flexible Role System**
- Junction table for user roles allows multiple roles per user
- Supports role-based access control (RBAC)
- Clinic-scoped roles for clinic_admin and therapist

### 3. **Audit Trail**
- Comprehensive logging of status changes and data modifications
- Tracks who made changes and when
- Supports compliance and debugging requirements

### 4. **JSONB Fields**
- Used for flexible form data storage (consultations, AI predictions)
- Allows for schema evolution without migrations
- Maintains query performance with proper indexing

### 5. **Status Management**
- Proper status transitions with validation
- Client status flow: New → Assigned → Consultation → Therapy → Done
- Audit trail for all status changes

### 6. **Performance Optimization**
- Strategic indexing for common query patterns
- Partial indexes for filtered queries
- Optimized for clinic-scoped data access

### 7. **Data Integrity**
- Foreign key constraints for referential integrity
- Check constraints for data validation
- Unique constraints where appropriate

## Entity Relationships

### **Core Relationships**
```
Users (1) ←→ (N) UserRoles
Users (1) ←→ (1) UserProfiles
Clinics (1) ←→ (N) Therapists
Clinics (1) ←→ (N) Clients
Clinics (1) ←→ (N) ClinicDocuments
Therapists (1) ←→ (N) TherapistSpecializations
Therapists (1) ←→ (N) TherapistEducation
Therapists (1) ←→ (N) TherapistCertifications
Therapists (1) ←→ (N) TherapistSchedules
Clients (N) ←→ (N) Therapists (via ClientTherapistAssignments)
Clients (1) ←→ (N) Consultations
Clients (1) ←→ (N) TherapySessions
```

### **Status Flow**
```
Client Status Flow:
New → Assigned → Consultation → Therapy → Done
  ↑                                    ↓
  ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

## Data Validation Rules

### **Client Status Transitions**
- `new` → `consultation` (when therapist assigned)
- `consultation` → `therapy` (when consultation completed)
- `consultation` → `new` (if consultation cancelled)
- `therapy` → `done` (when therapy completed)
- `therapy` → `consultation` (if therapy paused)
- `done` → `consultation` (for new therapy cycle)

### **Phone Number Validation**
- Indonesian phone number format: `+62` or `0` prefix
- Minimum 10 digits, maximum 15 digits
- Supports international format

### **Email Validation**
- Standard email format validation
- Optional for clients, required for users

## Security Considerations

### **Data Protection**
- Password hashing using bcrypt
- JWT tokens for authentication
- Role-based access control
- Audit logging for sensitive operations

### **Multi-tenancy Security**
- Clinic-scoped data access
- User roles scoped to specific clinics
- No cross-clinic data leakage

## Performance Considerations

### **Indexing Strategy**
- Primary keys on all tables
- Foreign key indexes for joins
- Status-based partial indexes
- Date-based indexes for time-series queries
- Composite indexes for common query patterns

### **Query Optimization**
- Clinic-scoped queries for multi-tenancy
- Pagination support for large datasets
- Efficient status filtering
- Optimized date range queries

## Migration Strategy

### **Version Control**
- All schema changes tracked in migration files
- Backward compatibility maintained where possible
- Data migration scripts for schema changes

### **Rollback Plan**
- Database backups before major changes
- Reversible migration scripts
- Feature flags for gradual rollouts

## Next Steps

### **Backend Development**
1. Set up NestJS project structure
2. Configure Prisma ORM with the schema
3. Implement authentication module with JWT
4. Create CRUD modules for each entity
5. Implement role-based access control
6. Add validation using class-validator
7. Set up file upload for documents and avatars
8. Implement audit logging
9. Add comprehensive error handling
10. Set up testing framework

### **Database Setup**
1. Create PostgreSQL database
2. Run schema creation scripts
3. Set up database migrations
4. Configure connection pooling
5. Set up backup strategy
6. Configure monitoring and alerting

### **Environment Configuration**
1. Database connection strings
2. JWT secret keys
3. File storage credentials
4. Email service configuration
5. Logging configuration
6. Environment-specific settings

---

*This schema is designed to support the Smart Therapy Management System's current requirements while maintaining flexibility for future enhancements.*
