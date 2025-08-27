import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  JsonType,
  Index,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

export enum RegistrationStatus {
  STARTED = 'started',
  CLINIC_DATA_SUBMITTED = 'clinic_data_submitted',
  DOCUMENTS_UPLOADED = 'documents_uploaded',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_COMPLETED = 'payment_completed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum RegistrationStep {
  START = 'start',
  CLINIC_DATA = 'clinic_data',
  DOCUMENTS = 'documents',
  PAYMENT = 'payment',
  COMPLETE = 'complete',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity({ tableName: 'registrations' })
@Index({ properties: ['email'] })
@Index({ properties: ['status'] })
@Index({ properties: ['createdAt'] })
export class Registration {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ length: 255 })
  @Index()
  email!: string;

  @Enum(() => RegistrationStatus)
  status: RegistrationStatus = RegistrationStatus.STARTED;

  @Enum(() => RegistrationStep)
  currentStep: RegistrationStep = RegistrationStep.START;

  @Property({ type: JsonType, nullable: true })
  completedSteps?: RegistrationStep[];

  // Clinic data
  @Property({ type: JsonType, nullable: true })
  clinicData?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    description?: string;
    workingHours?: string;
    province?: string;
  };

  // Payment data
  @Property({ type: JsonType, nullable: true })
  paymentData?: {
    subscriptionTier: string;
    paymentMethod: string;
    billingCycle: 'monthly' | 'yearly';
    amount: number;
    paymentId?: string;
    subscriptionId?: string;
  };

  @Enum(() => PaymentStatus)
  paymentStatus: PaymentStatus = PaymentStatus.PENDING;

  // Document tracking
  @Property({ type: JsonType, nullable: true })
  documents?: Array<{
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: Date;
    verified: boolean;
  }>;

  // Verification
  @Property({ nullable: true })
  verificationCode?: string;

  @Property({ default: false })
  emailVerified: boolean = false;

  @Property({ nullable: true })
  emailVerifiedAt?: Date;

  // Created entities after completion
  @Property({ type: 'uuid', nullable: true })
  createdUserId?: string;

  @Property({ type: 'uuid', nullable: true })
  createdClinicId?: string;

  // Timestamps
  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  completedAt?: Date;

  @Property({ nullable: true })
  expiresAt?: Date;

  // Metadata
  @Property({ type: JsonType, nullable: true })
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    source?: string;
    referrer?: string;
  };

  constructor() {
    // Set expiration to 7 days from creation
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    this.completedSteps = [RegistrationStep.START];
  }

  // Helper methods
  isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  canProceedToStep(step: RegistrationStep): boolean {
    if (!this.completedSteps) return false;

    switch (step) {
      case RegistrationStep.START:
        return true;
      case RegistrationStep.CLINIC_DATA:
        return this.completedSteps.includes(RegistrationStep.START);
      case RegistrationStep.DOCUMENTS:
        return this.completedSteps.includes(RegistrationStep.CLINIC_DATA);
      case RegistrationStep.PAYMENT:
        return this.completedSteps.includes(RegistrationStep.DOCUMENTS);
      case RegistrationStep.COMPLETE:
        return (
          this.completedSteps.includes(RegistrationStep.PAYMENT) &&
          this.paymentStatus === PaymentStatus.COMPLETED
        );
      default:
        return false;
    }
  }

  addCompletedStep(step: RegistrationStep): void {
    if (!this.completedSteps) {
      this.completedSteps = [];
    }
    if (!this.completedSteps.includes(step)) {
      this.completedSteps.push(step);
    }
    this.currentStep = step;
    this.updatedAt = new Date();
  }

  updateStatus(status: RegistrationStatus): void {
    this.status = status;
    this.updatedAt = new Date();

    if (status === RegistrationStatus.COMPLETED) {
      this.completedAt = new Date();
    }
  }
}
