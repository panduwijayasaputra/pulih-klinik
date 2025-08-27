import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
  Matches,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionStatus } from '../../database/entities/therapy-session.entity';

export class CreateSessionDto {
  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'Client ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Client ID is required' })
  clientId!: string;

  @ApiProperty({
    description: 'Therapist ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID(4, { message: 'Therapist ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Therapist ID is required' })
  therapistId!: string;

  @ApiProperty({
    description: 'Session number in the treatment plan',
    example: 1,
    minimum: 1,
    maximum: 50,
  })
  @IsInt({ message: 'Session number must be an integer' })
  @Min(1, { message: 'Session number must be at least 1' })
  @Max(50, { message: 'Session number cannot exceed 50' })
  sessionNumber!: number;

  @ApiProperty({
    description: 'Session title',
    example: 'Initial Assessment and Goal Setting',
    maxLength: 255,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Length(3, 255, { message: 'Title must be between 3 and 255 characters' })
  title!: string;

  @ApiPropertyOptional({
    description: 'Session description',
    example:
      'Comprehensive assessment of client needs and establishment of therapeutic goals',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(0, 1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @ApiProperty({
    description: 'Session date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @IsDateString(
    {},
    { message: 'Session date must be a valid date string (YYYY-MM-DD)' },
  )
  sessionDate!: string;

  @ApiProperty({
    description: 'Session time (HH:mm format)',
    example: '14:30',
  })
  @IsString({ message: 'Session time must be a string' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Session time must be in HH:mm format (24-hour)',
  })
  sessionTime!: string;

  @ApiPropertyOptional({
    description: 'Session duration in minutes',
    example: 60,
    default: 60,
    minimum: 15,
    maximum: 300,
  })
  @IsOptional()
  @IsInt({ message: 'Duration must be an integer' })
  @Min(15, { message: 'Session duration must be at least 15 minutes' })
  @Max(300, { message: 'Session duration cannot exceed 300 minutes (5 hours)' })
  duration?: number = 60;

  @ApiPropertyOptional({
    description: 'Session status',
    enum: SessionStatus,
    default: SessionStatus.PLANNED,
  })
  @IsOptional()
  @IsEnum(SessionStatus, { message: 'Status must be a valid session status' })
  status?: SessionStatus = SessionStatus.PLANNED;

  @ApiPropertyOptional({
    description: 'Session notes',
    example: 'Client expressed anxiety about upcoming changes in life',
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @Length(0, 2000, { message: 'Notes cannot exceed 2000 characters' })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Therapeutic techniques to be used',
    example: ['Cognitive Behavioral Therapy', 'Progressive Muscle Relaxation'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Techniques must be an array' })
  @IsString({ each: true, message: 'Each technique must be a string' })
  @ArrayMinSize(0, { message: 'Techniques array cannot be empty if provided' })
  techniques?: string[];

  @ApiPropertyOptional({
    description: 'Issues to address in the session',
    example: ['Anxiety management', 'Sleep disorders', 'Relationship concerns'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Issues must be an array' })
  @IsString({ each: true, message: 'Each issue must be a string' })
  @ArrayMinSize(0, { message: 'Issues array cannot be empty if provided' })
  issues?: string[];

  @ApiPropertyOptional({
    description: 'Progress notes and observations',
    example: 'Client shows improvement in stress management techniques',
  })
  @IsOptional()
  @IsString({ message: 'Progress must be a string' })
  @Length(0, 2000, { message: 'Progress notes cannot exceed 2000 characters' })
  progress?: string;
}

export class AiPredictionDto {
  @ApiProperty({
    description: 'Predicted session outcome',
    example: 'positive',
    enum: ['positive', 'neutral', 'concerning'],
  })
  @IsEnum(['positive', 'neutral', 'concerning'], {
    message: 'Outcome must be one of: positive, neutral, concerning',
  })
  predictedOutcome!: string;

  @ApiProperty({
    description: 'Confidence score for the prediction',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  @IsInt({ message: 'Confidence score must be a number' })
  @Min(0, { message: 'Confidence score must be at least 0' })
  @Max(1, { message: 'Confidence score cannot exceed 1' })
  confidenceScore!: number;

  @ApiPropertyOptional({
    description: 'Recommended techniques based on AI analysis',
    example: ['Mindfulness', 'Breathing exercises'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Recommended techniques must be an array' })
  @IsString({ each: true, message: 'Each technique must be a string' })
  recommendedTechniques?: string[];

  @ApiPropertyOptional({
    description: 'Risk factors identified by AI',
    example: ['High stress levels', 'Sleep deprivation'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Risk factors must be an array' })
  @IsString({ each: true, message: 'Each risk factor must be a string' })
  riskFactors?: string[];

  @ApiPropertyOptional({
    description: 'Additional AI-generated insights',
    example: 'Client may benefit from extended relaxation techniques',
  })
  @IsOptional()
  @IsString({ message: 'Insights must be a string' })
  @Length(0, 1000, { message: 'Insights cannot exceed 1000 characters' })
  insights?: string;
}

export class CreateSessionWithPredictionDto extends CreateSessionDto {
  @ApiPropertyOptional({
    description: 'AI predictions for the session',
    type: AiPredictionDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AiPredictionDto)
  aiPredictions?: AiPredictionDto;
}
