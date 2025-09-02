'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentData } from '@/types/registration';
import { useOnboardingStore } from '@/store/onboarding';
import { paymentFormSchema } from '@/schemas/registrationSchema';
import { PaymentMethodEnum } from '@/types/enums';

export const OnboardingPaymentForm: React.FC = () => {
  const { data, updatePaymentData, submitPayment, isLoading, error, clearError } = useOnboardingStore();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodEnum>(data.payment?.paymentMethod || PaymentMethodEnum.BankTransfer);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: data.payment || {
      paymentMethod: PaymentMethodEnum.BankTransfer,
      amount: data.subscription?.amount || 0,
      currency: 'IDR',
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentInstructions = (method: PaymentMethodEnum) => {
    switch (method) {
      case PaymentMethodEnum.BankTransfer:
        return {
          title: 'Transfer Bank',
          instructions: [
            'Transfer ke rekening: 1234-5678-9012-3456',
            'Bank: Bank Central Asia (BCA)',
            'Atas nama: Smart Therapy Indonesia',
            'Jumlah: ' + formatPrice(data.subscription?.amount || 0),
            'Konfirmasi pembayaran akan diproses dalam 1x24 jam',
          ],
        };
      case PaymentMethodEnum.EWallet:
        return {
          title: 'E-Wallet',
          instructions: [
            'Scan QR code atau klik link pembayaran',
            'Pilih e-wallet: GoPay, OVO, DANA, atau LinkAja',
            'Jumlah: ' + formatPrice(data.subscription?.amount || 0),
            'Pembayaran akan dikonfirmasi otomatis',
          ],
        };
      case PaymentMethodEnum.CreditCard:
        return {
          title: 'Kartu Kredit',
          instructions: [
            'Masukkan informasi kartu kredit Anda',
            'Pembayaran aman dengan enkripsi SSL',
            'Jumlah: ' + formatPrice(data.subscription?.amount || 0),
            'Pembayaran akan diproses segera',
          ],
        };
      default:
        return { title: '', instructions: [] };
    }
  };

  const onSubmit = async (formData: PaymentData) => {
    try {
      clearError();
      
      const paymentData: PaymentData = {
        ...formData,
        paymentMethod: selectedPaymentMethod,
        amount: data.subscription?.amount || 0,
        currency: 'IDR',
      };

      await submitPayment(paymentData);
      updatePaymentData(paymentData);
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };

  const paymentInstructions = getPaymentInstructions(selectedPaymentMethod);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Ringkasan Pembayaran</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Pembayaran</span>
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(data.subscription?.amount || 0)}
          </span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <Label className="text-base font-medium text-gray-900 mb-4 block">
          Pilih Metode Pembayaran
        </Label>
        <RadioGroup
          value={selectedPaymentMethod}
          onValueChange={(value: PaymentMethodEnum) => setSelectedPaymentMethod(value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={PaymentMethodEnum.BankTransfer} id="bank" />
            <Label htmlFor="bank" className="cursor-pointer flex-1">
              <div className="font-medium">Transfer Bank</div>
              <div className="text-sm text-gray-600">BCA, Mandiri, BNI, BRI</div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={PaymentMethodEnum.EWallet} id="ewallet" />
            <Label htmlFor="ewallet" className="cursor-pointer flex-1">
              <div className="font-medium">E-Wallet</div>
              <div className="text-sm text-gray-600">GoPay, OVO, DANA, LinkAja</div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={PaymentMethodEnum.CreditCard} id="credit" />
            <Label htmlFor="credit" className="cursor-pointer flex-1">
              <div className="font-medium">Kartu Kredit</div>
              <div className="text-sm text-gray-600">Visa, Mastercard, JCB</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Payment Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">{paymentInstructions.title}</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          {paymentInstructions.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              {instruction}
            </li>
          ))}
        </ul>
      </div>

      {/* Additional Fields for Credit Card */}
      {selectedPaymentMethod === PaymentMethodEnum.CreditCard && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="transactionId">Nomor Transaksi</Label>
            <Input
              id="transactionId"
              {...register('transactionId')}
              placeholder="Akan dibuat otomatis"
              disabled
            />
          </div>
        </div>
      )}

      {/* Additional Fields for Bank Transfer */}
      {selectedPaymentMethod === PaymentMethodEnum.BankTransfer && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="transactionId">Nomor Referensi Transfer</Label>
            <Input
              id="transactionId"
              {...register('transactionId')}
              placeholder="Masukkan nomor referensi transfer"
              className={errors.transactionId ? 'border-red-500' : ''}
            />
            {errors.transactionId && (
              <p className="mt-1 text-sm text-red-600">{errors.transactionId.message}</p>
            )}
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Memproses Pembayaran...' : 'Konfirmasi Pembayaran'}
      </Button>
    </form>
  );
};