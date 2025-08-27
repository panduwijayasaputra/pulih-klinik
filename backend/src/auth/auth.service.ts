import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/core';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../database/entities/user.entity';
import { JwtPayload } from './jwt.strategy';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
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
  };
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.em.findOne(
      User,
      { email, isActive: true },
      { populate: ['roles', 'clinic', 'profile'] },
    );

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((role) => ({
        id: role.id,
        role: role.role,
      })),
      clinicId: user.clinic?.id,
      clinicName: user.clinic?.name,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Update last login timestamp
    await this.updateLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.name || 'Unknown User',
        isActive: user.isActive,
        roles: user.roles.map((role) => ({
          id: role.id,
          role: role.role,
        })),
        clinicId: user.clinic?.id,
        clinicName: user.clinic?.name,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<RefreshResult> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Verify user still exists and is active
      const user = await this.em.findOne(
        User,
        { id: payload.sub, isActive: true },
        { populate: ['roles', 'clinic'] },
      );

      if (!user) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        roles: user.roles.map((role) => ({
          id: role.id,
          role: role.role,
        })),
        clinicId: user.clinic?.id,
        clinicName: user.clinic?.name,
      };

      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcryptjs.hash(password, saltRounds);
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcryptjs.compare(password, hashedPassword);
  }

  async getUserWithRoles(userId: string): Promise<User | null> {
    return this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['roles', 'clinic'] },
    );
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.em.nativeUpdate(User, { id: userId }, { lastLogin: new Date() });
  }

  /**
   * Generate a secure password reset token
   */
  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Send password reset email (token generation)
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.em.findOne(User, { email, isActive: true });

    // Don't reveal whether user exists or not for security
    if (!user) {
      return {
        message:
          'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // Generate reset token and set expiry (15 minutes)
    const resetToken = this.generateResetToken();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token to database
    await this.em.nativeUpdate(
      User,
      { id: user.id },
      {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    );

    // In a real application, you would send an email here
    // For now, we'll just return the token (remove this in production!)
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link would be: /reset-password?token=${resetToken}`);

    return {
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };
  }

  /**
   * Verify if a password reset token is valid
   */
  async verifyResetToken(
    token: string,
  ): Promise<{ valid: boolean; email?: string }> {
    const user = await this.em.findOne(User, {
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
      isActive: true,
    });

    if (!user) {
      return { valid: false };
    }

    return { valid: true, email: user.email };
  }

  /**
   * Reset password using token
   */
  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ message: string }> {
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Find user with valid reset token
    const user = await this.em.findOne(User, {
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
      isActive: true,
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash the new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update user password and clear reset token
    await this.em.nativeUpdate(
      User,
      { id: user.id },
      {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    );

    return {
      message:
        'Password has been reset successfully. You can now log in with your new password.',
    };
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ message: string }> {
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    // Find user
    const user = await this.em.findOne(User, { id: userId, isActive: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcryptjs.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check if new password is different from current
    const isSamePassword = await bcryptjs.compare(
      newPassword,
      user.passwordHash,
    );
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // Hash the new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update user password
    await this.em.nativeUpdate(
      User,
      { id: userId },
      { passwordHash: hashedPassword },
    );

    return {
      message: 'Password has been changed successfully.',
    };
  }
}
