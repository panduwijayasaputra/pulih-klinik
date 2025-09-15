import { Migration } from '@mikro-orm/migrations';

/**
 * Fix Redundancy Issues Migration
 *
 * This migration fixes the following redundancy issues:
 * 1. Remove clinic_id from therapists table (use user.clinic_id instead)
 * 2. Remove userId column from user_roles table (use user_id only)
 * 3. Remove userId column from user_profiles table (use user_id only)
 *
 * Changes:
 * - Drop clinic_id column from therapists table
 * - Drop userId column from user_roles table
 * - Drop userId column from user_profiles table
 * - Update foreign key constraints accordingly
 */
export class FixRedundancyIssues extends Migration {
  async up(): Promise<void> {
    this.addSql("set names 'utf8';");
    this.addSql("set session_replication_role = 'replica';");

    // Step 1: Update therapists table - remove clinic_id column
    console.log('🔧 Removing clinic_id from therapists table...');

    // First, ensure all therapists have a valid user with clinic_id
    this.addSql(`
      UPDATE therapists 
      SET user_id = user_id 
      WHERE user_id IN (
        SELECT u.id 
        FROM users u 
        WHERE u.clinic_id IS NOT NULL
      );
    `);

    // Drop the unique constraint that includes clinic_id
    this.addSql(
      'alter table "therapists" drop constraint if exists "therapists_clinic_id_license_number_unique";',
    );

    // Drop the foreign key constraint for clinic_id
    this.addSql(
      'alter table "therapists" drop constraint if exists "therapists_clinic_id_foreign";',
    );

    // Drop the clinic_id column
    this.addSql('alter table "therapists" drop column if exists "clinic_id";');

    // Create new unique constraint on user_id and license_number
    this.addSql(
      'alter table "therapists" add constraint "therapists_user_id_license_number_unique" unique ("user_id", "license_number");',
    );

    // Step 2: Update user_roles table - remove userId column
    console.log('🔧 Removing userId from user_roles table...');

    // Drop the foreign key constraint for userId
    this.addSql(
      'alter table "user_roles" drop constraint if exists "user_roles_userId_foreign";',
    );

    // Drop the userId column
    this.addSql('alter table "user_roles" drop column if exists "userId";');

    // Step 3: Update user_profiles table - remove userId column
    console.log('🔧 Removing userId from user_profiles table...');

    // Drop the foreign key constraint for userId
    this.addSql(
      'alter table "user_profiles" drop constraint if exists "user_profiles_userId_foreign";',
    );

    // Drop the unique constraint on userId
    this.addSql(
      'alter table "user_profiles" drop constraint if exists "user_profiles_userId_unique";',
    );

    // Drop the userId column
    this.addSql('alter table "user_profiles" drop column if exists "userId";');

    this.addSql("set session_replication_role = 'origin';");
  }

  async down(): Promise<void> {
    this.addSql("set names 'utf8';");
    this.addSql("set session_replication_role = 'replica';");

    // Step 1: Restore therapists table - add clinic_id column back
    console.log('🔄 Restoring clinic_id to therapists table...');

    // Add clinic_id column back
    this.addSql('alter table "therapists" add column "clinic_id" uuid;');

    // Populate clinic_id from user.clinic_id
    this.addSql(`
      UPDATE therapists 
      SET clinic_id = u.clinic_id 
      FROM users u 
      WHERE therapists.user_id = u.id;
    `);

    // Make clinic_id not null
    this.addSql(
      'alter table "therapists" alter column "clinic_id" set not null;',
    );

    // Drop the new unique constraint
    this.addSql(
      'alter table "therapists" drop constraint if exists "therapists_user_id_license_number_unique";',
    );

    // Add back the original unique constraint
    this.addSql(
      'alter table "therapists" add constraint "therapists_clinic_id_license_number_unique" unique ("clinic_id", "license_number");',
    );

    // Add back the foreign key constraint
    this.addSql(
      'alter table "therapists" add constraint "therapists_clinic_id_foreign" foreign key ("clinic_id") references "clinics" ("id") on update cascade on delete cascade;',
    );

    // Step 2: Restore user_roles table - add userId column back
    console.log('🔄 Restoring userId to user_roles table...');

    // Add userId column back
    this.addSql('alter table "user_roles" add column "userId" uuid;');

    // Populate userId from user_id
    this.addSql('UPDATE user_roles SET "userId" = user_id;');

    // Make userId not null
    this.addSql('alter table "user_roles" alter column "userId" set not null;');

    // Add back the foreign key constraint
    this.addSql(
      'alter table "user_roles" add constraint "user_roles_userId_foreign" foreign key ("userId") references "users" ("id") on update cascade;',
    );

    // Step 3: Restore user_profiles table - add userId column back
    console.log('🔄 Restoring userId to user_profiles table...');

    // Add userId column back
    this.addSql('alter table "user_profiles" add column "userId" uuid;');

    // Populate userId from user_id
    this.addSql('UPDATE user_profiles SET "userId" = user_id;');

    // Make userId not null
    this.addSql(
      'alter table "user_profiles" alter column "userId" set not null;',
    );

    // Add back the unique constraint
    this.addSql(
      'alter table "user_profiles" add constraint "user_profiles_userId_unique" unique ("userId");',
    );

    // Add back the foreign key constraint
    this.addSql(
      'alter table "user_profiles" add constraint "user_profiles_userId_foreign" foreign key ("userId") references "users" ("id") on update cascade;',
    );

    this.addSql("set session_replication_role = 'origin';");
  }
}
