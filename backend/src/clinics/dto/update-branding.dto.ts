import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsUrl,
  Matches,
  IsIn,
} from 'class-validator';

const COMMON_FONT_FAMILIES = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Nunito',
  'PT Sans',
  'Ubuntu',
  'Raleway',
  'Work Sans',
  'Playfair Display',
  'Merriweather',
  'Georgia',
  'Times New Roman',
  'Arial',
  'Helvetica',
] as const;

export class UpdateBrandingDto {
  @ApiProperty({
    description: 'Clinic logo URL',
    example: 'https://example.com/logos/clinic-logo.png',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'] },
    { message: 'Logo URL must be a valid URL' },
  )
  @MaxLength(500, { message: 'Logo URL must not exceed 500 characters' })
  logoUrl?: string;

  @ApiProperty({
    description: 'Primary brand color in hex format',
    example: '#3B82F6',
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  @IsString({ message: 'Primary color must be a string' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Primary color must be a valid hex color (e.g., #3B82F6)',
  })
  primaryColor!: string;

  @ApiProperty({
    description: 'Secondary brand color in hex format',
    example: '#1F2937',
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  @IsString({ message: 'Secondary color must be a string' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Secondary color must be a valid hex color (e.g., #1F2937)',
  })
  secondaryColor!: string;

  @ApiProperty({
    description: 'Font family for clinic branding',
    example: 'Inter',
    enum: COMMON_FONT_FAMILIES,
  })
  @IsString({ message: 'Font family must be a string' })
  @IsIn(COMMON_FONT_FAMILIES, {
    message: `Font family must be one of: ${COMMON_FONT_FAMILIES.join(', ')}`,
  })
  @MaxLength(100, { message: 'Font family must not exceed 100 characters' })
  fontFamily!: string;
}
