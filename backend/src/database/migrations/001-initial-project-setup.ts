import { Migration } from '@mikro-orm/migrations';

/**
 * Initial Project Setup Migration
 *
 * This migration creates the complete database schema for the Pulih Klinik project.
 * It includes all core tables, relationships, constraints, and indexes needed for:
 * - User management and authentication
 * - Clinic management and subscriptions
 * - Therapist and client management
 * - Therapy sessions and consultations
 * - Assignment tracking
 *
 * Tables created:
 * - subscription_tiers: Subscription plans and pricing
 * - clinics: Clinic information and settings
 * - users: User authentication and basic info
 * - user_profiles: Extended user profile data
 * - user_roles: Role-based access control
 * - therapists: Therapist professional information
 * - clients: Client demographic and contact information
 * - therapy_sessions: Session scheduling and management
 * - consultations: Consultation forms and assessments
 * - client_therapist_assignments: Assignment tracking
 */
export class InitialProjectSetup extends Migration {
  async up(): Promise<void> {
    this.addSql("set names 'utf8';");
    this.addSql("set session_replication_role = 'replica';");

    // Create subscription_tiers table
    this.addSql(
      'create table "subscription_tiers" ("id" uuid not null default gen_random_uuid(), "name" varchar(50) not null, "code" varchar(50) not null, "description" text null, "monthly_price" int not null, "yearly_price" int not null, "therapist_limit" int not null, "new_clients_per_day_limit" int not null, "is_recommended" boolean not null default false, "is_active" boolean not null default true, "sort_order" int not null default 0, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "subscription_tiers_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "subscription_tiers" add constraint "subscription_tiers_name_unique" unique ("name");',
    );
    this.addSql(
      'alter table "subscription_tiers" add constraint "subscription_tiers_code_unique" unique ("code");',
    );

    // Create clinics table
    this.addSql(
      'create table "clinics" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "address" text not null, "phone" varchar(20) not null, "email" varchar(255) not null, "website" varchar(255) null, "logo_url" varchar(500) null, "description" text null, "working_hours" text null, "primary_color" varchar(7) not null default \'#3B82F6\', "secondary_color" varchar(7) not null default \'#1F2937\', "font_family" varchar(100) not null default \'Inter\', "timezone" varchar(50) not null default \'Asia/Jakarta\', "language" varchar(10) not null default \'id\', "email_notifications" boolean not null default true, "sms_notifications" boolean not null default false, "push_notifications" boolean not null default false, "status" varchar(20) not null default \'pending\', "subscription_tier_id" uuid null, "subscription_expires" timestamptz(0) null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "clinics_pkey" primary key ("id"));',
    );

    // Create clients table
    this.addSql(
      'create table "clients" ("id" uuid not null default gen_random_uuid(), "clinic_id" uuid not null, "full_name" varchar(255) not null, "gender" varchar(10) not null, "birth_place" varchar(255) not null, "birth_date" timestamptz(0) not null, "religion" varchar(50) not null, "occupation" varchar(255) not null, "education" varchar(50) not null, "education_major" varchar(255) null, "address" text not null, "phone" varchar(20) not null, "email" varchar(255) null, "hobbies" text null, "marital_status" varchar(20) not null, "spouse_name" varchar(255) null, "relationship_with_spouse" varchar(20) null, "first_visit" boolean not null default true, "previous_visit_details" text null, "emergency_contact_name" varchar(255) null, "emergency_contact_phone" varchar(20) null, "emergency_contact_relationship" varchar(100) null, "emergency_contact_address" text null, "is_minor" boolean not null default false, "school" varchar(255) null, "grade" varchar(50) null, "guardian_full_name" varchar(255) null, "guardian_relationship" varchar(50) null, "guardian_phone" varchar(20) null, "guardian_address" text null, "guardian_occupation" varchar(255) null, "guardian_marital_status" varchar(50) null, "guardian_legal_custody" boolean null, "guardian_custody_docs_attached" boolean null, "status" varchar(20) not null default \'new\', "join_date" timestamptz(0) not null default CURRENT_DATE, "total_sessions" int not null default 0, "last_session_date" timestamptz(0) null, "progress" int not null default 0, "notes" text null, "name" varchar(255) null, "age" int null, "primary_issue" text null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "clients_pkey" primary key ("id"), constraint clients_progress_check check (progress >= 0 AND progress <= 100));',
    );

    // Create users table
    this.addSql(
      'create table "users" ("id" uuid not null default gen_random_uuid(), "email" varchar(255) not null, "password_hash" varchar(255) not null, "email_verified" boolean not null default false, "email_verification_token" varchar(255) null, "email_verification_code" varchar(6) null, "email_verification_expires" timestamptz(0) null, "email_verified_at" timestamptz(0) null, "password_reset_token" varchar(255) null, "password_reset_expires" timestamptz(0) null, "email_resend_attempts" int not null default 0, "email_resend_cooldown_until" timestamptz(0) null, "avatar_url" varchar(500) null, "last_login" timestamptz(0) null, "status" varchar(20) not null default \'active\', "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "clinic_id" uuid null, constraint "users_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "users" add constraint "users_email_unique" unique ("email");',
    );

    // Create therapists table
    this.addSql(
      'create table "therapists" ("id" uuid not null default gen_random_uuid(), "clinic_id" uuid not null, "user_id" uuid not null, "license_number" varchar(100) not null, "license_type" varchar(50) not null, "join_date" timestamptz(0) not null, "current_load" int not null default 0, "timezone" varchar(50) not null default \'Asia/Jakarta\', "education" text null, "certifications" text null, "admin_notes" text null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "therapists_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "therapists" add constraint "therapists_clinic_id_license_number_unique" unique ("clinic_id", "license_number");',
    );

    // Create therapy_sessions table
    this.addSql(
      'create table "therapy_sessions" ("id" uuid not null default gen_random_uuid(), "client_id" uuid not null, "therapist_id" uuid not null, "session_number" int not null, "title" varchar(255) not null, "description" text null, "session_date" timestamptz(0) not null, "session_time" time(0) not null, "duration" int not null default 60, "status" varchar(20) not null default \'planned\', "notes" text null, "techniques" jsonb null, "issues" jsonb null, "progress" text null, "ai_predictions" jsonb null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "therapy_sessions_pkey" primary key ("id"));',
    );
    this.addSql(
      'comment on column "therapy_sessions"."duration" is \'Duration in minutes\';',
    );

    // Create consultations table
    this.addSql(
      'create table "consultations" ("id" uuid not null default gen_random_uuid(), "client_id" uuid not null, "therapist_id" uuid not null, "form_type" varchar(50) not null, "status" varchar(20) not null default \'draft\', "session_date" timestamptz(0) not null, "session_duration" int not null, "consultation_notes" text null, "previous_therapy_experience" boolean not null default false, "previous_therapy_details" text null, "current_medications" boolean not null default false, "current_medications_details" text null, "primary_concern" text not null, "secondary_concerns" jsonb null, "symptom_severity" int null, "symptom_duration" varchar(100) null, "treatment_goals" jsonb null, "client_expectations" text null, "initial_assessment" text null, "recommended_treatment_plan" text null, "form_data" jsonb null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "consultations_pkey" primary key ("id"), constraint consultations_symptom_severity_check check (symptom_severity >= 1 AND symptom_severity <= 5));',
    );
    this.addSql(
      'comment on column "consultations"."session_duration" is \'Session duration in minutes\';',
    );

    // Create client_therapist_assignments table
    this.addSql(
      'create table "client_therapist_assignments" ("id" uuid not null default gen_random_uuid(), "client_id" uuid not null, "therapist_id" uuid not null, "assigned_date" timestamptz(0) not null default CURRENT_DATE, "assigned_by_id" uuid not null, "status" varchar(20) not null default \'active\', "notes" text null, "end_date" timestamptz(0) null, "transfer_reason" text null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "client_therapist_assignments_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "client_therapist_assignments_client_id_therapist_id_status_index" on "client_therapist_assignments" ("client_id", "therapist_id", "status");',
    );

    // Create user_profiles table
    this.addSql(
      'create table "user_profiles" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "name" varchar(255) not null, "phone" varchar(20) null, "address" text null, "bio" text null, "avatar_url" varchar(500) null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "userId" uuid not null, constraint "user_profiles_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "user_profiles" add constraint "user_profiles_user_id_unique" unique ("user_id");',
    );
    this.addSql(
      'alter table "user_profiles" add constraint "user_profiles_userId_unique" unique ("userId");',
    );

    // Create user_roles table
    this.addSql(
      'create table "user_roles" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "role" varchar(50) not null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "userId" uuid not null, constraint "user_roles_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "user_roles_user_id_index" on "user_roles" ("user_id");',
    );
    this.addSql(
      'alter table "user_roles" add constraint "user_roles_user_id_role_unique" unique ("user_id", "role");',
    );

    // Add foreign key constraints
    this.addSql(
      'alter table "clinics" add constraint "clinics_subscription_tier_id_foreign" foreign key ("subscription_tier_id") references "subscription_tiers" ("id") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "clients" add constraint "clients_clinic_id_foreign" foreign key ("clinic_id") references "clinics" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "users" add constraint "users_clinic_id_foreign" foreign key ("clinic_id") references "clinics" ("id") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "therapists" add constraint "therapists_clinic_id_foreign" foreign key ("clinic_id") references "clinics" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "therapists" add constraint "therapists_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "therapy_sessions" add constraint "therapy_sessions_client_id_foreign" foreign key ("client_id") references "clients" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "therapy_sessions" add constraint "therapy_sessions_therapist_id_foreign" foreign key ("therapist_id") references "therapists" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "consultations" add constraint "consultations_client_id_foreign" foreign key ("client_id") references "clients" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "consultations" add constraint "consultations_therapist_id_foreign" foreign key ("therapist_id") references "therapists" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "client_therapist_assignments" add constraint "client_therapist_assignments_client_id_foreign" foreign key ("client_id") references "clients" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "client_therapist_assignments" add constraint "client_therapist_assignments_therapist_id_foreign" foreign key ("therapist_id") references "therapists" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "client_therapist_assignments" add constraint "client_therapist_assignments_assigned_by_id_foreign" foreign key ("assigned_by_id") references "users" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "user_profiles" add constraint "user_profiles_userId_foreign" foreign key ("userId") references "users" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "user_roles" add constraint "user_roles_userId_foreign" foreign key ("userId") references "users" ("id") on update cascade;',
    );

    this.addSql("set session_replication_role = 'origin';");
  }

  async down(): Promise<void> {
    this.addSql("set names 'utf8';");
    this.addSql("set session_replication_role = 'replica';");

    // Drop tables in reverse order to handle foreign key constraints
    this.addSql('drop table if exists "user_roles" cascade;');
    this.addSql('drop table if exists "user_profiles" cascade;');
    this.addSql('drop table if exists "client_therapist_assignments" cascade;');
    this.addSql('drop table if exists "consultations" cascade;');
    this.addSql('drop table if exists "therapy_sessions" cascade;');
    this.addSql('drop table if exists "therapists" cascade;');
    this.addSql('drop table if exists "users" cascade;');
    this.addSql('drop table if exists "clients" cascade;');
    this.addSql('drop table if exists "clinics" cascade;');
    this.addSql('drop table if exists "subscription_tiers" cascade;');

    this.addSql("set session_replication_role = 'origin';");
  }
}
