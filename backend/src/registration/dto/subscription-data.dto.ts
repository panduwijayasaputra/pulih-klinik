import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, Min } from 'class-validator';

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class SubscriptionDataDto {
  @ApiProperty({
    description: 'Subscription tier code',
    example: 'alpha',
    enum: ['beta', 'alpha', 'theta'],
  })
  @IsString({ message: 'Tier code must be a string' })
  tierCode!: string;

  @ApiProperty({
    description: 'Billing cycle',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @IsEnum(BillingCycle, {
    message: 'Billing cycle must be monthly or yearly',
  })
  billingCycle!: BillingCycle;

  @ApiProperty({
    description: 'Subscription amount in IDR',
    example: 100000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0, { message: 'Amount cannot be negative' })
  amount!: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'IDR',
    default: 'IDR',
  })
  @IsString({ message: 'Currency must be a string' })
  currency: string = 'IDR';
}
