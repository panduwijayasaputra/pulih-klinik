'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentData } from '@/types/registration';
import { useRegistrationStore } from '@/store/registration';
import { paymentFormSchema } from '@/schemas/registrationSchema';
import { PaymentMethodEnum } from '@/types/enums';

export const PaymentForm: React.FC = () => {
  const { data, updatePaymentData, processPayment, isLoading, error, clearError, registrationId } = useRegistrationStore();
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
      case PaymentMethodEnum.CreditCard:
        return {
          title: 'Kartu Kredit',
          instructions: [
            'Pembayaran akan diproses secara otomatis',
            'Pastikan kartu kredit Anda aktif',
            'Biaya transaksi akan ditambahkan sesuai kebijakan bank',
          ],
        };
      case PaymentMethodEnum.EWallet:
        return {
          title: 'E-Wallet',
          instructions: [
            'Pilih e-wallet yang tersedia',
            'Scan QR code atau masukkan nomor telepon',
            'Konfirmasi pembayaran di aplikasi e-wallet',
          ],
        };
      case PaymentMethodEnum.Crypto:
        return {
          title: 'Cryptocurrency',
          instructions: [
            'Pembayaran menggunakan Bitcoin atau Ethereum',
            'Pastikan wallet Anda memiliki saldo yang cukup',
            'Konversi nilai akan mengikuti kurs saat transaksi',
          ],
        };
      default:
        return { title: '', instructions: [] };
    }
  };

  const onSubmit = async (formData: PaymentData) => {
    if (!registrationId) return;

    clearError();
    
    const paymentData: PaymentData = {
      paymentMethod: selectedPaymentMethod,
      amount: data.subscription?.amount || 0,
      currency: 'IDR',
      transactionId: formData.transactionId,
      paymentId: formData.paymentId,
    };

    try {
      await processPayment(registrationId, paymentData);
      updatePaymentData(paymentData);
    } catch (error) {
      console.error('Payment processing failed:', error);
    }
  };

  const paymentInstructions = getPaymentInstructions(selectedPaymentMethod);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pembayaran
        </h2>
        <p className="text-gray-600">
          Pilih metode pembayaran dan selesaikan transaksi
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Payment Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Paket:</span>
              <span className="font-medium">{data.subscription?.tierCode}</span>
            </div>
            <div className="flex justify-between">
              <span>Siklus:</span>
              <span className="font-medium">
                {data.subscription?.billingCycle === 'monthly' ? 'Bulanan' : 'Tahunan'}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatPrice(data.subscription?.amount || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <Label className="text-lg font-semibold text-gray-900 mb-4 block">
            Metode Pembayaran
          </Label>
          <RadioGroup
            value={selectedPaymentMethod}
            onValueChange={(value) => setSelectedPaymentMethod(value as PaymentMethodEnum)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={PaymentMethodEnum.BankTransfer} id="bank_transfer" />
              <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <span>Transfer Bank</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={PaymentMethodEnum.CreditCard} id="credit_card" />
              <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <span>Kartu Kredit</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={PaymentMethodEnum.EWallet} id="e_wallet" />
              <Label htmlFor="e_wallet" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <span>E-Wallet</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={PaymentMethodEnum.Crypto} id="crypto" />
              <Label htmlFor="crypto" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <span>Cryptocurrency</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Payment Instructions */}
        {selectedPaymentMethod && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {paymentInstructions.title}
            </h3>
            <ul className="space-y-2">
              {paymentInstructions.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transaction ID (for bank transfer) */}
        {selectedPaymentMethod === PaymentMethodEnum.BankTransfer && (
          <div>
            <Label htmlFor="transactionId" className="text-sm font-medium text-gray-700">
              Nomor Referensi Transfer (Opsional)
            </Label>
            <Input
              id="transactionId"
              type="text"
              {...register('transactionId')}
              className="mt-1"
              placeholder="Masukkan nomor referensi transfer"
            />
            <p className="mt-1 text-xs text-gray-500">
              Untuk mempercepat proses konfirmasi pembayaran
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Memproses Pembayaran...
            </div>
          ) : (
            'Bayar Sekarang'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Dengan melanjutkan, Anda menyetujui{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-500">
            Syarat dan Ketentuan
          </a>{' '}
          kami
        </p>
      </div>
    </div>
  );
};
