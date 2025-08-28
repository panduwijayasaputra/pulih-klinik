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
import {
  StartRegistrationDto,
  ClinicDataDto,
  PaymentDataDto,
  CompleteRegistrationDto,
  PaymentMethod,
} from './dto';
import * as bcrypt from 'bcryptjs';

export interface RegistrationResponse {
  id: string;
  email: string;
  status: RegistrationStatus;
  currentStep: RegistrationStep;
  completedSteps: RegistrationStep[];
  createdAt: Date;
  expiresAt?: Date;
  clinicData?: any;
  paymentStatus: PaymentStatus;
}

@Injectable()
export class RegistrationService {
  constructor(private readonly em: EntityManager) {}

  async startRegistration(
    startRegistrationDto: StartRegistrationDto,
    metadata?: { ipAddress?: string; userAgent?: string },
  ): Promise<RegistrationResponse> {
    const { email, source, referrer } = startRegistrationDto;

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

    // Create new registration
    const registration = new Registration();
    registration.email = email;
    registration.metadata = {
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      source,
      referrer,
    };

    // Generate verification code
    registration.verificationCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    await this.em.persistAndFlush(registration);

    // TODO: Send verification email
    console.log(
      `Verification code for ${email}: ${registration.verificationCode}`,
    );

    return this.mapToRegistrationResponse(registration);
  }

  async submitClinicData(
    registrationId: string,
    clinicDataDto: ClinicDataDto,
  ): Promise<RegistrationResponse> {
    const registration = await this.getRegistrationById(registrationId);

    if (!registration.canProceedToStep(RegistrationStep.CLINIC_DATA)) {
      throw new BadRequestException('Cannot proceed to clinic data step');
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
    registration.addCompletedStep(RegistrationStep.CLINIC_DATA);
    registration.updateStatus(RegistrationStatus.CLINIC_DATA_SUBMITTED);

    await this.em.persistAndFlush(registration);

    return this.mapToRegistrationResponse(registration);
  }

  async uploadDocuments(
    registrationId: string,
    documents: Array<{ fileName: string; fileType: string; fileSize: number }>,
  ): Promise<RegistrationResponse> {
    const registration = await this.getRegistrationById(registrationId);

    if (!registration.canProceedToStep(RegistrationStep.DOCUMENTS)) {
      throw new BadRequestException('Cannot proceed to documents step');
    }

    // Update registration with document info
    registration.documents = documents.map((doc) => ({
      ...doc,
      uploadedAt: new Date(),
      verified: false, // Will be verified manually by admin
    }));

    registration.addCompletedStep(RegistrationStep.DOCUMENTS);
    registration.updateStatus(RegistrationStatus.DOCUMENTS_UPLOADED);

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

    // Update registration with payment data
    registration.paymentData = paymentDataDto;
    registration.addCompletedStep(RegistrationStep.PAYMENT);
    registration.updateStatus(RegistrationStatus.PAYMENT_PENDING);

    // TODO: Integrate with actual payment gateway
    // For now, simulate payment processing
    if (paymentDataDto.paymentMethod === PaymentMethod.BANK_TRANSFER) {
      registration.paymentStatus = PaymentStatus.PENDING;
    } else {
      // Simulate immediate payment completion for other methods
      registration.paymentStatus = PaymentStatus.COMPLETED;
      registration.updateStatus(RegistrationStatus.PAYMENT_COMPLETED);
    }

    await this.em.persistAndFlush(registration);

    return this.mapToRegistrationResponse(registration);
  }

  async completeRegistration(
    registrationId: string,
    completeRegistrationDto: CompleteRegistrationDto,
  ): Promise<RegistrationResponse> {
    const registration = await this.getRegistrationById(registrationId);

    if (!registration.canProceedToStep(RegistrationStep.COMPLETE)) {
      throw new BadRequestException('Cannot proceed to completion step');
    }

    if (registration.paymentStatus !== PaymentStatus.COMPLETED) {
      throw new BadRequestException(
        'Payment must be completed before registration completion',
      );
    }

    await this.em.transactional(async (em) => {
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

      em.persist(clinic);

      // Create admin user
      const user = new User();
      user.email = registration.email;
      user.passwordHash = await bcrypt.hash(Math.random().toString(36), 10); // Temporary password
      user.isActive = true;
      user.emailVerified = true;
      user.emailVerifiedAt = new Date();

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

      if (registration.paymentData?.subscriptionId) {
        registration.paymentData.subscriptionId =
          completeRegistrationDto.subscriptionId;
      }

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

  async verifyEmail(
    registrationId: string,
    verificationCode: string,
  ): Promise<RegistrationResponse> {
    const registration = await this.getRegistrationById(registrationId);

    if (registration.verificationCode !== verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    registration.emailVerified = true;
    registration.emailVerifiedAt = new Date();
    registration.verificationCode = undefined; // Clear the code after use

    await this.em.persistAndFlush(registration);

    return this.mapToRegistrationResponse(registration);
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
    registration.verificationCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    await this.em.persistAndFlush(registration);

    // TODO: Send verification email
    console.log(
      `New verification code for ${email}: ${registration.verificationCode}`,
    );
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

  private mapToRegistrationResponse(
    registration: Registration,
  ): RegistrationResponse {
    return {
      id: registration.id,
      email: registration.email,
      status: registration.status,
      currentStep: registration.currentStep,
      completedSteps: registration.completedSteps || [],
      createdAt: registration.createdAt,
      expiresAt: registration.expiresAt,
      clinicData: registration.clinicData,
      paymentStatus: registration.paymentStatus,
    };
  }
}
