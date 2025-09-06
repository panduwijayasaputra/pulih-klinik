import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../database/entities/user.entity';
import { UserProfile } from '../database/entities/user-profile.entity';
import { UserRole as UserRoleEntity } from '../database/entities/user-role.entity';
import { UserRole } from '../common/enums/user-roles.enum';
import { EmailService } from '../lib/email/email.service';
import {
  StartRegistrationDto,
  VerifyEmailDto,
  ResendCodeDto,
  AdminVerifyDto,
} from './dto';

export interface RegistrationResult {
  registrationId: string;
  email: string;
  name: string;
  message: string;
}

export interface EmailVerificationResult {
  verified: boolean;
  message: string;
}

export interface ResendCodeResult {
  message: string;
}

export interface EmailStatusResult {
  status: 'available' | 'exists' | 'needs_verification';
  message: string;
  email: string;
}

@Injectable()
export class RegistrationService {
  constructor(
    private readonly em: EntityManager,
    private readonly emailService: EmailService,
  ) {}

  async checkEmailStatus(email: string): Promise<EmailStatusResult> {
    const user = await this.em.findOne(User, { email });

    if (!user) {
      return {
        status: 'available',
        message: 'Email is available for registration',
        email,
      };
    }

    if (user.emailVerified) {
      return {
        status: 'exists',
        message: 'User with this email already exists and is verified',
        email,
      };
    }

    // User exists but email is not verified
    return {
      status: 'needs_verification',
      message:
        'User exists but email needs verification. Please check your email for verification code.',
      email,
    };
  }

  async startRegistration(
    dto: StartRegistrationDto,
  ): Promise<RegistrationResult> {
    // Check if user already exists
    const existingUser = await this.em.findOne(User, { email: dto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(dto.password, saltRounds);

    // Generate 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user with required fields
    const user = new User();
    user.email = dto.email;
    user.passwordHash = hashedPassword;
    user.isActive = false; // User is inactive until email is verified
    user.emailVerified = false;
    user.emailVerificationToken = verificationToken;
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = verificationExpires;

    // Save user first
    await this.em.persistAndFlush(user);

    // Create default role (ClinicAdmin for new registrations)
    const role = new UserRoleEntity();
    role.role = UserRole.CLINIC_ADMIN;
    role.user = user;
    role.userId = user.id;

    // Save role
    await this.em.persistAndFlush(role);

    // Create user profile with required fields after user is saved
    const profile = new UserProfile();
    profile.name = dto.name;
    profile.user = user;
    profile.userId = user.id;

    // Save profile
    await this.em.persistAndFlush(profile);

    // Send verification email
    this.emailService.sendVerificationEmail({
      email: dto.email,
      name: dto.name,
      code: verificationCode,
    });

    return {
      registrationId: user.id,
      email: user.email,
      name: profile.name,
      message:
        'Registration started successfully. Please check your email for verification code.',
    };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<EmailVerificationResult> {
    const user = await this.em.findOne(User, { email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      return {
        verified: true,
        message: 'Email is already verified',
      };
    }

    // In development mode, accept static code '123456' without expiration checks
    const isDevelopmentMode = process.env.NODE_ENV === 'development';
    if (isDevelopmentMode && dto.code === '123456') {
      // Skip all validation for development code - allows testing without real verification codes
    } else {
      // Normal validation for production codes
      if (!user.emailVerificationCode || !user.emailVerificationExpires) {
        throw new BadRequestException(
          'No verification code found. Please request a new verification code.',
        );
      }

      if (user.emailVerificationExpires < new Date()) {
        throw new BadRequestException(
          'Verification code has expired. Please request a new one.',
        );
      }

      if (user.emailVerificationCode !== dto.code) {
        throw new UnauthorizedException('Invalid verification code');
      }
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.isActive = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await this.em.persistAndFlush(user);

    return {
      verified: true,
      message:
        'Email verified successfully. You can now login to your account.',
    };
  }

  async resendVerificationCode(dto: ResendCodeDto): Promise<ResendCodeResult> {
    const user = await this.em.findOne(User, { email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Check if we can resend (prevent spam)
    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires > new Date()
    ) {
      const timeLeft = Math.ceil(
        (user.emailVerificationExpires.getTime() - Date.now()) / 1000 / 60,
      );
      if (timeLeft > 10) {
        // Don't allow resend if more than 10 minutes left
        throw new BadRequestException(
          `Please wait ${timeLeft} minutes before requesting a new code`,
        );
      }
    }

    // Generate new verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.emailVerificationToken = verificationToken;
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = verificationExpires;

    await this.em.persistAndFlush(user);

    // Send verification email
    this.emailService.sendVerificationEmail({
      email: dto.email,
      name: user.profile?.name || 'User',
      code: verificationCode,
    });

    return {
      message: 'Verification code sent successfully. Please check your email.',
    };
  }

  async adminVerifyEmail(
    dto: AdminVerifyDto,
  ): Promise<EmailVerificationResult> {
    const user = await this.em.findOne(User, { email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      return {
        verified: true,
        message: 'Email is already verified',
      };
    }

    // Mark email as verified by admin
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.isActive = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await this.em.persistAndFlush(user);

    return {
      verified: true,
      message: 'Email verified by admin successfully.',
    };
  }
}
