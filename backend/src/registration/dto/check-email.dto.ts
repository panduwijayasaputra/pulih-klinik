import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CheckEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address to check',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
