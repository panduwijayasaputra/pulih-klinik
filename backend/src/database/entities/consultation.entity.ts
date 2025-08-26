import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Check,
} from '@mikro-orm/core';
import { Client } from './client.entity';
import { Therapist } from './therapist.entity';

export enum FormType {
  GENERAL = 'general',
  DRUG_ADDICTION = 'drug_addiction',
  MINOR = 'minor',
}

export enum ConsultationStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

@Entity({ tableName: 'consultations' })
export class Consultation {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Client, { onDelete: 'cascade' })
  client!: Client;

  @ManyToOne(() => Therapist, { onDelete: 'cascade' })
  therapist!: Therapist;

  // Basic info
  @Property({ type: 'varchar', length: 50 })
  formType!: FormType;

  @Property({ type: 'varchar', length: 20, default: ConsultationStatus.DRAFT })
  status: ConsultationStatus = ConsultationStatus.DRAFT;

  @Property({ type: 'date' })
  sessionDate!: Date;

  @Property({ type: 'integer', comment: 'Session duration in minutes' })
  sessionDuration!: number;

  @Property({ type: 'text', nullable: true })
  consultationNotes?: string;

  // Client background
  @Property({ type: 'boolean', default: false })
  previousTherapyExperience: boolean = false;

  @Property({ type: 'text', nullable: true })
  previousTherapyDetails?: string;

  @Property({ type: 'boolean', default: false })
  currentMedications: boolean = false;

  @Property({ type: 'text', nullable: true })
  currentMedicationsDetails?: string;

  // Presenting concerns
  @Property({ type: 'text' })
  primaryConcern!: string;

  @Property({ type: 'json', nullable: true })
  secondaryConcerns?: string[];

  @Check({ expression: 'symptom_severity >= 1 AND symptom_severity <= 5' })
  @Property({ type: 'integer', nullable: true })
  symptomSeverity?: number;

  @Property({ type: 'varchar', length: 100, nullable: true })
  symptomDuration?: string;

  // Goals and expectations
  @Property({ type: 'json', nullable: true })
  treatmentGoals?: string[];

  @Property({ type: 'text', nullable: true })
  clientExpectations?: string;

  // Assessment results
  @Property({ type: 'text', nullable: true })
  initialAssessment?: string;

  @Property({ type: 'text', nullable: true })
  recommendedTreatmentPlan?: string;

  // Form-specific data (JSONB for flexibility)
  @Property({ type: 'json', nullable: true })
  formData?: Record<string, any>;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
