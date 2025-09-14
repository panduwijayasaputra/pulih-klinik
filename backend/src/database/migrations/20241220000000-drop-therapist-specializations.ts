import { Migration } from '@mikro-orm/migrations';

export class Migration20241220000000 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop table if exists "therapist_specializations" cascade;');
  }

  async down(): Promise<void> {
    this.addSql(`
      create table "therapist_specializations" (
        "id" uuid not null default gen_random_uuid(),
        "therapist_id" uuid not null,
        "specialization" varchar(100) not null,
        "created_at" timestamp not null default CURRENT_TIMESTAMP,
        constraint "therapist_specializations_pkey" primary key ("id"),
        constraint "therapist_specializations_therapist_specialization_unique" unique ("therapist_id", "specialization")
      );
    `);
    this.addSql(`
      alter table "therapist_specializations" 
      add constraint "therapist_specializations_therapist_id_foreign" 
      foreign key ("therapist_id") references "therapists" ("id") on update cascade on delete cascade;
    `);
  }
}
