import { Migration } from '@mikro-orm/migrations';

export class Migration20250120000002 extends Migration {
  async up(): Promise<void> {
    // Add new status column to clinics table (if not exists)
    this.addSql(
      'alter table "clinics" add column "new_status" varchar(20) not null default \'pending\';',
    );

    // Migrate existing status and isActive data to new unified status
    // If clinic is active and status is 'active', set to 'active'
    this.addSql(`
      update "clinics" 
      set "new_status" = 'active' 
      where "status" = 'active' and "is_active" = true;
    `);

    // If clinic is active but status is not 'active', set to 'active' (promote to active)
    this.addSql(`
      update "clinics" 
      set "new_status" = 'active' 
      where "is_active" = true and "status" != 'active';
    `);

    // If clinic is not active but status is 'active', set to 'suspended' (demote from active)
    this.addSql(`
      update "clinics" 
      set "new_status" = 'suspended' 
      where "is_active" = false and "status" = 'active';
    `);

    // If clinic is not active and status is 'suspended', keep as 'suspended'
    this.addSql(`
      update "clinics" 
      set "new_status" = 'suspended' 
      where "is_active" = false and "status" = 'suspended';
    `);

    // If clinic is not active and status is 'pending', keep as 'pending'
    this.addSql(`
      update "clinics" 
      set "new_status" = 'pending' 
      where "is_active" = false and "status" = 'pending';
    `);

    // If clinic is not active and status is 'inactive', keep as 'inactive'
    this.addSql(`
      update "clinics" 
      set "new_status" = 'inactive' 
      where "is_active" = false and "status" = 'inactive';
    `);

    // Drop the old columns
    this.addSql('alter table "clinics" drop column "status";');
    this.addSql('alter table "clinics" drop column "is_active";');

    // Rename new_status to status
    this.addSql(
      'alter table "clinics" rename column "new_status" to "status";',
    );
  }

  async down(): Promise<void> {
    // Re-add old columns
    this.addSql(
      'alter table "clinics" add column "old_status" varchar(20) not null default \'pending\';',
    );
    this.addSql(
      'alter table "clinics" add column "is_active" boolean not null default true;',
    );

    // Migrate status back to old format
    this.addSql(`
      update "clinics" 
      set "old_status" = case 
        when "status" = 'active' then 'active'
        when "status" = 'pending' then 'pending'
        when "status" = 'suspended' then 'suspended'
        when "status" = 'inactive' then 'inactive'
        when "status" = 'disabled' then 'inactive'
        else 'pending'
      end;
    `);

    this.addSql(`
      update "clinics" 
      set "is_active" = case 
        when "status" = 'active' then true 
        else false 
      end;
    `);

    // Drop the new status column
    this.addSql('alter table "clinics" drop column "status";');

    // Rename old_status to status
    this.addSql(
      'alter table "clinics" rename column "old_status" to "status";',
    );
  }
}
