import { Migration } from '@mikro-orm/migrations';

export class Migration20241220000004 extends Migration {
  async up(): Promise<void> {
    // Add new separate form data columns
    this.addSql(`
      ALTER TABLE "consultations" 
      ADD COLUMN "general_form_data" jsonb,
      ADD COLUMN "drug_addiction_form_data" jsonb,
      ADD COLUMN "minor_form_data" jsonb;
    `);

    // Migrate existing form_data to the appropriate new columns
    // This will move data from the old formData structure to the new separate columns
    this.addSql(`
      UPDATE "consultations" 
      SET 
        "general_form_data" = CASE 
          WHEN "form_types"::text LIKE '%"general"%' THEN "form_data"
          ELSE NULL 
        END,
        "drug_addiction_form_data" = CASE 
          WHEN "form_types"::text LIKE '%"drug_addiction"%' THEN "form_data"
          ELSE NULL 
        END,
        "minor_form_data" = CASE 
          WHEN "form_types"::text LIKE '%"minor"%' THEN "form_data"
          ELSE NULL 
        END
      WHERE "form_data" IS NOT NULL;
    `);

    // Drop the old form_data column
    this.addSql(`
      ALTER TABLE "consultations" 
      DROP COLUMN "form_data";
    `);
  }

  async down(): Promise<void> {
    // Add back the old form_data column
    this.addSql(`
      ALTER TABLE "consultations" 
      ADD COLUMN "form_data" jsonb;
    `);

    // Migrate data back from separate columns to form_data
    // This is a simplified migration - in practice you might want to merge the data
    this.addSql(`
      UPDATE "consultations" 
      SET "form_data" = COALESCE("general_form_data", "drug_addiction_form_data", "minor_form_data")
      WHERE "general_form_data" IS NOT NULL 
         OR "drug_addiction_form_data" IS NOT NULL 
         OR "minor_form_data" IS NOT NULL;
    `);

    // Drop the new separate columns
    this.addSql(`
      ALTER TABLE "consultations" 
      DROP COLUMN "general_form_data",
      DROP COLUMN "drug_addiction_form_data",
      DROP COLUMN "minor_form_data";
    `);
  }
}
