import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  LicenseType,
  TherapistStatus,
} from '../../database/entities/therapist.entity';

export class TherapistQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page (max 100)',
    example: 20,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 20;

  @ApiProperty({
    description: 'Search by therapist name, phone, or license number',
    example: 'Dr. Sarah',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @ApiProperty({
    description: 'Filter by therapist status',
    enum: TherapistStatus,
    example: TherapistStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(TherapistStatus, {
    message:
      'Status must be one of: active, inactive, on_leave, suspended, pending_setup',
  })
  status?: TherapistStatus;

  @ApiProperty({
    description: 'Filter by license type',
    enum: LicenseType,
    example: LicenseType.HYPNOTHERAPIST,
    required: false,
  })
  @IsOptional()
  @IsEnum(LicenseType, {
    message:
      'License type must be one of: psychologist, psychiatrist, counselor, hypnotherapist',
  })
  licenseType?: LicenseType;

  @ApiProperty({
    description: 'Filter by minimum years of experience',
    example: 3,
    minimum: 0,
    maximum: 50,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Min experience must be an integer' })
  @Min(0, { message: 'Min experience cannot be negative' })
  @Max(50, { message: 'Min experience cannot exceed 50' })
  minExperience?: number;

  @ApiProperty({
    description: 'Filter therapists with available capacity',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'Available capacity must be a boolean' })
  hasAvailableCapacity?: boolean;

  @ApiProperty({
    description: 'Sort field',
    enum: [
      'fullName',
      'joinDate',
      'yearsOfExperience',
      'currentLoad',
      'status',
    ],
    example: 'fullName',
    required: false,
  })
  @IsOptional()
  @IsEnum(
    ['fullName', 'joinDate', 'yearsOfExperience', 'currentLoad', 'status'],
    {
      message:
        'Sort by must be one of: fullName, joinDate, yearsOfExperience, currentLoad, status',
    },
  )
  sortBy?: string = 'fullName';

  @ApiProperty({
    description: 'Sort direction',
    enum: ['ASC', 'DESC'],
    example: 'ASC',
    required: false,
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], {
    message: 'Sort direction must be ASC or DESC',
  })
  sortDirection?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    description: 'Filter by clinic ID (system admin only)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Clinic ID must be a string' })
  clinicId?: string;
}
