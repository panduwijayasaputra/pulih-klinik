'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { CheckIcon } from '@heroicons/react/24/solid';
import { 
  SubscriptionFormData, 
  mockSubscriptionTiers, 
  subscriptionSchema 
} from '@/types/registration';
import { useRegistrationStore } from '@/store/registration';

export const SubscriptionSelector: React.FC = () => {
  const { data, updateSubscriptionData, nextStep, clearError } = useRegistrationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: data.subscription || {},
  });

  const selectedTier = watch('tier');

  const onSubmit = (formData: SubscriptionFormData) => {
    clearError();
    updateSubscriptionData(formData);
    nextStep();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Pilih Paket Berlangganan yang Sesuai
        </h3>
        <p className="text-gray-600">
          Semua paket dapat diupgrade atau didowngrade kapan saja sesuai kebutuhan klinik Anda
        </p>
      </div>

      {/* Error Message */}
      {errors.tier && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.tier.message}</p>
        </div>
      )}

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockSubscriptionTiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
              selectedTier === tier.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } ${tier.recommended ? 'ring-2 ring-blue-200' : ''}`}
          >
            {/* Recommended Badge */}
            {tier.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Direkomendasikan
                </span>
              </div>
            )}

            {/* Radio Button */}
            <div className="absolute top-4 right-4">
              <input
                {...register('tier')}
                type="radio"
                value={tier.id}
                id={tier.id}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
            </div>

            <label htmlFor={tier.id} className="cursor-pointer">
              {/* Tier Name */}
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {tier.name}
              </h4>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(tier.price)}
                </span>
                <span className="text-gray-600 ml-2">
                  {tier.period}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </label>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Yang Perlu Anda Ketahui:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Periode berlangganan dimulai dari tanggal aktivasi akun</li>
          <li>• Dapat upgrade atau downgrade paket kapan saja</li>
          <li>• Pembayaran dapat dilakukan melalui transfer bank, kartu kredit, atau e-wallet</li>
          <li>• Tim support akan membantu setup awal dan onboarding</li>
          <li>• Garansi uang kembali 14 hari jika tidak puas</li>
        </ul>
      </div>

      {/* Selected Tier Summary */}
      {selectedTier && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-1">Paket yang Dipilih:</h4>
          <p className="text-blue-800">
            {mockSubscriptionTiers.find(t => t.id === selectedTier)?.name} - {' '}
            {formatPrice(mockSubscriptionTiers.find(t => t.id === selectedTier)?.price || 0)} per bulan
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button 
          type="submit" 
          className="px-8"
          disabled={!selectedTier}
        >
          Lanjutkan ke Pembayaran
        </Button>
      </div>
    </form>
  );
};