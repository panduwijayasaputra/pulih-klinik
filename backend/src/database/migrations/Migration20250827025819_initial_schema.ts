import { Migration } from '@mikro-orm/migrations';

export class Migration20250827025819_initial_schema extends Migration {
  // eslint-disable-next-line @typescript-eslint/require-await
  override async up(): Promise<void> {
    // Clients table
    this.addSql(
      'create table "clients" ("id" uuid not null default gen_random_uuid(), "clinic_id" uuid not null, "full_name" varchar(255) not null, "gender" varchar(10) not null, "birth_place" varchar(255) not null, "birth_date" timestamptz(0) not null, "religion" varchar(50) not null, "occupation" varchar(255) not null, "education" varchar(50) not null, "education_major" varchar(255) null, "address" text not null, "phone" varchar(20) not null, "email" varchar(255) null, "hobbies" text null, "marital_status" varchar(20) not null, "spouse_name" varchar(255) null, "relationship_with_spouse" varchar(20) null, "first_visit" boolean not null default true, "previous_visit_details" text null, "province" varchar(100) null, "emergency_contact_name" varchar(255) null, "emergency_contact_phone" varchar(20) null, "emergency_contact_relationship" varchar(100) null, "emergency_contact_address" text null, "is_minor" boolean not null default false, "school" varchar(255) null, "grade" varchar(50) null, "guardian_full_name" varchar(255) null, "guardian_relationship" varchar(50) null, "guardian_phone" varchar(20) null, "guardian_address" text null, "guardian_occupation" varchar(255) null, "guardian_marital_status" varchar(50) null, "guardian_legal_custody" boolean null, "guardian_custody_docs_attached" boolean null, "status" varchar(20) not null default \'new\', "join_date" timestamptz(0) not null default CURRENT_DATE, "total_sessions" int not null default 0, "last_session_date" timestamptz(0) null, "progress" int not null default 0, "notes" text null, "name" varchar(255) null, "age" int null, "primary_issue" text null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "clients_pkey" primary key ("id"), constraint clients_progress_check check (progress >= 0 AND progress <= 100));',
    );

    // Therapists table
    this.addSql(
      'create table "therapists" ("id" uuid not null default gen_random_uuid(), "clinic_id" uuid not null, "user_id" uuid not null, "full_name" varchar(255) not null, "phone" varchar(20) not null, "avatar_url" varchar(500) null, "license_number" varchar(100) not null, "license_type" varchar(50) not null, "years_of_experience" int not null default 0, "status" varchar(20) not null default \'pending_setup\', "employment_type" varchar(20) not null, "join_date" timestamptz(0) not null, "max_clients" int not null default 10, "current_load" int not null default 0, "timezone" varchar(50) not null default \'Asia/Jakarta\', "session_duration" int not null default 60, "break_between_sessions" int not null default 15, "max_sessions_per_day" int not null default 8, "working_days" jsonb not null default 1,2,3,4,5, "admin_notes" text null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "therapists_pkey" primary key ("id"));',
    );
    this.addSql(
      'comment on column "therapists"."session_duration" is \'Session duration in minutes\';',
    );
    this.addSql(
      'comment on column "therapists"."break_between_sessions" is \'Break between sessions in minutes\';',
    );
    this.addSql(
      'comment on column "therapists"."working_days" is \'Working days (1=Monday to 7=Sunday)\';',
    );
    this.addSql(
      'alter table "therapists" add constraint "therapists_clinic_id_license_number_unique" unique ("clinic_id", "license_number");',
    );

    // Therapy sessions table
    this.addSql(
      'create table "therapy_sessions" ("id" uuid not null default gen_random_uuid(), "client_id" uuid not null, "therapist_id" uuid not null, "session_number" int not null, "title" varchar(255) not null, "description" text null, "session_date" timestamptz(0) not null, "session_time" time(0) not null, "duration" int not null default 60, "status" varchar(20) not null default \'planned\', "notes" text null, "techniques" jsonb null, "issues" jsonb null, "progress" text null, "ai_predictions" jsonb null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "therapy_sessions_pkey" primary key ("id"));',
    );
    this.addSql(
      'comment on column "therapy_sessions"."duration" is \'Duration in minutes\';',
    );

    // Therapist specializations table
    this.addSql(
      'create table "therapist_specializations" ("id" uuid not null default gen_random_uuid(), "therapist_id" uuid not null, "specialization" varchar(100) not null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "therapist_specializations_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "therapist_specializations" add constraint "therapist_specializations_therapist_id_specialization_unique" unique ("therapist_id", "specialization");',
    );

    // Consultations table
    this.addSql(
      'create table "consultations" ("id" uuid not null default gen_random_uuid(), "client_id" uuid not null, "therapist_id" uuid not null, "form_type" varchar(50) not null, "status" varchar(20) not null default \'draft\', "session_date" timestamptz(0) not null, "session_duration" int not null, "consultation_notes" text null, "previous_therapy_experience" boolean not null default false, "previous_therapy_details" text null, "current_medications" boolean not null default false, "current_medications_details" text null, "primary_concern" text not null, "secondary_concerns" jsonb null, "symptom_severity" int null, "symptom_duration" varchar(100) null, "treatment_goals" jsonb null, "client_expectations" text null, "initial_assessment" text null, "recommended_treatment_plan" text null, "form_data" jsonb null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "consultations_pkey" primary key ("id"), constraint consultations_symptom_severity_check check (symptom_severity >= 1 AND symptom_severity <= 5));',
    );
    this.addSql(
      'comment on column "consultations"."session_duration" is \'Session duration in minutes\';',
    );

    // Client therapist assignments table
    this.addSql(
      'create table "client_therapist_assignments" ("id" uuid not null default gen_random_uuid(), "client_id" uuid not null, "therapist_id" uuid not null, "assigned_date" timestamptz(0) not null default CURRENT_DATE, "assigned_by_id" uuid not null, "status" varchar(20) not null default \'active\', "notes" text null, "end_date" timestamptz(0) null, "transfer_reason" text null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "client_therapist_assignments_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "client_therapist_assignments_client_id_therapist_id_status_index" on "client_therapist_assignments" ("client_id", "therapist_id", "status");',
    );

    // Client status transitions table
    this.addSql(
      'create table "client_status_transitions" ("id" uuid not null default gen_random_uuid(), "client_id" uuid not null, "from_status" varchar(20) null, "to_status" varchar(20) not null, "reason" text null, "notes" text null, "changed_by_id" uuid not null, "changed_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "previous_therapist_id" varchar(50) null, "new_therapist_id" varchar(50) null, constraint "client_status_transitions_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "client_status_transitions_from_status_to_status_index" on "client_status_transitions" ("from_status", "to_status");',
    );
    this.addSql(
      'create index "client_status_transitions_client_id_index" on "client_status_transitions" ("client_id");',
    );

    // Audit logs table
    this.addSql(
      'create table "audit_logs" ("id" uuid not null default gen_random_uuid(), "user_id" uuid null, "action" varchar(100) not null, "entity_type" varchar(50) not null, "entity_id" uuid null, "old_values" jsonb null, "new_values" jsonb null, "ip_address" varchar(255) null, "user_agent" text null, "timestamp" timestamptz(0) not null default CURRENT_TIMESTAMP, constraint "audit_logs_pkey" primary key ("id"));',
    );

    // Add foreign key constraints
    this.addSql(
      'alter table "clients" add constraint "clients_clinic_id_foreign" foreign key ("clinic_id") references "clinics" ("id") on update cascade on delete cascade;',
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
      'alter table "therapist_specializations" add constraint "therapist_specializations_therapist_id_foreign" foreign key ("therapist_id") references "therapists" ("id") on update cascade on delete cascade;',
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
      'alter table "client_status_transitions" add constraint "client_status_transitions_client_id_foreign" foreign key ("client_id") references "clients" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "client_status_transitions" add constraint "client_status_transitions_changed_by_id_foreign" foreign key ("changed_by_id") references "users" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "audit_logs" add constraint "audit_logs_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;',
    );

    // Convert timestamp columns to timestamptz
    this.addSql(
      'alter table "clinics" alter column "subscription_expires" type timestamptz(0) using ("subscription_expires"::timestamptz(0));',
    );
    this.addSql(
      'alter table "clinics" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "clinics" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );

    this.addSql(
      'alter table "users" alter column "email_verification_expires" type timestamptz(0) using ("email_verification_expires"::timestamptz(0));',
    );
    this.addSql(
      'alter table "users" alter column "password_reset_expires" type timestamptz(0) using ("password_reset_expires"::timestamptz(0));',
    );
    this.addSql(
      'alter table "users" alter column "last_login" type timestamptz(0) using ("last_login"::timestamptz(0));',
    );
    this.addSql(
      'alter table "users" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "users" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );

    this.addSql(
      'alter table "user_profiles" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "user_profiles" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );

    this.addSql(
      'alter table "user_roles" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async down(): Promise<void> {
    // Drop foreign key constraints
    this.addSql(
      'alter table "therapy_sessions" drop constraint "therapy_sessions_client_id_foreign";',
    );

    this.addSql(
      'alter table "consultations" drop constraint "consultations_client_id_foreign";',
    );

    this.addSql(
      'alter table "client_therapist_assignments" drop constraint "client_therapist_assignments_client_id_foreign";',
    );

    this.addSql(
      'alter table "client_status_transitions" drop constraint "client_status_transitions_client_id_foreign";',
    );

    this.addSql(
      'alter table "therapy_sessions" drop constraint "therapy_sessions_therapist_id_foreign";',
    );

    this.addSql(
      'alter table "therapist_specializations" drop constraint "therapist_specializations_therapist_id_foreign";',
    );

    this.addSql(
      'alter table "consultations" drop constraint "consultations_therapist_id_foreign";',
    );

    this.addSql(
      'alter table "client_therapist_assignments" drop constraint "client_therapist_assignments_therapist_id_foreign";',
    );

    this.addSql('drop table if exists "clients" cascade;');

    this.addSql('drop table if exists "therapists" cascade;');

    this.addSql('drop table if exists "therapy_sessions" cascade;');

    this.addSql('drop table if exists "therapist_specializations" cascade;');

    this.addSql('drop table if exists "consultations" cascade;');

    this.addSql('drop table if exists "client_therapist_assignments" cascade;');

    this.addSql('drop table if exists "client_status_transitions" cascade;');

    this.addSql('drop table if exists "audit_logs" cascade;');

    // Convert timestamp columns to timestamptz
    this.addSql(
      'alter table "clinics" alter column "subscription_expires" type timestamptz using ("subscription_expires"::timestamptz);',
    );
    this.addSql(
      'alter table "clinics" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "clinics" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );

    this.addSql(
      'alter table "users" alter column "email_verification_expires" type timestamptz using ("email_verification_expires"::timestamptz);',
    );
    this.addSql(
      'alter table "users" alter column "password_reset_expires" type timestamptz using ("password_reset_expires"::timestamptz);',
    );
    this.addSql(
      'alter table "users" alter column "last_login" type timestamptz using ("last_login"::timestamptz);',
    );
    this.addSql(
      'alter table "users" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "users" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );

    this.addSql(
      'alter table "user_profiles" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "user_profiles" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );

    this.addSql(
      'alter table "user_roles" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
  }
}
