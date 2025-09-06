import { Migration } from '@mikro-orm/migrations';

export class Migration20250906131448 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "email_verification_code" varchar(6) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "email_verification_code";');
  }

}
