# Database Seeders

This directory contains database seeders for populating the Smart Therapy application with demo data.

## Available Seeders

### 1. UserSeeder
Creates users with different roles (admin, therapist) and their associated profiles and roles.
- **Demo Users:**
  - `admin@terapintar.com` / `admin123` (Administrator)
  - `admin@kliniksehat.com` / `clinic123` (Clinic Admin)
  - `therapist@kliniksehat.com` / `therapist123` (Therapist)
  - `dr.ahmad@kliniksehat.com` / `multi123` (Multi-role: Admin + Therapist)
  - Additional therapists for both clinics

### 2. TherapistSeeder
Creates therapist profiles with specializations, education, certifications, and availability.
- **Therapists:**
  - Sarah Johnson (Anxiety, Depression, CBT)
  - Ahmad Rizki (Psychiatry, Addiction, Trauma, Family Therapy)
  - Maya Sari (Child Psychology, Developmental Disorders)
  - Budi Santoso (Marriage and Family Therapy)
  - Lisa Wijaya (CBT, Anxiety Management, Mindfulness)
  - Hendra Prasetyo (Addiction Treatment, Group Therapy)

### 3. ClientSeeder
Creates client records with comprehensive information including medical history and emergency contacts.
- **Clients:**
  - Sari Dewi (Student with anxiety and academic stress)
  - Andi Kusuma (Working professional with burnout)
  - Rina Putri (Mother seeking family therapy)
  - David Chen (Substance abuse recovery)
  - Nina Wijaya (ADHD and learning difficulties)
  - Budi Santoso (Gambling addiction)
  - Maya Sari (Panic disorder and agoraphobia)

### 4. ConsultationSeeder
Creates consultation records with different types and statuses.
- **Types:** Initial, Follow-up, Emergency, Scheduled
- **Statuses:** Completed, Scheduled, Cancelled

### 5. TherapySessionSeeder
Creates therapy session records with various modalities and progress tracking.
- **Modalities:** CBT, Stress Management, Family Therapy, Addiction Recovery, ADHD Support, Exposure Therapy
- **Types:** Individual, Family, Group

## Usage

### Run All Seeders
```bash
npm run seeder:run
```

### Fresh Database with Seeders
```bash
npm run db:fresh
```

### Create New Seeder
```bash
npm run seeder:create
```

## Seeder Dependencies

Seeders must be run in the following order due to foreign key relationships:

1. **UserSeeder** - Creates users, profiles, and roles
2. **TherapistSeeder** - Depends on users and clinics
3. **ClientSeeder** - Depends on therapists and clinics
4. **ConsultationSeeder** - Depends on clients, therapists, and clinics
5. **TherapySessionSeeder** - Depends on clients, therapists, and clinics

## Demo Data Overview

### Clinics
- **Terapintar Clinic** - Specializing in cognitive behavioral therapy
- **Klinik Sehat** - Comprehensive healthcare with mental health services

### User Roles
- **Administrator** - Full system access
- **Clinic Admin** - Clinic-specific administration
- **Therapist** - Clinical practice and client management

### Therapy Modalities
- Cognitive Behavioral Therapy (CBT)
- Stress Management
- Family Therapy
- Addiction Recovery
- ADHD Support
- Exposure Therapy
- Mindfulness-Based Therapy

### Client Conditions
- Anxiety Disorders
- Depression
- Work-related Stress
- Parenting Challenges
- Substance Abuse
- ADHD
- Gambling Addiction
- Panic Disorder
- Agoraphobia

## Data Relationships

- Each client is assigned to a specific clinic
- Clients can be assigned to therapists based on specialization
- Consultations and therapy sessions link clients with therapists
- All entities maintain proper audit trails with timestamps

## Notes

- All passwords are hashed using bcrypt
- Demo data includes realistic Indonesian names and addresses
- Phone numbers follow Indonesian format (+62)
- Dates are set in 2024 for realistic demo scenarios
- Progress tracking is included for therapy sessions
- Emergency contacts and medical history are populated for clients
