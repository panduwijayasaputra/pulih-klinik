'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SubscriptionData, SUBSCRIPTION_TIERS } from '@/types/registration';
import { useRegistrationStore } from '@/store/registration';
import { subscriptionFormSchema } from '@/schemas/registrationSchema';
import { BillingCycleEnum, SubscriptionTierEnum } from '@/types/enums';

export const SubscriptionForm: React.FC = () => {
  const { data, updateSubscriptionData, selectSubscription, isLoading, error, clearError, registrationId } = useRegistrationStore();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierEnum | null>(data.subscription?.tierCode || null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycleEnum>(data.subscription?.billingCycle || BillingCycleEnum.Monthly);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionData>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: data.subscription || {
      tierCode: SubscriptionTierEnum.Alpha,
      billingCycle: BillingCycleEnum.Monthly,
      amount: 100000,
      currency: 'IDR',
    },
  });

  const getSelectedTierData = () => {
    return SUBSCRIPTION_TIERS.find(tier => tier.code === selectedTier);
  };

  const getPrice = () => {
    const tier = getSelectedTierData();
    if (!tier) return 0;
    return selectedBillingCycle === BillingCycleEnum.Yearly ? tier.yearlyPrice : tier.monthlyPrice;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const onSubmit = async () => {
    if (!selectedTier || !registrationId) return;

    clearError();
    
    const subscriptionData: SubscriptionData = {
      tierCode: selectedTier,
      billingCycle: selectedBillingCycle,
      amount: getPrice(),
      currency: 'IDR',
    };

    try {
      await selectSubscription(registrationId, subscriptionData);
      updateSubscriptionData(subscriptionData);
    } catch (error) {
      console.error('Subscription selection failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pilih Paket Berlangganan
        </h2>
        <p className="text-gray-600">
          Pilih paket yang sesuai dengan kebutuhan klinik Anda
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Subscription Tiers */}
        <div>
          <Label className="text-lg font-semibold text-gray-900 mb-4 block">
            Pilih Paket
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <div
                key={tier.code}
                className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTier === tier.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTier(tier.code)}
              >
                {tier.isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Direkomendasikan
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(tier.monthlyPrice)}
                    </div>
                    <div className="text-sm text-gray-500">per bulan</div>
                  </div>

                  <ul className="text-left space-y-2 mb-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedTier === tier.code && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Billing Cycle */}
        {selectedTier && (
          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-4 block">
              Siklus Penagihan
            </Label>
            <RadioGroup
              value={selectedBillingCycle}
              onValueChange={(value) => setSelectedBillingCycle(value as BillingCycleEnum)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={BillingCycleEnum.Monthly} id="monthly" />
                <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>Bulanan</span>
                    <span className="font-semibold">
                      {formatPrice(getSelectedTierData()?.monthlyPrice || 0)}
                    </span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={BillingCycleEnum.Yearly} id="yearly" />
                <Label htmlFor="yearly" className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>Tahunan</span>
                    <span className="font-semibold">
                      {formatPrice(getSelectedTierData()?.yearlyPrice || 0)}
                    </span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Hemat {formatPrice((getSelectedTierData()?.monthlyPrice || 0) * 12 - (getSelectedTierData()?.yearlyPrice || 0))}
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Summary */}
        {selectedTier && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Paket:</span>
                <span className="font-medium">{getSelectedTierData()?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Siklus:</span>
                <span className="font-medium">
                  {selectedBillingCycle === BillingCycleEnum.Monthly ? 'Bulanan' : 'Tahunan'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold text-lg">
                  {formatPrice(getPrice())}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !selectedTier}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Memproses...
            </div>
          ) : (
            'Lanjutkan ke Pembayaran'
          )}
        </Button>
      </form>
    </div>
  );
};
