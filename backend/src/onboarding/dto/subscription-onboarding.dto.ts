import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export enum SubscriptionTierEnum {
  Beta = 'beta',
  Alpha = 'alpha',
  Theta = 'theta',
}

export enum BillingCycleEnum {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export class SubscriptionOnboardingDto {
  @ApiProperty({
    description: 'Subscription tier code',
    enum: SubscriptionTierEnum,
    example: SubscriptionTierEnum.Alpha,
  })
  @IsEnum(SubscriptionTierEnum)
  @IsNotEmpty()
  tierCode!: SubscriptionTierEnum;

  @ApiProperty({
    description: 'Billing cycle',
    enum: BillingCycleEnum,
    example: BillingCycleEnum.Monthly,
  })
  @IsEnum(BillingCycleEnum)
  @IsNotEmpty()
  billingCycle!: BillingCycleEnum;

  @ApiProperty({
    description: 'Subscription amount',
    example: 100000,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'IDR',
    default: 'IDR',
  })
  @IsString()
  @IsOptional()
  currency?: string;
}