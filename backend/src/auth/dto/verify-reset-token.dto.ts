import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetTokenDto {
  @ApiProperty({
    description: 'Password reset token to verify',
    example: 'abc123def456ghi789',
  })
  @IsString({ message: 'Reset token must be a string' })
  @IsNotEmpty({ message: 'Reset token is required' })
  token!: string;
}
