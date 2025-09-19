import { Migration } from '@mikro-orm/migrations';

export class FixGinIndexOperatorClass extends Migration {
  async up(): Promise<void> {
    // Drop the existing problematic index
    this.addSql(`DROP INDEX IF EXISTS "consultations_form_types_index";`);
    
    // Note: JSON columns cannot be indexed in PostgreSQL
    // The form_types column will be queried without an index
    // This is acceptable for the current use case
  }

  async down(): Promise<void> {
    // Drop the fixed index
    this.addSql(`DROP INDEX IF EXISTS "consultations_form_types_index";`);
    
    // Recreate the original problematic index (for rollback)
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "consultations_form_types_index" 
      ON "consultations" USING GIN ("form_types");
    `);
  }
}
