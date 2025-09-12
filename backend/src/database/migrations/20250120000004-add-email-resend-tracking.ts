import { Migration } from '@mikro-orm/migrations';

export class AddEmailResendTracking extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "users" add column "email_resend_attempts" int4 not null default 0;');
    this.addSql('alter table "users" add column "email_resend_cooldown_until" timestamptz null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "email_resend_attempts";');
    this.addSql('alter table "users" drop column "email_resend_cooldown_until";');
  }
}
