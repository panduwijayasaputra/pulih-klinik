'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SubscriptionData, SUBSCRIPTION_TIERS } from '@/types/registration';
import { useOnboardingStore } from '@/store/onboarding';
import { subscriptionFormSchema } from '@/schemas/registrationSchema';
import { BillingCycleEnum, SubscriptionTierEnum } from '@/types/enums';

export const OnboardingSubscriptionForm: React.FC = () => {
  const { data, updateSubscriptionData, submitSubscription, isLoading, error, clearError } = useOnboardingStore();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierEnum | null>(data.subscription?.tierCode || null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycleEnum>(data.subscription?.billingCycle || BillingCycleEnum.Monthly);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!selectedTier) return;

    const subscriptionData: SubscriptionData = {
      tierCode: selectedTier,
      billingCycle: selectedBillingCycle,
      amount: getPrice(),
      currency: 'IDR',
    };

    try {
      setIsSubmitting(true);
      clearError();
      await submitSubscription(subscriptionData);
      updateSubscriptionData(subscriptionData);
    } catch (error) {
      console.error('Failed to submit subscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Billing Cycle Selection */}
      <div>
        <Label className="text-base font-medium text-gray-900 mb-4 block">
          Siklus Pembayaran
        </Label>
        <RadioGroup
          value={selectedBillingCycle}
          onValueChange={(value: BillingCycleEnum) => setSelectedBillingCycle(value)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={BillingCycleEnum.Monthly} id="monthly" />
            <Label htmlFor="monthly" className="cursor-pointer">
              <div className="font-medium">Bulanan</div>
              <div className="text-sm text-gray-600">Bayar setiap bulan</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={BillingCycleEnum.Yearly} id="yearly" />
            <Label htmlFor="yearly" className="cursor-pointer">
              <div className="font-medium">Tahunan</div>
              <div className="text-sm text-gray-600">Hemat 1 bulan gratis</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Subscription Tiers */}
      <div>
        <Label className="text-base font-medium text-gray-900 mb-4 block">
          Pilih Paket Berlangganan
        </Label>
        <div className="space-y-4">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.code;
            const price = selectedBillingCycle === BillingCycleEnum.Yearly ? tier.yearlyPrice : tier.monthlyPrice;

            return (
              <div
                key={tier.code}
                onClick={() => setSelectedTier(tier.code)}
                className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  tier.isRecommended ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                {tier.isRecommended && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Direkomendasikan
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                      {isSelected && (
                        <CheckIcon className="w-5 h-5 text-blue-600 ml-2" />
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{tier.description}</p>
                    
                    <div className="mt-4">
                      <div className="text-3xl font-bold text-gray-900">
                        {formatPrice(price)}
                        <span className="text-lg font-normal text-gray-600">
                          /{selectedBillingCycle === BillingCycleEnum.Yearly ? 'tahun' : 'bulan'}
                        </span>
                      </div>
                      {selectedBillingCycle === BillingCycleEnum.Yearly && (
                        <p className="text-sm text-green-600 font-medium">
                          Hemat {formatPrice(tier.monthlyPrice * 12 - tier.yearlyPrice)} per tahun
                        </p>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isSubmitting || !selectedTier}
      >
        {isLoading || isSubmitting ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
      </Button>
    </form>
  );
};