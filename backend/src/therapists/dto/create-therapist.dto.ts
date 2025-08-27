import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
  IsInt,
  IsArray,
  IsUrl,
  IsDateString,
  Min,
  Max,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  IsIn,
} from 'class-validator';
import {
  LicenseType,
  EmploymentType,
} from '../../database/entities/therapist.entity';

export class CreateTherapistDto {
  @ApiProperty({
    description: 'User ID to associate with this therapist profile',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'User ID must be a string' })
  userId!: string;

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
    description: 'Years of professional experience',
    example: 5,
    minimum: 0,
    maximum: 50,
  })
  @IsInt({ message: 'Years of experience must be an integer' })
  @Min(0, { message: 'Years of experience cannot be negative' })
  @Max(50, { message: 'Years of experience cannot exceed 50' })
  yearsOfExperience!: number;

  @ApiProperty({
    description: 'Employment type',
    enum: EmploymentType,
    example: EmploymentType.FULL_TIME,
  })
  @IsEnum(EmploymentType, {
    message:
      'Employment type must be one of: full_time, part_time, contract, freelance',
  })
  employmentType!: EmploymentType;

  @ApiProperty({
    description: 'Date when the therapist joined the clinic',
    example: '2023-01-15',
  })
  @IsDateString({}, { message: 'Join date must be a valid date string' })
  joinDate!: string;

  @ApiProperty({
    description: 'Maximum number of clients the therapist can handle',
    example: 15,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @IsInt({ message: 'Max clients must be an integer' })
  @Min(1, { message: 'Max clients must be at least 1' })
  @Max(50, { message: 'Max clients cannot exceed 50' })
  maxClients?: number;

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
    description: 'Session duration in minutes',
    example: 60,
    minimum: 30,
    maximum: 180,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Session duration must be an integer' })
  @Min(30, { message: 'Session duration must be at least 30 minutes' })
  @Max(180, { message: 'Session duration cannot exceed 180 minutes' })
  sessionDuration?: number;

  @ApiProperty({
    description: 'Break between sessions in minutes',
    example: 15,
    minimum: 5,
    maximum: 60,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Break between sessions must be an integer' })
  @Min(5, { message: 'Break must be at least 5 minutes' })
  @Max(60, { message: 'Break cannot exceed 60 minutes' })
  breakBetweenSessions?: number;

  @ApiProperty({
    description: 'Maximum sessions per day',
    example: 8,
    minimum: 1,
    maximum: 12,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Max sessions per day must be an integer' })
  @Min(1, { message: 'Must have at least 1 session per day' })
  @Max(12, { message: 'Cannot exceed 12 sessions per day' })
  maxSessionsPerDay?: number;

  @ApiProperty({
    description: 'Working days (1=Monday to 7=Sunday)',
    example: [1, 2, 3, 4, 5],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Working days must be an array' })
  @ArrayMinSize(1, { message: 'Must have at least 1 working day' })
  @ArrayMaxSize(7, { message: 'Cannot have more than 7 working days' })
  @IsInt({ each: true, message: 'Each working day must be an integer' })
  @Min(1, { each: true, message: 'Working day must be between 1 and 7' })
  @Max(7, { each: true, message: 'Working day must be between 1 and 7' })
  workingDays?: number[];

  @ApiProperty({
    description: 'Administrative notes about the therapist',
    example: 'Specializes in anxiety and stress management',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Admin notes must be a string' })
  @MaxLength(1000, { message: 'Admin notes cannot exceed 1000 characters' })
  adminNotes?: string;

  @ApiProperty({
    description: 'Array of specialization areas',
    example: ['anxiety', 'depression', 'trauma'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Specializations must be an array' })
  @IsString({ each: true, message: 'Each specialization must be a string' })
  @MaxLength(100, {
    each: true,
    message: 'Each specialization cannot exceed 100 characters',
  })
  specializations?: string[];
}
