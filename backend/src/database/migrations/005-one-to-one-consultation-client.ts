import { Migration } from '@mikro-orm/migrations';

export class Migration20240729130000 extends Migration {
  async up(): Promise<void> {
    // First, ensure we have a unique constraint on client_id to enforce 1:1 relationship
    this.addSql(`
      ALTER TABLE "consultations"
      ADD CONSTRAINT "consultations_client_id_unique" UNIQUE ("client_id");
    `);

    // Drop the therapist_id column since we no longer need it
    this.addSql(`
      ALTER TABLE "consultations"
      DROP COLUMN "therapist_id";
    `);

    // Drop the foreign key constraint for therapist if it exists
    this.addSql(`
      ALTER TABLE "consultations"
      DROP CONSTRAINT IF EXISTS "consultations_therapist_id_foreign";
    `);
  }

  async down(): Promise<void> {
    // Re-add the therapist_id column
    this.addSql(`
      ALTER TABLE "consultations"
      ADD COLUMN "therapist_id" uuid NULL;
    `);

    // Re-add the foreign key constraint for therapist
    this.addSql(`
      ALTER TABLE "consultations"
      ADD CONSTRAINT "consultations_therapist_id_foreign" 
      FOREIGN KEY ("therapist_id") REFERENCES "therapists"("id") ON DELETE CASCADE;
    `);

    // Remove the unique constraint on client_id
    this.addSql(`
      ALTER TABLE "consultations"
      DROP CONSTRAINT "consultations_client_id_unique";
    `);
  }
}
