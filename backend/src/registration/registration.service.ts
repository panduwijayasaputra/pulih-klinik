import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcryptjs from 'bcryptjs';
import { User } from '../database/entities/user.entity';
import { UserProfile } from '../database/entities/user-profile.entity';
import { UserRole as UserRoleEntity } from '../database/entities/user-role.entity';
import { UserRole } from '../common/enums/user-roles.enum';
import { StartRegistrationDto } from './dto';

export interface RegistrationResult {
  registrationId: string;
  email: string;
  name: string;
  message: string;
}

@Injectable()
export class RegistrationService {
  constructor(private readonly em: EntityManager) {}

  async startRegistration(dto: StartRegistrationDto): Promise<RegistrationResult> {
    // Check if user already exists
    const existingUser = await this.em.findOne(User, { email: dto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(dto.password, saltRounds);

    // Create user with required fields
    const user = new User();
    user.email = dto.email;
    user.passwordHash = hashedPassword;
    user.isActive = true;

    // Create user profile with required fields
    const profile = new UserProfile();
    profile.name = dto.name;
    profile.user = user;

    // Create default role (ClinicAdmin for new registrations)
    const role = new UserRoleEntity();
    role.role = UserRole.CLINIC_ADMIN;
    role.user = user;

    // Save everything in transaction
    await this.em.transactional(async (em) => {
      await em.persist([user, profile, role]);
    });

    return {
      registrationId: user.id,
      email: user.email,
      name: profile.name,
      message: 'Registration started successfully. Please proceed to setup your clinic.',
    };
  }
}