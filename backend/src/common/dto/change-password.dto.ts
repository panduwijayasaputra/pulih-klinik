import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'OldPassword123!',
  })
  @IsString({ message: 'Current password must be a string' })
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword!: string;

  @ApiProperty({
    description:
      'New password (minimum 8 characters, must contain uppercase, lowercase, number, and special character)',
    example: 'NewPassword123!',
    minLength: 8,
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword!: string;

  @ApiProperty({
    description: 'Confirm new password (must match newPassword)',
    example: 'NewPassword123!',
  })
  @IsString({ message: 'Password confirmation must be a string' })
  @IsNotEmpty({ message: 'Password confirmation is required' })
  confirmPassword!: string;
}
