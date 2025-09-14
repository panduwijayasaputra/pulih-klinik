import { Migration } from '@mikro-orm/migrations';

export class Migration20250120000001 extends Migration {
  async up(): Promise<void> {
    // Add status column to users table
    this.addSql(
      'alter table "users" add column "status" varchar(20) not null default \'active\';',
    );

    // Migrate existing isActive data to status
    this.addSql(
      'update "users" set "status" = case when "is_active" = true then \'active\' else \'inactive\' end;',
    );

    // For therapists, we need to check their therapist status and update accordingly
    // Map old statuses to new simplified statuses
    this.addSql(`
      update "users" 
      set "status" = case 
        when t.status = 'pending_setup' then 'pending'
        when t.status = 'pending_verification' then 'pending'
        when t.status = 'on_leave' then 'inactive'
        when t.status = 'suspended' then 'inactive'
        when t.status = 'disabled' then 'inactive'
        when t.status = 'deleted' then 'deleted'
        when t.status = 'inactive' then 'inactive'
        else 'active'
      end
      from "therapists" t 
      where "users".id = t.user_id;
    `);

    // Drop the old isActive column
    this.addSql('alter table "users" drop column "is_active";');

    // Drop the status column from therapists table since it's now in users
    this.addSql('alter table "therapists" drop column "status";');
  }

  async down(): Promise<void> {
    // Re-add isActive column to users table
    this.addSql(
      'alter table "users" add column "is_active" boolean not null default true;',
    );

    // Re-add status column to therapists table
    this.addSql(
      'alter table "therapists" add column "status" varchar(20) not null default \'pending_setup\';',
    );

    // Migrate status back to isActive
    this.addSql(`
      update "users" 
      set "is_active" = case 
        when "status" = 'active' then true 
        else false 
      end;
    `);

    // Migrate status back to therapists table
    this.addSql(`
      update "therapists" 
      set "status" = case 
        when u.status = 'pending' then 'pending_setup'
        when u.status = 'inactive' then 'inactive'
        when u.status = 'deleted' then 'deleted'
        else 'active'
      end
      from "users" u 
      where "therapists".user_id = u.id;
    `);

    // Drop the status column from users
    this.addSql('alter table "users" drop column "status";');
  }
}
