import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsPhoneNumber,
  IsUrl,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Dr. John Doe',
    maxLength: 255,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name!: string;

  @ApiProperty({
    description: 'Phone number in Indonesian format',
    example: '+628123456789',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsPhoneNumber('ID', {
    message: 'Please provide a valid Indonesian phone number',
  })
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  phone?: string;

  @ApiProperty({
    description: 'Complete address of the user',
    example: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @MaxLength(1000, { message: 'Address must not exceed 1000 characters' })
  address?: string;

  @ApiProperty({
    description: 'Professional bio or description',
    example:
      'Licensed clinical psychologist with 10+ years of experience in cognitive behavioral therapy and trauma counseling.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @MaxLength(2000, { message: 'Bio must not exceed 2000 characters' })
  bio?: string;

  @ApiProperty({
    description: 'URL to user avatar image',
    example: 'https://example.com/avatars/user123.jpg',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'] },
    { message: 'Avatar URL must be a valid URL' },
  )
  @MaxLength(500, { message: 'Avatar URL must not exceed 500 characters' })
  avatarUrl?: string;
}
