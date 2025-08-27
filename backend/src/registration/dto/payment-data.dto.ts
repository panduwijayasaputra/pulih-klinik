import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export enum SubscriptionTier {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  E_WALLET = 'e_wallet',
  CRYPTO = 'crypto',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class PaymentDataDto {
  @ApiProperty({
    description: 'Subscription tier',
    enum: SubscriptionTier,
    example: SubscriptionTier.BASIC,
  })
  @IsEnum(SubscriptionTier, {
    message: 'Subscription tier must be basic, premium, or enterprise',
  })
  subscriptionTier!: SubscriptionTier;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.BANK_TRANSFER,
  })
  @IsEnum(PaymentMethod, {
    message:
      'Payment method must be bank_transfer, credit_card, e_wallet, or crypto',
  })
  paymentMethod!: PaymentMethod;

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
    description: 'Payment amount in IDR',
    example: 100000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0, { message: 'Amount cannot be negative' })
  amount!: number;

  @ApiProperty({
    description: 'Payment gateway transaction ID',
    example: 'trx_12345678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Payment ID must be a string' })
  paymentId?: string;

  @ApiProperty({
    description: 'Subscription ID from payment gateway',
    example: 'sub_12345678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Subscription ID must be a string' })
  subscriptionId?: string;
}
