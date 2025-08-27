import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class StartRegistrationDto {
  @ApiProperty({
    description: 'Email address for the registration',
    example: 'admin@clinic.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email!: string;

  @ApiProperty({
    description: 'Source of registration (optional)',
    example: 'website',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;

  @ApiProperty({
    description: 'Referrer information (optional)',
    example: 'google_ads',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  referrer?: string;
}
