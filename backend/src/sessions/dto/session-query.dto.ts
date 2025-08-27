import {
  IsOptional,
  IsUUID,
  IsString,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
  Max,
  IsArray,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SessionStatus } from '../../database/entities/therapy-session.entity';

export class SessionQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Search term for session title or notes',
    example: 'anxiety',
  })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Client ID must be a valid UUID' })
  clientId?: string;

  @ApiPropertyOptional({
    description: 'Filter by therapist ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Therapist ID must be a valid UUID' })
  therapistId?: string;

  @ApiPropertyOptional({
    description: 'Filter by session status',
    enum: SessionStatus,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((s) => s.trim());
    }
    return value;
  })
  @IsArray({ message: 'Status must be an array' })
  @IsEnum(SessionStatus, {
    each: true,
    message: 'Each status must be a valid session status',
  })
  status?: SessionStatus[];

  @ApiPropertyOptional({
    description: 'Filter sessions from date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'From date must be a valid date string (YYYY-MM-DD)' },
  )
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter sessions to date (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'To date must be a valid date string (YYYY-MM-DD)' },
  )
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Filter by session number range (minimum)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Session number from must be an integer' })
  @Min(1, { message: 'Session number from must be at least 1' })
  sessionNumberFrom?: number;

  @ApiPropertyOptional({
    description: 'Filter by session number range (maximum)',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Session number to must be an integer' })
  @Min(1, { message: 'Session number to must be at least 1' })
  sessionNumberTo?: number;

  @ApiPropertyOptional({
    description: 'Filter by techniques used',
    example: ['CBT', 'Mindfulness'],
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((t) => t.trim());
    }
    return value;
  })
  @IsArray({ message: 'Techniques must be an array' })
  @IsString({ each: true, message: 'Each technique must be a string' })
  techniques?: string[];

  @ApiPropertyOptional({
    description: 'Filter by issues addressed',
    example: ['anxiety', 'depression'],
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((i) => i.trim());
    }
    return value;
  })
  @IsArray({ message: 'Issues must be an array' })
  @IsString({ each: true, message: 'Each issue must be a string' })
  issues?: string[];

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'sessionDate',
    enum: ['sessionDate', 'sessionNumber', 'title', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsIn(['sessionDate', 'sessionNumber', 'title', 'createdAt', 'updatedAt'], {
    message:
      'Sort by must be one of: sessionDate, sessionNumber, title, createdAt, updatedAt',
  })
  sortBy?: string = 'sessionDate';

  @ApiPropertyOptional({
    description: 'Sort direction',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Sort order must be asc or desc' })
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Include AI predictions in response',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includePredictions?: boolean = false;

  @ApiPropertyOptional({
    description: 'Include session statistics',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeStats?: boolean = false;
}

export class SessionStatsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter statistics by therapist ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Therapist ID must be a valid UUID' })
  therapistId?: string;

  @ApiPropertyOptional({
    description: 'Filter statistics by client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Client ID must be a valid UUID' })
  clientId?: string;

  @ApiPropertyOptional({
    description: 'Statistics from date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'From date must be a valid date string (YYYY-MM-DD)' },
  )
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Statistics to date (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'To date must be a valid date string (YYYY-MM-DD)' },
  )
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Group statistics by period',
    example: 'month',
    enum: ['day', 'week', 'month', 'year'],
  })
  @IsOptional()
  @IsIn(['day', 'week', 'month', 'year'], {
    message: 'Group by must be one of: day, week, month, year',
  })
  groupBy?: 'day' | 'week' | 'month' | 'year' = 'month';
}
