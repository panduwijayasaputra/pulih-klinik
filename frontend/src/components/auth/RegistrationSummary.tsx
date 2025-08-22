'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRegistrationStore } from '@/store/registration';
import { RegistrationStepEnum } from '@/types/enums';
import { 
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PencilIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface RegistrationSummaryProps {
  clinicData: any;
  onEditClinic: () => void;
  onProceedToPayment: () => void;
}

export const RegistrationSummary: React.FC<RegistrationSummaryProps> = ({
  clinicData,
  onEditClinic,
  onProceedToPayment
}) => {
  const { isEmailVerified, setStep } = useRegistrationStore();
  const [selectedTier, setSelectedTier] = useState<'free' | 'pro' | 'premium'>('free');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeService, setAgreeService] = useState(false);

  // Check if current admin email is verified
  const isCurrentEmailVerified = clinicData?.adminEmail ? isEmailVerified(clinicData.adminEmail) : false;

  // Handle back navigation - skip verification if email is verified
  const handleBackToClinic = () => {
    if (isCurrentEmailVerified) {
      // Skip verification step and go directly to clinic form
      setStep(RegistrationStepEnum.Clinic);
    } else {
      // Go to previous step (verification)
      onEditClinic();
    }
  };

  // Pricing constants
  const freeTrial = {
    name: 'Free Trial',
    price: 0,
    therapists: 1,
    clients: 3,
    tokens: 5,
    trialDays: 14,
    description: 'Coba gratis selama 14 hari'
  };

  const proUser = {
    name: 'Pro',
    price: 150000,
    therapists: 3,
    clients: 20,
    tokens: 10,
    lifetime: true,
    trialDays: 0,
    description: 'Akses seumur hidup'
  };

  const premiumUser = {
    name: 'Premium',
    price: 500000,
    therapists: 10,
    clients: -1, // -1 indicates unlimited
    tokens: 50,
    lifetime: true,
    trialDays: 0,
    description: 'Akses seumur hidup dengan fitur lengkap'
  };

  const selectedPlan = selectedTier === 'free' ? freeTrial : selectedTier === 'pro' ? proUser : premiumUser;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const canProceed = agreeTerms && agreePrivacy && agreeService;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ringkasan Registrasi
        </h3>
        <p className="text-gray-600">
          Silakan periksa informasi di bawah ini sebelum melanjutkan ke pembayaran
        </p>
      </div>

      {/* Clinic Information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <BuildingOfficeIcon className="w-5 h-5 mr-2" />
              Informasi Klinik
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToClinic}
              className="flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{clinicData?.name}</h4>
              <p className="text-sm text-gray-600 mb-1">
                {clinicData?.address}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {clinicData?.city}, {clinicData?.province}
              </p>
              <p className="text-sm text-gray-600">
                📞 {clinicData?.phone}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                Admin Klinik
              </h4>
              <p className="text-sm text-gray-600 mb-1">
                {clinicData?.adminName} ({clinicData?.adminPosition})
              </p>
              <p className="text-sm text-gray-600 mb-1">
                📧 {clinicData?.adminEmail}
              </p>
              <p className="text-sm text-gray-600">
                📱 {clinicData?.adminWhatsapp}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <CurrencyDollarIcon className="w-5 h-5 mr-2" />
            Pilih Paket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Trial */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedTier === 'free' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTier('free')}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{freeTrial.name}</h4>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  GRATIS
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{freeTrial.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                  {freeTrial.therapists} Therapist
                </div>
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2 text-gray-500" />
                  {freeTrial.clients} Klien per hari
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                  {freeTrial.tokens} Token gratis
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                  {freeTrial.trialDays} hari trial
                </div>
              </div>
            </div>

            {/* Pro User */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedTier === 'pro' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTier('pro')}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{proUser.name}</h4>
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  PRO
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{proUser.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                  {proUser.therapists} Therapist
                </div>
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2 text-gray-500" />
                  {proUser.clients} Klien per hari
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                  {proUser.tokens} Token gratis
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                  Akses seumur hidup
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(proUser.price)}
                </div>
                <div className="text-xs text-gray-500">Sekali bayar</div>
              </div>
            </div>

            {/* Premium User */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedTier === 'premium' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTier('premium')}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{premiumUser.name}</h4>
                <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  PREMIUM
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{premiumUser.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                  {premiumUser.therapists} Therapist
                </div>
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2 text-gray-500" />
                  Unlimited Klien per hari
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                  {premiumUser.tokens} Token gratis
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                  Akses seumur hidup
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(premiumUser.price)}
                </div>
                <div className="text-xs text-gray-500">Sekali bayar</div>
              </div>
            </div>
          </div>

          {/* Selected Plan Summary */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Paket yang Dipilih: {selectedPlan.name}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Therapist:</span>
                <div className="font-medium">{selectedPlan.therapists}</div>
              </div>
              <div>
                <span className="text-gray-600">Klien/hari:</span>
                <div className="font-medium">
                  {selectedPlan.clients === -1 ? 'Unlimited' : selectedPlan.clients}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Token gratis:</span>
                <div className="font-medium">{selectedPlan.tokens}</div>
              </div>
              <div>
                <span className="text-gray-600">Biaya:</span>
                <div className="font-medium">
                  {selectedPlan.price === 0 ? 'GRATIS' : formatCurrency(selectedPlan.price)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <UsersIcon className="w-5 h-5 mr-2" />
            Aturan Bisnis - {selectedPlan.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                Batas Therapist
              </h4>
              <p className="text-sm text-gray-600">
                Maksimal <span className="font-medium">{selectedPlan.therapists} therapist</span> per klinik
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                Batas Klien Harian
              </h4>
              <p className="text-sm text-gray-600">
                {selectedPlan.clients === -1 ? (
                  <span className="font-medium">Unlimited klien baru</span>
                ) : (
                  <>Maksimal <span className="font-medium">{selectedPlan.clients} klien baru</span> per hari</>
                )}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2">
              Token dan Akses
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                {selectedPlan.tokens} token gratis untuk sesi terapi
              </div>
              {selectedTier === 'free' ? (
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2 text-orange-500" />
                  Trial berlaku {selectedPlan.trialDays} hari
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                  Akses seumur hidup tanpa batas waktu
                </div>
              )}
              <div className="flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-blue-500" />
                Token dapat dibeli tambahan setelah habis
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Syarat dan Ketentuan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="terms" className="text-sm font-medium">
                  Saya setuju dengan Syarat dan Ketentuan Layanan
                </Label>
                <p className="text-xs text-gray-500">
                  Dengan mencentang ini, Anda menyetujui semua syarat dan ketentuan penggunaan platform Terapintar.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={agreePrivacy}
                onCheckedChange={(checked) => setAgreePrivacy(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="privacy" className="text-sm font-medium">
                  Saya setuju dengan Kebijakan Privasi
                </Label>
                <p className="text-xs text-gray-500">
                  Anda menyetujui pengumpulan, penggunaan, dan perlindungan data pribadi sesuai kebijakan privasi kami.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="service"
                checked={agreeService}
                onCheckedChange={(checked) => setAgreeService(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="service" className="text-sm font-medium">
                  Saya setuju dengan Perjanjian Layanan
                </Label>
                <p className="text-xs text-gray-500">
                  Anda menyetujui perjanjian layanan dan penggunaan platform Terapintar untuk layanan terapi.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleBackToClinic}
          className="flex items-center"
        >
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit Informasi Klinik
        </Button>
        <Button
          onClick={onProceedToPayment}
          disabled={!canProceed}
          className="px-8"
        >
          {selectedTier === 'free' ? 'Mulai Trial Gratis' : 'Lanjutkan ke Pembayaran'}
        </Button>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Informasi Penting:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          {selectedTier === 'free' ? (
            <>
              <li>• Trial gratis selama 14 hari tanpa kartu kredit</li>
              <li>• Setelah trial berakhir, Anda dapat upgrade ke Pro atau Premium</li>
              <li>• Token dapat digunakan untuk sesi terapi dengan therapist yang terdaftar</li>
              <li>• Dukungan teknis tersedia selama masa trial</li>
            </>
          ) : (
            <>
              <li>• Pembayaran dilakukan melalui Midtrans (aman dan terpercaya)</li>
              <li>• Setelah pembayaran berhasil, akun klinik akan langsung aktif</li>
              <li>• Akses seumur hidup tanpa biaya berulang</li>
              <li>• Dukungan teknis tersedia 24/7 melalui WhatsApp admin</li>
              {selectedTier === 'premium' && (
                <li>• Fitur premium dengan unlimited klien dan 50 token gratis</li>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
