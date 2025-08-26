import { Migration } from '@mikro-orm/migrations';

export class Migration20250826092355_AddClinicsAndUpdateAuth extends Migration {
  // eslint-disable-next-line @typescript-eslint/require-await
  override async up(): Promise<void> {
    this.addSql(
      `create table "clinics" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "address" text not null, "phone" varchar(20) not null, "email" varchar(255) not null, "website" varchar(255) null, "logo_url" varchar(500) null, "description" text null, "working_hours" text null, "primary_color" varchar(7) not null default '#3B82F6', "secondary_color" varchar(7) not null default '#1F2937', "font_family" varchar(100) not null default 'Inter', "timezone" varchar(50) not null default 'Asia/Jakarta', "language" varchar(10) not null default 'id', "email_notifications" boolean not null default true, "sms_notifications" boolean not null default false, "push_notifications" boolean not null default false, "status" varchar(20) not null default 'pending', "subscription_tier" varchar(20) not null default 'alpha', "subscription_expires" timestamptz null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "clinics_pkey" primary key ("id"), constraint clinics_status_check check (status IN ('active', 'suspended', 'pending', 'inactive')), constraint clinics_subscription_tier_check check (subscription_tier IN ('alpha', 'beta', 'theta', 'delta')));`,
    );

    this.addSql(`alter table "user_roles" add column "clinicId" uuid null;`);
    this.addSql(
      `alter table "user_roles" add constraint "user_roles_clinicId_foreign" foreign key ("clinicId") references "clinics" ("id") on update cascade on delete set null;`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async down(): Promise<void> {
    this.addSql(
      `alter table "user_roles" drop constraint "user_roles_clinicId_foreign";`,
    );

    this.addSql(`drop table if exists "clinics" cascade;`);

    this.addSql(`alter table "user_roles" drop column "clinicId";`);
  }
}
