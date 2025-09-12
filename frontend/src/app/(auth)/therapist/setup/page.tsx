'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TherapistPasswordSetup } from '@/components/auth/TherapistPasswordSetup';
import { 
  ExclamationTriangleIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

function TherapistSetupContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Registrasi Tidak Valid</h2>
              <p className="text-gray-600 mb-6">
                Link registrasi tampaknya tidak valid atau tidak lengkap. Silakan periksa email Anda untuk link yang benar.
              </p>
              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full">
                    Ke Halaman Login
                  </Button>
                </Link>
                <p className="text-sm text-gray-500">
                  Butuh bantuan? Hubungi administrator klinik Anda.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selesaikan Registrasi Anda</h1>
          <p className="text-gray-600">
            Atur kata sandi untuk mengaktifkan akun terapis Anda
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Kata Sandi</CardTitle>
            <p className="text-sm text-gray-600">
              Buat kata sandi yang aman untuk akun terapis Anda
            </p>
          </CardHeader>
          <CardContent>
            <TherapistPasswordSetup token={token} />
          </CardContent>
        </Card>

        {/* Security Note */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Informasi Keamanan
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Link registrasi Anda aman dan hanya dapat digunakan sekali</li>
                    <li>Link akan kedaluwarsa setelah 24 jam untuk keamanan</li>
                    <li>Setelah mengatur kata sandi, Anda dapat login secara normal</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Questions about your account? Contact your clinic administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TherapistSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Memuat...</span>
      </div>
    }>
      <TherapistSetupContent />
    </Suspense>
  );
}