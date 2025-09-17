import { Migration } from '@mikro-orm/migrations';

export class Migration20241220000003 extends Migration {
  async up(): Promise<void> {
    // Add new fields to consultations table
    this.addSql(`
      ALTER TABLE "consultations" 
      ADD COLUMN "previous_psychological_diagnosis" boolean NOT NULL DEFAULT false,
      ADD COLUMN "previous_psychological_diagnosis_details" text,
      ADD COLUMN "significant_physical_illness" boolean NOT NULL DEFAULT false,
      ADD COLUMN "significant_physical_illness_details" text,
      ADD COLUMN "traumatic_experience" boolean NOT NULL DEFAULT false,
      ADD COLUMN "traumatic_experience_details" text,
      ADD COLUMN "family_psychological_history" boolean NOT NULL DEFAULT false,
      ADD COLUMN "family_psychological_history_details" text,
      ADD COLUMN "script_generation_preferences" text;
    `);

    // Update form_type to form_types (change from varchar to json)
    this.addSql(`
      ALTER TABLE "consultations" 
      ADD COLUMN "form_types" json;
    `);

    // Migrate existing data from form_type to form_types
    this.addSql(`
      UPDATE "consultations" 
      SET "form_types" = json_build_array("form_type");
    `);

    // Drop the old form_type column
    this.addSql(`
      ALTER TABLE "consultations" 
      DROP COLUMN "form_type";
    `);
  }

  async down(): Promise<void> {
    // Add back form_type column
    this.addSql(`
      ALTER TABLE "consultations" 
      ADD COLUMN "form_type" varchar(50);
    `);

    // Migrate data back from form_types to form_type (take first element)
    this.addSql(`
      UPDATE "consultations" 
      SET "form_type" = ("form_types"->>0)::varchar;
    `);

    // Drop the new columns
    this.addSql(`
      ALTER TABLE "consultations" 
      DROP COLUMN "form_types",
      DROP COLUMN "previous_psychological_diagnosis",
      DROP COLUMN "previous_psychological_diagnosis_details",
      DROP COLUMN "significant_physical_illness",
      DROP COLUMN "significant_physical_illness_details",
      DROP COLUMN "traumatic_experience",
      DROP COLUMN "traumatic_experience_details",
      DROP COLUMN "family_psychological_history",
      DROP COLUMN "family_psychological_history_details",
      DROP COLUMN "script_generation_preferences";
    `);
  }
}
