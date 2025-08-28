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
  USER_CREATED = 'user_created',
  EMAIL_VERIFIED = 'email_verified',
  CLINIC_CREATED = 'clinic_created',
  SUBSCRIPTION_SELECTED = 'subscription_selected',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_COMPLETED = 'payment_completed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum RegistrationStep {
  USER_FORM = 'user_form',
  EMAIL_VERIFICATION = 'email_verification',
  CLINIC_INFO = 'clinic_info',
  SUBSCRIPTION = 'subscription',
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
  status: RegistrationStatus = RegistrationStatus.USER_CREATED;

  @Enum(() => RegistrationStep)
  currentStep: RegistrationStep = RegistrationStep.USER_FORM;

  @Property({ type: JsonType, nullable: true })
  completedSteps?: RegistrationStep[];

  // User data (clinic admin)
  @Property({ type: JsonType, nullable: true })
  userData?: {
    name: string;
    email: string;
    passwordHash: string;
  };

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

  // Subscription data
  @Property({ type: JsonType, nullable: true })
  subscriptionData?: {
    tierCode: string;
    tierName: string;
    billingCycle: 'monthly' | 'yearly';
    amount: number;
    currency: string;
  };

  // Payment data
  @Property({ type: JsonType, nullable: true })
  paymentData?: {
    paymentMethod: string;
    paymentId?: string;
    transactionId?: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    processedAt?: Date;
  };

  @Enum(() => PaymentStatus)
  paymentStatus: PaymentStatus = PaymentStatus.PENDING;

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
    this.completedSteps = [RegistrationStep.USER_FORM];
  }

  // Helper methods
  isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  canProceedToStep(step: RegistrationStep): boolean {
    if (!this.completedSteps) return false;

    switch (step) {
      case RegistrationStep.USER_FORM:
        return true;
      case RegistrationStep.EMAIL_VERIFICATION:
        return this.completedSteps.includes(RegistrationStep.USER_FORM);
      case RegistrationStep.CLINIC_INFO:
        return this.completedSteps.includes(RegistrationStep.EMAIL_VERIFICATION) && this.emailVerified;
      case RegistrationStep.SUBSCRIPTION:
        return this.completedSteps.includes(RegistrationStep.CLINIC_INFO);
      case RegistrationStep.PAYMENT:
        return this.completedSteps.includes(RegistrationStep.SUBSCRIPTION);
      case RegistrationStep.COMPLETE:
        return this.completedSteps.includes(RegistrationStep.PAYMENT) && this.paymentStatus === PaymentStatus.COMPLETED;
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

  // Get current step based on registration state
  getCurrentStep(): RegistrationStep {
    if (!this.userData) {
      return RegistrationStep.USER_FORM;
    }
    
    if (!this.emailVerified) {
      return RegistrationStep.EMAIL_VERIFICATION;
    }
    
    if (!this.clinicData) {
      return RegistrationStep.CLINIC_INFO;
    }
    
    if (!this.subscriptionData) {
      return RegistrationStep.SUBSCRIPTION;
    }
    
    if (this.paymentStatus !== PaymentStatus.COMPLETED) {
      return RegistrationStep.PAYMENT;
    }
    
    if (this.status === RegistrationStatus.COMPLETED) {
      return RegistrationStep.COMPLETE;
    }
    
    return RegistrationStep.PAYMENT;
  }
}
