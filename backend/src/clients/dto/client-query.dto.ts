import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Gender,
  Religion,
  Education,
  MaritalStatus,
  ClientStatus,
} from '../../database/entities/client.entity';

export class ClientQueryDto {
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
    description: 'Search by client name, phone, or email',
    example: 'Sari Wulandari',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @ApiProperty({
    description: 'Filter by client status',
    enum: ClientStatus,
    example: ClientStatus.NEW,
    required: false,
  })
  @IsOptional()
  @IsEnum(ClientStatus, {
    message:
      'Status must be one of: new, assigned, consultation, therapy, done',
  })
  status?: ClientStatus;

  @ApiProperty({
    description: 'Filter by gender',
    enum: Gender,
    example: Gender.FEMALE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be Male or Female' })
  gender?: Gender;

  @ApiProperty({
    description: 'Filter by religion',
    enum: Religion,
    example: Religion.ISLAM,
    required: false,
  })
  @IsOptional()
  @IsEnum(Religion, {
    message:
      'Religion must be one of: Islam, Christianity, Catholicism, Hinduism, Buddhism, Konghucu, Other',
  })
  religion?: Religion;

  @ApiProperty({
    description: 'Filter by education level',
    enum: Education,
    example: Education.BACHELOR,
    required: false,
  })
  @IsOptional()
  @IsEnum(Education, {
    message:
      'Education must be one of: Elementary, Middle, High School, Associate, Bachelor, Master, Doctorate',
  })
  education?: Education;

  @ApiProperty({
    description: 'Filter by marital status',
    enum: MaritalStatus,
    example: MaritalStatus.SINGLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(MaritalStatus, {
    message: 'Marital status must be one of: Single, Married, Widowed',
  })
  maritalStatus?: MaritalStatus;

  @ApiProperty({
    description: 'Filter by age range - minimum age',
    example: 18,
    minimum: 0,
    maximum: 150,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Min age must be an integer' })
  @Min(0, { message: 'Min age cannot be negative' })
  @Max(150, { message: 'Min age cannot exceed 150' })
  minAge?: number;

  @ApiProperty({
    description: 'Filter by age range - maximum age',
    example: 65,
    minimum: 0,
    maximum: 150,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Max age must be an integer' })
  @Min(0, { message: 'Max age cannot be negative' })
  @Max(150, { message: 'Max age cannot exceed 150' })
  maxAge?: number;

  @ApiProperty({
    description: 'Filter by minor status',
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Is minor must be a boolean' })
  isMinor?: boolean;

  @ApiProperty({
    description: 'Filter by first visit status',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'First visit must be a boolean' })
  firstVisit?: boolean;

  @ApiProperty({
    description: 'Filter by progress range - minimum progress',
    example: 0,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Min progress must be an integer' })
  @Min(0, { message: 'Min progress cannot be negative' })
  @Max(100, { message: 'Min progress cannot exceed 100' })
  minProgress?: number;

  @ApiProperty({
    description: 'Filter by progress range - maximum progress',
    example: 50,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Max progress must be an integer' })
  @Min(0, { message: 'Max progress cannot be negative' })
  @Max(100, { message: 'Max progress cannot exceed 100' })
  maxProgress?: number;

  @ApiProperty({
    description: 'Filter by minimum total sessions',
    example: 3,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Min sessions must be an integer' })
  @Min(0, { message: 'Min sessions cannot be negative' })
  minSessions?: number;

  @ApiProperty({
    description: 'Filter by join date from (ISO format)',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Join date from must be a valid date string' })
  joinDateFrom?: string;

  @ApiProperty({
    description: 'Filter by join date to (ISO format)',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Join date to must be a valid date string' })
  joinDateTo?: string;

  @ApiProperty({
    description: 'Filter by last session date from (ISO format)',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Last session date from must be a valid date string' },
  )
  lastSessionDateFrom?: string;

  @ApiProperty({
    description: 'Filter by last session date to (ISO format)',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Last session date to must be a valid date string' },
  )
  lastSessionDateTo?: string;

  @ApiProperty({
    description: 'Filter by assigned therapist ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Therapist ID must be a string' })
  therapistId?: string;

  @ApiProperty({
    description: 'Filter clients who have emergency contacts',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Has emergency contact must be a boolean' })
  hasEmergencyContact?: boolean;

  @ApiProperty({
    description: 'Sort field',
    enum: [
      'fullName',
      'joinDate',
      'lastSessionDate',
      'birthDate',
      'status',
      'progress',
      'totalSessions',
    ],
    example: 'fullName',
    required: false,
  })
  @IsOptional()
  @IsEnum(
    [
      'fullName',
      'joinDate',
      'lastSessionDate',
      'birthDate',
      'status',
      'progress',
      'totalSessions',
    ],
    {
      message:
        'Sort by must be one of: fullName, joinDate, lastSessionDate, birthDate, status, progress, totalSessions',
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
