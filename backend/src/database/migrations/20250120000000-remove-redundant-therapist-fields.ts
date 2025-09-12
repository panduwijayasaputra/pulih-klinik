import { Migration } from '@mikro-orm/migrations';

export class Migration20250120000000 extends Migration {

  async up(): Promise<void> {
    // Remove redundant columns from therapists table
    // These fields are now stored in user_profiles table
    this.addSql('alter table "therapists" drop column if exists "full_name";');
    this.addSql('alter table "therapists" drop column if exists "phone";');
    this.addSql('alter table "therapists" drop column if exists "avatar_url";');
  }

  async down(): Promise<void> {
    // Add back the columns if we need to rollback
    this.addSql('alter table "therapists" add column "full_name" varchar(255);');
    this.addSql('alter table "therapists" add column "phone" varchar(20);');
    this.addSql('alter table "therapists" add column "avatar_url" varchar(500);');
  }

}
