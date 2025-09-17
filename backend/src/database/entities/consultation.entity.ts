import {
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
  Check,
} from '@mikro-orm/core';
import { Client } from './client.entity';

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

  @OneToOne(() => Client, { onDelete: 'cascade' })
  client!: Client;

  // Basic info
  @Property({ type: 'json' })
  formTypes!: FormType[];

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

  // Additional psychological history fields
  @Property({ type: 'boolean', default: false })
  previousPsychologicalDiagnosis: boolean = false;

  @Property({ type: 'text', nullable: true })
  previousPsychologicalDiagnosisDetails?: string;

  @Property({ type: 'boolean', default: false })
  significantPhysicalIllness: boolean = false;

  @Property({ type: 'text', nullable: true })
  significantPhysicalIllnessDetails?: string;

  @Property({ type: 'boolean', default: false })
  traumaticExperience: boolean = false;

  @Property({ type: 'text', nullable: true })
  traumaticExperienceDetails?: string;

  @Property({ type: 'boolean', default: false })
  familyPsychologicalHistory: boolean = false;

  @Property({ type: 'text', nullable: true })
  familyPsychologicalHistoryDetails?: string;

  @Property({ type: 'text', nullable: true })
  scriptGenerationPreferences?: string;

  // Form-specific data (separate columns for each form type)
  @Property({ type: 'json', nullable: true })
  generalFormData?: Record<string, any>;

  @Property({ type: 'json', nullable: true })
  drugAddictionFormData?: Record<string, any>;

  @Property({ type: 'json', nullable: true })
  minorFormData?: Record<string, any>;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
