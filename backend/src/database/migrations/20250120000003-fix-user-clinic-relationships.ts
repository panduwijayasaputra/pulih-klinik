import { Migration } from '@mikro-orm/migrations';

export class Migration20250120000003 extends Migration {
  async up(): Promise<void> {
    // Fix users who have therapist records but no clinic relationship
    // This happens when therapists were created but the user.clinic relationship wasn't set

    this.addSql(`
      UPDATE users 
      SET clinic_id = t.clinic_id
      FROM therapists t
      WHERE users.id = t.user_id 
        AND users.clinic_id IS NULL 
        AND t.clinic_id IS NOT NULL;
    `);
  }

  async down(): Promise<void> {
    // This migration is not easily reversible as we don't know which users
    // originally had clinic_id set vs which ones we're setting
    // In practice, this should not be rolled back
    this.addSql(`
      -- Migration not reversible
      -- Users with therapist records should keep their clinic relationships
    `);
  }
}
