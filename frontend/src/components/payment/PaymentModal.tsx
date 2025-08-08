'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BanknotesIcon, 
  CreditCardIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { 
  PaymentFormData, 
  paymentSchema
} from '@/types/registration';
import { useRegistrationStore } from '@/store/registration';

const paymentMethods = [
  {
    id: 'bank_transfer' as const,
    name: 'Transfer Bank',
    description: 'Transfer melalui BCA, Mandiri, BRI, BNI',
    icon: BanknotesIcon,
    processingTime: 'Manual verification (1-24 jam)',
  },
  {
    id: 'credit_card' as const,
    name: 'Kartu Kredit/Debit',
    description: 'Visa, Mastercard, JCB',
    icon: CreditCardIcon,
    processingTime: 'Instan',
  },
  {
    id: 'ewallet' as const,
    name: 'E-Wallet',
    description: 'GoPay, OVO, DANA, LinkAja',
    icon: DevicePhoneMobileIcon,
    processingTime: 'Instan',
  },
];

export const PaymentModal: React.FC = () => {
  const { 
    data, 
    updatePaymentData, 
    submitRegistration, 
    isLoading, 
    clearError 
  } = useRegistrationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: data.payment || {
      agreeTerms: false,
    },
  });

  const selectedMethod = watch('method');

  // Define pricing tiers
  const pricingTiers = {
    free: {
      name: 'Free Trial',
      price: 0,
      description: 'Coba gratis selama 14 hari'
    },
    pro: {
      name: 'Pro',
      price: 150000,
      description: 'Akses seumur hidup'
    },
    premium: {
      name: 'Premium',
      price: 500000,
      description: 'Akses seumur hidup dengan fitur lengkap'
    }
  };

  // For now, default to 'pro' tier - in a real implementation, this would come from the summary step
  // TODO: Pass selected tier from RegistrationSummary component
  const selectedTierKey = 'pro'; // This should be passed from the previous step
  const selectedTier = pricingTiers[selectedTierKey];

  const onSubmit = async (formData: PaymentFormData) => {
    clearError();
    updatePaymentData(formData);
    await submitRegistration();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    const basePrice = selectedTier?.price || 0;
    const tax = basePrice * 0.11; // PPN 11%
    return basePrice + tax;
  };

  if (!selectedTier) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: Paket tidak ditemukan</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Order Summary */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">Ringkasan Pesanan</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Paket {selectedTier.name}</span>
              <span className="font-medium">
                {selectedTier.price === 0 ? 'GRATIS' : formatPrice(selectedTier.price)}
              </span>
            </div>
            {selectedTier.price > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">PPN (11%)</span>
                  <span className="font-medium">{formatPrice(selectedTier.price * 0.11)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-bold text-lg">{formatPrice(calculateTotal())}</span>
                </div>
              </>
            )}
            {selectedTier.price === 0 && (
              <div className="border-t border-gray-200 pt-2">
                <p className="text-sm text-green-600 font-medium">
                  Tidak ada biaya untuk trial gratis
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Pilih Metode Pembayaran
        </h3>

        {errors.method && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.method.message}</p>
          </div>
        )}

        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <label
                key={method.id}
                className={`block cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    {...register('method')}
                    type="radio"
                    value={method.id}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">
                        {method.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {method.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pemrosesan: {method.processingTime}
                    </p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Selected Method Details */}
      {selectedMethod && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Instruksi Pembayaran - {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </h4>
            <div className="text-sm text-blue-800">
              {selectedMethod === 'bank_transfer' && (
                <div>
                  <p className="mb-2">Setelah konfirmasi, Anda akan menerima:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Detail rekening untuk transfer</li>
                    <li>Kode unik pembayaran</li>
                    <li>Panduan konfirmasi pembayaran</li>
                  </ul>
                </div>
              )}
              {selectedMethod === 'credit_card' && (
                <p>
                  Anda akan diarahkan ke gateway pembayaran yang aman untuk memasukkan 
                  detail kartu kredit/debit Anda.
                </p>
              )}
              {selectedMethod === 'ewallet' && (
                <p>
                  Anda akan menerima notifikasi push atau dapat memindai QR code 
                  untuk menyelesaikan pembayaran melalui aplikasi e-wallet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-start">
          <input
            {...register('agreeTerms')}
            type="checkbox"
            id="agreeTerms"
            className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
              errors.agreeTerms ? 'border-red-500' : ''
            }`}
          />
          <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
            Saya menyetujui{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline">
              Syarat dan Ketentuan
            </a>{' '}
            serta{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline">
              Kebijakan Privasi
            </a>{' '}
            Terapintar
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
        )}
      </div>

      {/* Additional Terms */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <h4 className="font-medium text-gray-900 mb-2">Ketentuan Pembayaran:</h4>
        <ul className="space-y-1">
          {selectedTier.price === 0 ? (
            <>
              <li>• Akun trial akan diaktivasi segera setelah konfirmasi</li>
              <li>• Trial berlaku selama 14 hari tanpa biaya</li>
              <li>• Setelah trial berakhir, Anda dapat upgrade ke Pro atau Premium</li>
              <li>• Support tersedia selama masa trial</li>
            </>
          ) : (
            <>
              <li>• Akun akan diaktivasi setelah pembayaran dikonfirmasi</li>
              <li>• Garansi uang kembali 14 hari jika tidak puas</li>
              <li>• Akses seumur hidup tanpa biaya berulang</li>
              <li>• Support 24/7 tersedia untuk bantuan teknis</li>
            </>
          )}
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button 
          type="submit" 
          className="px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Memproses...
            </>
          ) : selectedTier.price === 0 ? (
            'Mulai Trial Gratis'
          ) : (
            `Bayar ${formatPrice(calculateTotal())}`
          )}
        </Button>
      </div>
    </form>
  );
};