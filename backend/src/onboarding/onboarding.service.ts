import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User, Clinic, UserProfile } from '../database/entities';
import {
  ClinicOnboardingDto,
  SubscriptionOnboardingDto,
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
    let currentStep: 'clinic_info' | 'subscription' | 'payment' | 'complete' = 'complete';

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
        roles: updatedUser.roles.map((role) => ({
          id: role.id,
          role: role.role,
        })),
        clinicId: updatedUser.clinic?.id,
        clinicName: updatedUser.clinic?.name,
      },
    };
  }

  async submitSubscription(
    userId: string,
    subscriptionData: SubscriptionOnboardingDto,
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
      throw new BadRequestException('Must complete clinic setup first');
    }

    // In a real implementation, you would create subscription records
    // For now, just validate the data and return success

    const validTiers = ['beta', 'alpha', 'theta'];
    if (!validTiers.includes(subscriptionData.tierCode)) {
      throw new BadRequestException('Invalid subscription tier');
    }

    const validCycles = ['monthly', 'yearly'];
    if (!validCycles.includes(subscriptionData.billingCycle)) {
      throw new BadRequestException('Invalid billing cycle');
    }

    // Validate amount based on tier and cycle
    const tierPrices = {
      beta: { monthly: 50000, yearly: 550000 },
      alpha: { monthly: 100000, yearly: 1000000 },
      theta: { monthly: 150000, yearly: 1500000 },
    };

    const expectedAmount =
      tierPrices[subscriptionData.tierCode][subscriptionData.billingCycle];
    if (subscriptionData.amount !== expectedAmount) {
      throw new BadRequestException(
        `Invalid amount for selected tier and billing cycle. Expected: ${expectedAmount}`,
      );
    }

    return {
      success: true,
      message: 'Subscription selected successfully',
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
