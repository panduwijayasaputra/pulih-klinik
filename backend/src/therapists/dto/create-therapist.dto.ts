import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
  IsUrl,
  IsDateString,
  IsEmail,
  MinLength,
  MaxLength,
  IsIn,
} from 'class-validator';
import { LicenseType } from '../../database/entities/therapist.entity';

export class CreateTherapistDto {
  @ApiProperty({
    description: 'Email address for the therapist account',
    example: 'therapist@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @ApiProperty({
    description: 'Full name of the therapist',
    example: 'Dr. Sarah Wijaya',
    minLength: 2,
    maxLength: 255,
  })
  @IsString({ message: 'Full name must be a string' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Full name cannot exceed 255 characters' })
  fullName!: string;

  @ApiProperty({
    description: 'Indonesian phone number',
    example: '+628123456789',
  })
  @IsPhoneNumber('ID', {
    message: 'Please provide a valid Indonesian phone number',
  })
  phone!: string;

  @ApiProperty({
    description: 'Avatar image URL',
    example: 'https://example.com/avatars/sarah.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  @MaxLength(500, { message: 'Avatar URL cannot exceed 500 characters' })
  avatarUrl?: string;

  @ApiProperty({
    description: 'Professional license number',
    example: 'PSI-12345678',
    minLength: 5,
    maxLength: 100,
  })
  @IsString({ message: 'License number must be a string' })
  @MinLength(5, {
    message: 'License number must be at least 5 characters long',
  })
  @MaxLength(100, { message: 'License number cannot exceed 100 characters' })
  licenseNumber!: string;

  @ApiProperty({
    description: 'Type of professional license',
    enum: LicenseType,
    example: LicenseType.HYPNOTHERAPIST,
  })
  @IsEnum(LicenseType, {
    message:
      'License type must be one of: psychologist, psychiatrist, counselor, hypnotherapist',
  })
  licenseType!: LicenseType;

  @ApiProperty({
    description: 'Date when the therapist joined the clinic',
    example: '2023-01-15',
  })
  @IsDateString({}, { message: 'Join date must be a valid date string' })
  joinDate!: string;

  @ApiProperty({
    description: 'Timezone for scheduling',
    example: 'Asia/Jakarta',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Timezone must be a string' })
  @IsIn(['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura', 'Asia/Pontianak'], {
    message: 'Timezone must be a supported Indonesian timezone',
  })
  timezone?: string;

  @ApiProperty({
    description: 'Education background',
    example: 'S1 Psikologi, Universitas Indonesia (2015)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Education must be a string' })
  @MaxLength(1000, { message: 'Education cannot exceed 1000 characters' })
  education?: string;

  @ApiProperty({
    description: 'Professional certifications',
    example:
      'Certified Hypnotherapist - Indonesian Hypnotherapy Association (2020)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Certifications must be a string' })
  @MaxLength(1000, { message: 'Certifications cannot exceed 1000 characters' })
  certifications?: string;

  @ApiProperty({
    description: 'Administrative notes about the therapist',
    example: 'Specializes in anxiety and stress management',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Admin notes must be a string' })
  @MaxLength(1000, { message: 'Admin notes cannot exceed 1000 characters' })
  adminNotes?: string;
}
