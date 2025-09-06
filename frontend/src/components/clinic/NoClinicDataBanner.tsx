'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface NoClinicDataBannerProps {
  onCreateClinic: () => void;
}

export const NoClinicDataBanner: React.FC<NoClinicDataBannerProps> = ({ onCreateClinic }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <Card className="border-orange-200 bg-orange-50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <BuildingOfficeIcon className="h-4 w-4 text-orange-600" />
                <h3 className="text-sm font-semibold text-orange-900">
                  Data Klinik Belum Tersedia
                </h3>
              </div>
              <p className="text-sm text-orange-800 mb-3">
                Anda perlu membuat data klinik terlebih dahulu untuk mengakses fitur manajemen klinik.
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={onCreateClinic}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                >
                  <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                  Buat Data Klinik
                </Button>
                <div className="flex items-center text-xs text-orange-700">
                  <InformationCircleIcon className="h-3 w-3 mr-1" />
                  <span>Klik untuk memulai</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
