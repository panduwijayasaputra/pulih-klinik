import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, Length, IsArray } from 'class-validator';
import { CreateSessionDto } from './create-session.dto';
import { SessionStatus } from '../../database/entities/therapy-session.entity';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  @ApiPropertyOptional({
    description: 'Updated session status',
    enum: SessionStatus,
  })
  @IsOptional()
  @IsEnum(SessionStatus, { message: 'Status must be a valid session status' })
  status?: SessionStatus;

  @ApiPropertyOptional({
    description: 'Post-session summary',
    example:
      'Client made significant breakthrough in understanding anxiety triggers',
  })
  @IsOptional()
  @IsString({ message: 'Session summary must be a string' })
  @Length(0, 2000, { message: 'Session summary cannot exceed 2000 characters' })
  sessionSummary?: string;

  @ApiPropertyOptional({
    description: 'Homework or tasks assigned to client',
    example: ['Daily meditation for 10 minutes', 'Journaling before sleep'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Homework assignments must be an array' })
  @IsString({
    each: true,
    message: 'Each homework assignment must be a string',
  })
  homeworkAssignments?: string[];

  @ApiPropertyOptional({
    description: 'Therapist observations and clinical notes',
    example:
      'Client appeared more relaxed and engaged compared to previous session',
  })
  @IsOptional()
  @IsString({ message: 'Therapist observations must be a string' })
  @Length(0, 2000, {
    message: 'Therapist observations cannot exceed 2000 characters',
  })
  therapistObservations?: string;

  @ApiPropertyOptional({
    description: 'Updated AI predictions based on session outcomes',
  })
  @IsOptional()
  aiPredictions?: Record<string, any>;
}

export class SessionStatusUpdateDto {
  @ApiPropertyOptional({
    description: 'New session status',
    enum: SessionStatus,
  })
  @IsEnum(SessionStatus, { message: 'Status must be a valid session status' })
  status!: SessionStatus;

  @ApiPropertyOptional({
    description: 'Reason for status change',
    example: 'Session completed successfully',
  })
  @IsOptional()
  @IsString({ message: 'Status change reason must be a string' })
  @Length(0, 500, {
    message: 'Status change reason cannot exceed 500 characters',
  })
  reason?: string;
}
