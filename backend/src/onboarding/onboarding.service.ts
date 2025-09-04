import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import {
  User,
  Clinic,
  UserProfile,
  SubscriptionTier,
} from '../database/entities';
import {
  ClinicOnboardingDto,
  SubscriptionOnboardingDto,
  BillingCycleEnum,
  PaymentOnboardingDto,
} from './dto';

export interface OnboardingStatusResponse {
  needsOnboarding: boolean;
  hasClinic: boolean;
  hasActiveSubscription?: boolean;
  clinicId?: string;
  clinicName?: string;
  subscriptionTier?: string;
  currentStep: 'clinic_info' | 'subscription' | 'payment' | 'complete';
}

export interface UserWithClinicResponse {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  roles: Array<{
    id: string;
    role: string;
  }>;
  clinicId?: string;
  clinicName?: string;
}

@Injectable()
export class OnboardingService {
  constructor(private readonly em: EntityManager) {}

  async checkOnboardingStatus(
    userId: string,
  ): Promise<OnboardingStatusResponse> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['clinic', 'clinic.subscriptionTier', 'roles', 'profile'] },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hasClinic = !!user.clinic;
    const hasActiveSubscription = !!user.clinic?.subscriptionTier;

    let needsOnboarding = false;
    let currentStep: 'clinic_info' | 'subscription' | 'payment' | 'complete' =
      'complete';

    if (!hasClinic) {
      needsOnboarding = true;
      currentStep = 'clinic_info';
    } else if (!hasActiveSubscription) {
      needsOnboarding = true;
      currentStep = 'subscription';
    }

    return {
      needsOnboarding,
      hasClinic,
      hasActiveSubscription,
      clinicId: user.clinic?.id,
      clinicName: user.clinic?.name,
      subscriptionTier: user.clinic?.subscriptionTier?.name,
      currentStep,
    };
  }

  async submitClinicData(
    userId: string,
    clinicData: ClinicOnboardingDto,
  ): Promise<{ success: boolean; message: string; user?: any }> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['clinic', 'roles', 'profile'] },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.clinic) {
      throw new BadRequestException('User already has a clinic assigned');
    }

    // Check if clinic with same name or email already exists
    const existingClinic = await this.em.findOne(Clinic, {
      $or: [{ name: clinicData.name }, { email: clinicData.email }],
    });

    if (existingClinic) {
      throw new ConflictException(
        'Clinic with same name or email already exists',
      );
    }

    // Create new clinic
    const clinic = this.em.create(Clinic, {
      name: clinicData.name,
      address: clinicData.address,
      phone: clinicData.phone,
      email: clinicData.email,
      website: clinicData.website,
      description: clinicData.description,
      workingHours:
        clinicData.workingHours ||
        'Mon-Fri: 08:00-17:00, Sat: 09:00-15:00, Sun: Closed',
      isActive: true,
      status: 'active',
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      fontFamily: 'Inter',
      timezone: 'Asia/Jakarta',
      language: 'id',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.em.persistAndFlush(clinic);

    // Assign clinic to user
    user.clinic = clinic;
    await this.em.persistAndFlush(user);

    // Return updated user data with clinic info
    const updatedUser = await this.em.findOne(
      User,
      { id: userId },
      { populate: ['clinic', 'roles', 'profile'] },
    );

    if (!updatedUser) {
      throw new NotFoundException('Updated user not found');
    }

    return {
      success: true,
      message: 'Clinic data submitted successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.profile?.name || updatedUser.email,
        isActive: updatedUser.isActive,
        roles: updatedUser.roles.map((role) => role.role),
        clinicId: updatedUser.clinic?.id,
        clinicName: updatedUser.clinic?.name,
      },
    };
  }

  async submitSubscription(
    userId: string,
    subscriptionData: SubscriptionOnboardingDto,
  ): Promise<{ success: boolean; message: string; user?: any }> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['clinic', 'roles', 'profile'] },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.clinic) {
      throw new BadRequestException('Must complete clinic setup first');
    }

    // Find the subscription tier by code
    const subscriptionTier = await this.em.findOne(SubscriptionTier, {
      code: subscriptionData.tierCode,
      isActive: true,
    });

    if (!subscriptionTier) {
      throw new BadRequestException('Invalid subscription tier');
    }

    const validCycles = [BillingCycleEnum.Monthly, BillingCycleEnum.Yearly];
    if (!validCycles.includes(subscriptionData.billingCycle)) {
      throw new BadRequestException('Invalid billing cycle');
    }

    // Validate amount based on tier and cycle
    const expectedAmount =
      subscriptionData.billingCycle === BillingCycleEnum.Monthly
        ? subscriptionTier.monthlyPrice
        : subscriptionTier.yearlyPrice;

    if (subscriptionData.amount !== expectedAmount) {
      throw new BadRequestException(
        `Invalid amount for selected tier and billing cycle. Expected: ${expectedAmount}`,
      );
    }

    // Update clinic with subscription tier
    user.clinic.subscriptionTier = subscriptionTier;

    // Set subscription expiry based on billing cycle
    const now = new Date();
    const expiryDate = new Date(now);
    if (subscriptionData.billingCycle === BillingCycleEnum.Monthly) {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }
    user.clinic.subscriptionExpires = expiryDate;

    // Mark clinic as active
    user.clinic.status = 'active';

    await this.em.persistAndFlush(user.clinic);

    // Return updated user data for auth store update
    const updatedUser = await this.em.findOne(
      User,
      { id: userId },
      { populate: ['clinic', 'clinic.subscriptionTier', 'roles', 'profile'] },
    );

    return {
      success: true,
      message: 'Subscription selected successfully',
      user: updatedUser
        ? {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.profile?.name || updatedUser.email,
            isActive: updatedUser.isActive,
            roles: updatedUser.roles.map((role) => role.role),
            clinicId: updatedUser.clinic?.id,
            clinicName: updatedUser.clinic?.name,
            subscriptionTier: updatedUser.clinic?.subscriptionTier?.name,
          }
        : undefined,
    };
  }

  async submitPayment(
    userId: string,
    paymentData: PaymentOnboardingDto,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['clinic'] },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.clinic) {
      throw new BadRequestException(
        'Must complete clinic and subscription setup first',
      );
    }

    // In a real implementation, you would integrate with payment providers
    // For now, just validate and simulate payment processing

    const validPaymentMethods = [
      'credit_card',
      'bank_transfer',
      'e_wallet',
      'virtual_account',
    ];
    if (!validPaymentMethods.includes(paymentData.paymentMethod)) {
      throw new BadRequestException('Invalid payment method');
    }

    if (paymentData.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0');
    }

    return {
      success: true,
      message: 'Payment processed successfully',
    };
  }

  async completeOnboarding(userId: string): Promise<{
    success: boolean;
    message: string;
    user: UserWithClinicResponse;
  }> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['clinic', 'roles', 'profile'] },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.clinic) {
      throw new BadRequestException('Must complete all onboarding steps first');
    }

    // Mark onboarding as complete by ensuring user has proper profile
    if (!user.profile) {
      const profile = this.em.create(UserProfile, {
        userId: user.id,
        user: user,
        name: 'Admin User', // Default name, can be updated later
        phone: user.clinic.phone,
        address: user.clinic.address,
        bio: 'Clinic Administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.em.persistAndFlush(profile);
    }

    // Prepare user response
    const userResponse: UserWithClinicResponse = {
      id: user.id,
      email: user.email,
      name: user.profile?.name || 'Admin User',
      isActive: user.isActive,
      roles: user.roles.map((role) => ({
        id: role.id,
        role: role.role,
      })),
      clinicId: user.clinic.id,
      clinicName: user.clinic.name,
    };

    return {
      success: true,
      message: 'Onboarding completed successfully',
      user: userResponse,
    };
  }
}
