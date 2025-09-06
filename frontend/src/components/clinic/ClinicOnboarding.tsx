'use client';

import React from 'react';
import { ClinicProfileForm } from './ClinicProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ClinicOnboardingProps {
  onComplete: () => void;
}

export const ClinicOnboarding: React.FC<ClinicOnboardingProps> = ({ onComplete }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <BuildingOfficeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang di Smart Therapy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mari kita mulai dengan membuat profil klinik Anda. Informasi ini akan membantu 
            kami memberikan pengalaman terbaik untuk Anda dan pasien.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">1</span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Informasi Klinik</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm font-medium">2</span>
              </div>
              <span className="ml-2 text-sm text-gray-500">Verifikasi</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 text-gray-500" />
              </div>
              <span className="ml-2 text-sm text-gray-500">Selesai</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Informasi Dasar Klinik
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Lengkapi informasi berikut untuk memulai menggunakan Smart Therapy. 
              Semua informasi dapat diubah nanti di pengaturan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClinicProfileForm 
              onSaveSuccess={onComplete}
              showActions={true}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Dengan melanjutkan, Anda menyetujui{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              Syarat dan Ketentuan
            </a>{' '}
            dan{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              Kebijakan Privasi
            </a>{' '}
            Smart Therapy.
          </p>
        </div>
      </div>
    </div>
  );
};
