import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  E_WALLET = 'e_wallet',
  CRYPTO = 'crypto',
}

export class PaymentDataDto {
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
    description: 'Payment amount in IDR',
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

  @ApiProperty({
    description: 'Payment gateway transaction ID',
    example: 'trx_12345678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Transaction ID must be a string' })
  transactionId?: string;

  @ApiProperty({
    description: 'Payment gateway payment ID',
    example: 'pay_12345678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Payment ID must be a string' })
  paymentId?: string;
}
