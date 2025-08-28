import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import {
  Registration,
  RegistrationStatus,
  RegistrationStep,
  PaymentStatus,
} from '../database/entities/registration.entity';
import { User } from '../database/entities/user.entity';
import { Clinic } from '../database/entities/clinic.entity';
import { UserRole } from '../database/entities/user-role.entity';
import { SubscriptionTier } from '../database/entities/subscription-tier.entity';
import {
  StartRegistrationDto,
  ClinicDataDto,
  VerifyEmailDto,
  SubscriptionDataDto,
  PaymentDataDto,
  CompleteRegistrationDto,
  PaymentMethod,
} from './dto';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export interface RegistrationResponse {
  id: string;
  email: string;
  status: RegistrationStatus;
  currentStep: RegistrationStep;
  completedSteps: RegistrationStep[];
  createdAt: Date;
  expiresAt?: Date;
  userData?: any;
  clinicData?: any;
  subscriptionData?: any;
  paymentData?: any;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  paymentStatus: PaymentStatus;
}

@Injectable()
export class RegistrationService {
  constructor(private readonly em: EntityManager) {}

  async startRegistration(
    startRegistrationDto: StartRegistrationDto,
    metadata?: { ipAddress?: string; userAgent?: string },
  ): Promise<RegistrationResponse> {
    const { email, name, password, source, referrer } = startRegistrationDto;

    // Check if email already exists as a user
    const existingUser = await this.em.findOne(User, { email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check for existing active registration
    const existingRegistration = await this.em.findOne(Registration, {
      email,
      status: {
        $nin: [
          RegistrationStatus.COMPLETED,
          RegistrationStatus.CANCELLED,
          RegistrationStatus.EXPIRED,
        ],
      },
    });

    if (existingRegistration && !existingRegistration.isExpired()) {
      // Return existing registration
      return this.mapToRegistrationResponse(existingRegistration);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new registration
    const registration = new Registration();
    registration.email = email;
    registration.userData = {
      name,
      email,
      passwordHash,
    };
    registration.metadata = {
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      source,
      referrer,
    };

    // Generate verification code (static for development)
    const verificationCode = this.generateVerificationCode();
    registration.verificationCode = verificationCode;

    await this.em.persistAndFlush(registration);

    // Send verification email (static code for development)
    await this.sendVerificationEmail(email, verificationCode);

    return this.mapToRegistrationResponse(registration);
  }

  async verifyEmail(
    registrationId: string,
    verifyEmailDto: VerifyEmailDto,
  ): Promise<RegistrationResponse> {
    const registration = await this.getRegistrationById(registrationId);

    if (registration.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    if (registration.verificationCode !== verifyEmailDto.verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    // Mark email as verified
    registration.emailVerified = true;
    registration.emailVerifiedAt = new Date();
    registration.verificationCode = undefined; // Clear the code after use
    registration.addCompletedStep(RegistrationStep.EMAIL_VERIFICATION);
    registration.updateStatus(RegistrationStatus.EMAIL_VERIFIED);

    await this.em.persistAndFlush(registration);

    return this.mapToRegistrationResponse(registration);
  }

  async submitClinicData(
    registrationId: string,
    clinicDataDto: ClinicDataDto,
  ): Promise<RegistrationResponse> {
    const registration = await this.getRegistrationById(registrationId);

    if (!registration.emailVerified) {
      throw new BadRequestException(
        'Email must be verified before submitting clinic data',
      );
    }

    if (!registration.canProceedToStep(RegistrationStep.CLINIC_INFO)) {
      throw new BadRequestException('Cannot proceed to clinic info step');
    }

    // Check for existing clinic with same name and email
    const existingClinic = await this.em.findOne(Clinic, {
      $or: [{ name: clinicDataDto.name }, { email: clinicDataDto.email }],
    });

    if (existingClinic) {
      throw new ConflictException(
        'Clinic with same name or email already exists',
      );
    }

    // Update registration with clinic data
    registration.clinicData = clinicDataDto;
    registration.addCompletedStep(RegistrationStep.CLINIC_INFO);
    registration.updateStatus(RegistrationStatus.CLINIC_CREATED);

    await this.em.persistAndFlush(registration);

    return this.mapToRegistrationResponse(registration);
  }

  async selectSubscription(
    registrationId: string,
    subscriptionDataDto: SubscriptionDataDto,
  ): Promise<RegistrationResponse> {
    const registration = await this.getRegistrationById(registrationId);

    if (!registration.canProceedToStep(RegistrationStep.SUBSCRIPTION)) {
      throw new BadRequestException('Cannot proceed to subscription step');
    }

    // Validate subscription tier exists
    const subscriptionTier = await this.em.findOne(SubscriptionTier, {
      code: subscriptionDataDto.tierCode,
      isActive: true,
    });

    if (!subscriptionTier) {
      throw new BadRequestException('Invalid subscription tier');
    }

        // Calculate amount based on billing cycle
    const amount =
      subscriptionDataDto.billingCycle === 'yearly'
        ? subscriptionTier.yearlyPrice
        : subscriptionTier.monthlyPrice;

    // Update registration with subscription data
    registration.subscriptionData = {
      tierCode: subscriptionDataDto.tierCode,
      tierName: subscriptionTier.name,
      billingCycle: subscriptionDataDto.billingCycle,
      amount,
      currency: subscriptionDataDto.currency,
    };
    registration.addCompletedStep(RegistrationStep.SUBSCRIPTION);
    registration.updateStatus(RegistrationStatus.SUBSCRIPTION_SELECTED);

    await this.em.persistAndFlush(registration);

    return this.mapToRegistrationResponse(registration);
  }

  async processPayment(
    registrationId: string,
    paymentDataDto: PaymentDataDto,
  ): Promise<RegistrationResponse> {
    const registration = await this.getRegistrationById(registrationId);

    if (!registration.canProceedToStep(RegistrationStep.PAYMENT)) {
      throw new BadRequestException('Cannot proceed to payment step');
    }

    if (!registration.subscriptionData) {
      throw new BadRequestException('Subscription must be selected before payment');
    }

    // Validate payment amount matches subscription amount
    if (paymentDataDto.amount !== registration.subscriptionData.amount) {
      throw new BadRequestException('Payment amount does not match subscription amount');
    }

    // Update registration with payment data
    registration.paymentData = {
      paymentMethod: paymentDataDto.paymentMethod,
      paymentId: paymentDataDto.paymentId,
      transactionId: paymentDataDto.transactionId,
      amount: paymentDataDto.amount,
      currency: paymentDataDto.currency,
      status: PaymentStatus.PROCESSING,
      processedAt: new Date(),
    };
    registration.paymentStatus = PaymentStatus.PROCESSING;

    // TODO: Integrate with actual payment gateway
    // For now, simulate payment processing
    if (paymentDataDto.paymentMethod === PaymentMethod.BANK_TRANSFER) {
      registration.paymentStatus = PaymentStatus.PENDING;
      registration.paymentData.status = PaymentStatus.PENDING;
    } else {
      // Simulate immediate payment completion for other methods
      registration.paymentStatus = PaymentStatus.COMPLETED;
      registration.paymentData.status = PaymentStatus.COMPLETED;
      registration.addCompletedStep(RegistrationStep.PAYMENT);
      registration.updateStatus(RegistrationStatus.PAYMENT_COMPLETED);
    }

    await this.em.persistAndFlush(registration);

    return this.mapToRegistrationResponse(registration);
  }

  async completeRegistration(
    registrationId: string,
    _completeRegistrationDto: CompleteRegistrationDto,
  ): Promise<RegistrationResponse> {
    const registration = await this.getRegistrationById(registrationId);

    if (!registration.canProceedToStep(RegistrationStep.COMPLETE)) {
      throw new BadRequestException('Cannot proceed to completion step');
    }

    if (!registration.userData || !registration.clinicData || !registration.subscriptionData) {
      throw new BadRequestException('User, clinic, and subscription data must be provided');
    }

    if (registration.paymentStatus !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment must be completed before registration completion');
    }

    await this.em.transactional(async (em) => {
      // Get selected subscription tier
      const subscriptionTier = await em.findOne(SubscriptionTier, {
        code: registration.subscriptionData!.tierCode,
      });
      if (!subscriptionTier) {
        throw new BadRequestException('Selected subscription tier not found');
      }

      // Create clinic
      const clinic = new Clinic();
      clinic.name = registration.clinicData!.name;
      clinic.address = registration.clinicData!.address;
      clinic.phone = registration.clinicData!.phone;
      clinic.email = registration.clinicData!.email;
      clinic.website = registration.clinicData!.website;
      clinic.description = registration.clinicData!.description;
      clinic.workingHours = registration.clinicData!.workingHours;
      clinic.isActive = true;
      clinic.subscriptionTier = subscriptionTier;

      em.persist(clinic);

      // Create admin user
      const user = new User();
      user.email = registration.email;
      user.passwordHash = registration.userData!.passwordHash;
      user.isActive = true;
      user.emailVerified = true;
      user.emailVerifiedAt = registration.emailVerifiedAt;

      em.persist(user);

      // Set user's clinic
      user.clinic = clinic;
      em.persist(user);

      // Create admin role
      const adminRole = new UserRole();
      adminRole.user = user;
      adminRole.role = 'clinic_admin';

      em.persist(adminRole);

      // Update registration
      registration.createdUserId = user.id;
      registration.createdClinicId = clinic.id;
      registration.addCompletedStep(RegistrationStep.COMPLETE);
      registration.updateStatus(RegistrationStatus.COMPLETED);

      em.persist(registration);
    });

    return this.mapToRegistrationResponse(registration);
  }

  async getRegistrationStatus(
    registrationId: string,
  ): Promise<RegistrationResponse> {
    const registration = await this.getRegistrationById(registrationId);
    return this.mapToRegistrationResponse(registration);
  }

  async cancelRegistration(registrationId: string): Promise<void> {
    const registration = await this.getRegistrationById(registrationId);

    if (registration.status === RegistrationStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed registration');
    }

    registration.updateStatus(RegistrationStatus.CANCELLED);
    await this.em.persistAndFlush(registration);
  }

  async resendVerificationCode(email: string): Promise<void> {
    const registration = await this.em.findOne(Registration, {
      email,
      status: {
        $nin: [
          RegistrationStatus.COMPLETED,
          RegistrationStatus.CANCELLED,
          RegistrationStatus.EXPIRED,
        ],
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new verification code
    const verificationCode = this.generateVerificationCode();
    registration.verificationCode = verificationCode;
    await this.em.persistAndFlush(registration);

    // Send verification email
    await this.sendVerificationEmail(email, verificationCode);
  }

  // Helper methods
  private async getRegistrationById(id: string): Promise<Registration> {
    const registration = await this.em.findOne(Registration, { id });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.isExpired()) {
      registration.updateStatus(RegistrationStatus.EXPIRED);
      await this.em.persistAndFlush(registration);
      throw new BadRequestException('Registration has expired');
    }

    return registration;
  }

  private generateVerificationCode(): string {
    // In development, use static code for easier testing
    if (process.env.NODE_ENV === 'development') {
      return '123456';
    }

    // In production, generate random 6-digit code
    return randomBytes(3).toString('hex').toUpperCase().substring(0, 6);
  }

  private async sendVerificationEmail(email: string, code: string): Promise<void> {
    // In development, log the code
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 Verification code for ${email}: ${code}`);
      console.log(
        `🔗 Verification URL: http://localhost:3000/register/verify?code=${code}`,
      );
    } else {
      // TODO: Implement real email sending service
      console.log(
        `📧 Sending verification email to ${email} with code: ${code}`,
      );
    }
  }

  private mapToRegistrationResponse(
    registration: Registration,
  ): RegistrationResponse {
    return {
      id: registration.id,
      email: registration.email,
      status: registration.status,
      currentStep: registration.getCurrentStep(),
      completedSteps: registration.completedSteps || [],
      createdAt: registration.createdAt,
      expiresAt: registration.expiresAt,
      userData: registration.userData,
      clinicData: registration.clinicData,
      subscriptionData: registration.subscriptionData,
      paymentData: registration.paymentData,
      emailVerified: registration.emailVerified,
      emailVerifiedAt: registration.emailVerifiedAt,
      paymentStatus: registration.paymentStatus,
    };
  }
}
