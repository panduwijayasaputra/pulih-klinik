import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  IsDateString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { CreateClientDto } from './create-client.dto';
import { ClientStatus } from '../../database/entities/client.entity';

// Make all CreateClientDto fields optional for updates
export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiProperty({
    description: 'Client status',
    enum: ClientStatus,
    example: ClientStatus.ASSIGNED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ClientStatus, {
    message:
      'Status must be one of: new, assigned, consultation, therapy, done',
  })
  status?: ClientStatus;

  @ApiProperty({
    description: 'Last session date in ISO format',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Last session date must be a valid date string' },
  )
  lastSessionDate?: string;
}

export class UpdateClientStatusDto {
  @ApiProperty({
    description: 'New status for the client',
    enum: ClientStatus,
    example: ClientStatus.ASSIGNED,
  })
  @IsEnum(ClientStatus, {
    message:
      'Status must be one of: new, assigned, consultation, therapy, done',
  })
  status!: ClientStatus;

  @ApiProperty({
    description: 'Reason for status change',
    example: 'Client has been assigned to therapist Dr. Sarah',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  @MaxLength(500, { message: 'Reason cannot exceed 500 characters' })
  reason?: string;

  @ApiProperty({
    description: 'Additional notes about the status change',
    example: 'Client expressed preference for female therapist',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @ApiProperty({
    description: 'Previous therapist ID (for transfers)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Previous therapist ID must be a string' })
  previousTherapistId?: string;

  @ApiProperty({
    description: 'New therapist ID (for assignments)',
    example: '987fcdeb-51a2-43d7-b654-746251849001',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'New therapist ID must be a string' })
  newTherapistId?: string;
}

export class UpdateClientProgressDto {
  @ApiProperty({
    description: 'Progress percentage (0-100)',
    example: 75,
    minimum: 0,
    maximum: 100,
  })
  @IsInt({ message: 'Progress must be an integer' })
  @Min(0, { message: 'Progress cannot be negative' })
  @Max(100, { message: 'Progress cannot exceed 100' })
  progress!: number;

  @ApiProperty({
    description: 'Notes about the progress update',
    example: 'Client showing significant improvement in anxiety management',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @ApiProperty({
    description: 'Total sessions completed',
    example: 8,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Total sessions must be an integer' })
  @Min(0, { message: 'Total sessions cannot be negative' })
  totalSessions?: number;

  @ApiProperty({
    description: 'Last session date in ISO format',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Last session date must be a valid date string' },
  )
  lastSessionDate?: string;
}
