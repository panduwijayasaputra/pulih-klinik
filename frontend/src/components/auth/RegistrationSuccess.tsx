'use client';

import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface RegistrationSuccessProps {
  email: string;
  onLoginClick: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  email,
  onLoginClick,
}) => {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pendaftaran Berhasil!
        </h2>
        <p className="text-gray-600">
          Akun admin klinik Anda telah berhasil dibuat
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Selamat Datang!
        </h3>
        <p className="text-green-700 text-sm mb-2">
          Email: <span className="font-medium">{email}</span>
        </p>
        <p className="text-green-700 text-sm">
          Anda sekarang dapat masuk ke sistem dan mulai mengelola klinik Anda.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={onLoginClick}
          className="w-full"
        >
          Masuk ke Sistem
        </Button>
        
        <p className="text-sm text-gray-500">
          Anda akan diarahkan ke halaman login untuk masuk ke akun Anda.
        </p>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          Langkah Selanjutnya:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1 text-left">
          <li>• Masuk ke sistem dengan email dan password Anda</li>
          <li>• Lengkapi informasi klinik Anda</li>
          <li>• Pilih paket berlangganan yang sesuai</li>
          <li>• Mulai mengelola klinik dan terapis</li>
        </ul>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
