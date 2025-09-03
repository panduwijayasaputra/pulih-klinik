import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export enum PaymentMethodEnum {
  CreditCard = 'credit_card',
  BankTransfer = 'bank_transfer',
  EWallet = 'e_wallet',
  VirtualAccount = 'virtual_account',
}

export class PaymentOnboardingDto {
  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethodEnum,
    example: PaymentMethodEnum.CreditCard,
  })
  @IsEnum(PaymentMethodEnum)
  @IsNotEmpty()
  paymentMethod!: PaymentMethodEnum;

  @ApiProperty({
    description: 'Payment amount',
    example: 100000,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'IDR',
    default: 'IDR',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    description: 'External transaction ID from payment provider',
    example: 'TXN_123456789',
  })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Payment ID from payment provider',
    example: 'PAY_987654321',
  })
  @IsString()
  @IsOptional()
  paymentId?: string;
}