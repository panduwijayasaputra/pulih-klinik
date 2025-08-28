import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class StartRegistrationDto {
  @ApiProperty({
    description: 'Admin user full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name!: string;

  @ApiProperty({
    description: 'Email address for the registration',
    example: 'admin@clinic.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email!: string;

  @ApiProperty({
    description: 'Password for the admin account',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(255, { message: 'Password cannot exceed 255 characters' })
  password!: string;

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
