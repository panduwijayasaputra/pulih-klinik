'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useRegistrationStore } from '@/store/registration';
import { ClinicAPI, SubscriptionTierData } from '@/lib/api/clinic';

interface SubscriptionSelectorProps {
  onSubscriptionSelected?: (subscriptionTier: string) => void;
  isLoading?: boolean;
}

export const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({ 
  onSubscriptionSelected,
  isLoading = false 
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTierData[]>([]);
  const [tiersLoading, setTiersLoading] = useState(true);
  const [tiersError, setTiersError] = useState<string | null>(null);

  // Fetch subscription tiers from API
  useEffect(() => {
    const fetchSubscriptionTiers = async () => {
      try {
        setTiersLoading(true);
        setTiersError(null);
        const response = await ClinicAPI.getSubscriptionTiers();
        if (response.success) {
          setSubscriptionTiers(response.data);
        } else {
          setTiersError('Gagal memuat paket subscription');
        }
      } catch (error) {
        setTiersError('Gagal memuat paket subscription');
        console.error('Error fetching subscription tiers:', error);
      } finally {
        setTiersLoading(false);
      }
    };

    fetchSubscriptionTiers();
  }, []);

  const onSubmit = () => {
    if (!selectedTier) return;
    onSubscriptionSelected?.(selectedTier);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Show loading state
  if (tiersLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Pilih Paket Berlangganan yang Sesuai
          </h3>
          <p className="text-gray-600">
            Semua paket dapat diupgrade atau didowngrade kapan saja sesuai kebutuhan klinik Anda
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Memuat paket subscription...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (tiersError) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Pilih Paket Berlangganan yang Sesuai
          </h3>
          <p className="text-gray-600">
            Semua paket dapat diupgrade atau didowngrade kapan saja sesuai kebutuhan klinik Anda
          </p>
        </div>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{tiersError}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Pilih Paket Berlangganan yang Sesuai
        </h3>
        <p className="text-gray-600">
          Semua paket dapat diupgrade atau didowngrade kapan saja sesuai kebutuhan klinik Anda
        </p>
      </div>

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${selectedTier === tier.code
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                : 'border-gray-200 bg-white hover:border-gray-300'
              } ${tier.isRecommended ? 'ring-2 ring-blue-200' : ''}`}
            onClick={() => setSelectedTier(tier.code)}
          >
            {/* Recommended Badge */}
            {tier.isRecommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Direkomendasikan
                </span>
              </div>
            )}

            {/* Radio Button */}
            <div className="absolute top-4 right-4">
              <input
                type="radio"
                value={tier.code}
                id={tier.code}
                checked={selectedTier === tier.code}
                onChange={() => setSelectedTier(tier.code)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
            </div>

            <label htmlFor={tier.code} className="cursor-pointer">
              {/* Tier Name */}
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {tier.name}
              </h4>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(tier.monthlyPrice)}
                </span>
                <span className="text-gray-600 ml-2">
                  /bulan
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tier.therapistLimit} Therapist</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tier.newClientsPerDayLimit} Klien Baru/Hari</span>
                </li>
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
          <li>• Tim support akan membantu setup awal</li>
          <li>• Garansi uang kembali 14 hari jika tidak puas</li>
        </ul>
      </div>

      {/* Selected Tier Summary */}
      {selectedTier && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-1">Paket yang Dipilih:</h4>
          <p className="text-blue-800">
            {subscriptionTiers.find(t => t.code === selectedTier)?.name} - {' '}
            {formatPrice(subscriptionTiers.find(t => t.code === selectedTier)?.monthlyPrice || 0)} per bulan
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button
          onClick={onSubmit}
          className="px-8"
          disabled={!selectedTier || isLoading}
        >
          {isLoading ? 'Memproses...' : 'Pilih Paket'}
        </Button>
      </div>
    </div>
  );
};