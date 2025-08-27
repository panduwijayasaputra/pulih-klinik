import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CompleteRegistrationDto {
  @ApiProperty({
    description: 'Subscription ID from successful payment',
    example: 'sub_12345678',
  })
  @IsString({ message: 'Subscription ID must be a string' })
  subscriptionId!: string;

  @ApiProperty({
    description: 'Payment confirmation ID',
    example: 'pay_confirm_12345678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Payment confirmation ID must be a string' })
  paymentConfirmationId?: string;
}
