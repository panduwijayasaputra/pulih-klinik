import { Migration } from '@mikro-orm/migrations';

export class Migration20250826092001_InitialSchema extends Migration {
  // eslint-disable-next-line @typescript-eslint/require-await
  override async up(): Promise<void> {
    this.addSql(
      `create table "users" ("id" uuid not null default gen_random_uuid(), "email" varchar(255) not null, "password_hash" varchar(255) not null, "email_verified" boolean not null default false, "email_verification_token" varchar(255) null, "email_verification_expires" timestamptz null, "password_reset_token" varchar(255) null, "password_reset_expires" timestamptz null, "last_login" timestamptz null, "is_active" boolean not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "users_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );

    this.addSql(
      `create table "user_profiles" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "name" varchar(255) not null, "phone" varchar(20) null, "address" text null, "bio" text null, "avatar_url" varchar(500) null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "userId" uuid not null, constraint "user_profiles_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "user_profiles" add constraint "user_profiles_user_id_unique" unique ("user_id");`,
    );
    this.addSql(
      `alter table "user_profiles" add constraint "user_profiles_userId_unique" unique ("userId");`,
    );

    this.addSql(
      `create table "user_roles" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "role" varchar(50) not null, "clinic_id" uuid null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "userId" uuid not null, constraint "user_roles_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "user_roles_user_id_index" on "user_roles" ("user_id");`,
    );
    this.addSql(
      `alter table "user_roles" add constraint "user_roles_user_id_role_clinic_id_unique" unique ("user_id", "role", "clinic_id");`,
    );

    this.addSql(
      `alter table "user_profiles" add constraint "user_profiles_userId_foreign" foreign key ("userId") references "users" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "user_roles" add constraint "user_roles_userId_foreign" foreign key ("userId") references "users" ("id") on update cascade;`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async down(): Promise<void> {
    this.addSql(
      `alter table "user_profiles" drop constraint "user_profiles_userId_foreign";`,
    );

    this.addSql(
      `alter table "user_roles" drop constraint "user_roles_userId_foreign";`,
    );

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "user_profiles" cascade;`);

    this.addSql(`drop table if exists "user_roles" cascade;`);
  }
}
