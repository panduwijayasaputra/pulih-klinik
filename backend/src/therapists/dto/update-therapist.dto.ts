import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, MaxLength } from 'class-validator';
import { CreateTherapistDto } from './create-therapist.dto';
import { TherapistStatus } from '../../database/entities/therapist.entity';

// Omit userId since it cannot be updated
export class UpdateTherapistDto extends PartialType(
  OmitType(CreateTherapistDto, ['userId'] as const),
) {
  @ApiProperty({
    description: 'Therapist status',
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
    description: 'Current client load (updated automatically by system)',
    example: 8,
    required: false,
    readOnly: true,
  })
  @IsOptional()
  currentLoad?: number;
}

export class UpdateTherapistStatusDto {
  @ApiProperty({
    description: 'New status for the therapist',
    enum: TherapistStatus,
    example: TherapistStatus.ACTIVE,
  })
  @IsEnum(TherapistStatus, {
    message:
      'Status must be one of: active, inactive, on_leave, suspended, pending_setup',
  })
  status!: TherapistStatus;

  @ApiProperty({
    description: 'Reason for status change',
    example: 'Completed training and setup',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  @MaxLength(500, { message: 'Reason cannot exceed 500 characters' })
  reason?: string;
}

export class UpdateTherapistCapacityDto {
  @ApiProperty({
    description: 'Maximum number of clients',
    example: 20,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  maxClients?: number;

  @ApiProperty({
    description: 'Administrative notes about capacity change',
    example: 'Increased capacity due to experience growth',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(500, { message: 'Notes cannot exceed 500 characters' })
  notes?: string;
}
