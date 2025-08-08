'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircleIcon, 
  ClockIcon,
  DocumentTextIcon,
  PlayIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

export default function ThankYouPage() {
  const nextSteps = [
    {
      id: 1,
      icon: ClockIcon,
      title: 'Konfirmasi Pembayaran',
      description: 'Selesaikan pembayaran dalam 24 jam untuk mengaktifkan akun',
      status: 'pending',
      timeframe: '24 jam'
    },
    {
      id: 2,
      icon: UserPlusIcon,
      title: 'Setup Akun Therapist',
      description: 'Tambahkan therapist pertama dan atur profil klinik',
      status: 'upcoming',
      timeframe: 'Setelah aktivasi'
    },
    {
      id: 3,
      icon: DocumentTextIcon,
      title: 'Import Data Klien',
      description: 'Upload data klien yang sudah ada (opsional)',
      status: 'upcoming',
      timeframe: 'Kapan saja'
    },
    {
      id: 4,
      icon: PlayIcon,
      title: 'Sesi Hipnoterapi Pertama',
      description: 'Mulai menggunakan AI untuk sesi hipnoterapi',
      status: 'upcoming',
      timeframe: 'Setelah setup'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="absolute inset-0 bg-white/30" />
      <div className="relative z-10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Registrasi Berhasil!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Selamat bergabung dengan Terapintar! Klinik Anda telah berhasil terdaftar dan 
              siap untuk memulai transformasi digital hipnoterapi.
            </p>
          </div>

          {/* Registration Summary */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ringkasan Registrasi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Informasi Klinik</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>ID Klinik: <span className="font-mono bg-gray-100 px-2 py-1 rounded">CLINIC-001</span></p>
                    <p>Status: <span className="text-yellow-600 font-medium">Pending Aktivasi</span></p>
                    <p>Paket: <span className="font-medium">Beta (Standard)</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Pembayaran</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Total: <span className="font-medium">Rp 166.500/bulan</span></p>
                    <p>Metode: <span className="font-medium">Transfer Bank</span></p>
                    <p>Status: <span className="text-yellow-600 font-medium">Menunggu Pembayaran</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Langkah Selanjutnya
            </h2>
            <div className="space-y-4">
              {nextSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={step.id} className={`transition-all ${
                    step.status === 'pending' 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-gray-200 bg-white'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          step.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {index + 1}. {step.title}
                            </h3>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              step.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {step.timeframe}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="space-x-4">
              <Button
                onClick={() => window.location.href = '/login'}
                className="px-8"
              >
                Masuk ke Akun
              </Button>
              <Button
                onClick={() => window.location.href = '/register'}
                variant="outline"
                className="px-8"
              >
                Daftar Klinik Lain
              </Button>
            </div>
            
            {/* Contact Information */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                Butuh Bantuan?
              </h3>
              <p className="text-blue-800 text-sm mb-3">
                Tim support kami siap membantu Anda 24/7
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  📧 support@terapintar.com
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  📱 +62-21-1234-5678
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  💬 WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}