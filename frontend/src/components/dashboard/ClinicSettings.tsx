'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useClinic } from '@/hooks/useClinic';
import { ClinicSettings as ClinicSettingsType } from '@/types/clinic';
import { 
  Cog6ToothIcon,
  ClockIcon,
  GlobeAltIcon,
  BellIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface ClinicSettingsProps {
  className?: string;
}

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB) - UTC+7', offset: '+07:00' },
  { value: 'Asia/Makassar', label: 'Makassar (WITA) - UTC+8', offset: '+08:00' },
  { value: 'Asia/Jayapura', label: 'Jayapura (WIT) - UTC+9', offset: '+09:00' },
  { value: 'Asia/Pontianak', label: 'Pontianak (WIB) - UTC+7', offset: '+07:00' },
  { value: 'Asia/Singapore', label: 'Singapore - UTC+8', offset: '+08:00' }
];

const LANGUAGE_OPTIONS = [
  { value: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'jv', label: 'Bahasa Jawa', flag: '🏛️' },
  { value: 'su', label: 'Bahasa Sunda', flag: '🌄' }
];

const NOTIFICATION_SETTINGS = [
  {
    key: 'email' as keyof ClinicSettingsType['notifications'],
    label: 'Email',
    description: 'Terima notifikasi melalui email',
    icon: EnvelopeIcon
  },
  {
    key: 'sms' as keyof ClinicSettingsType['notifications'],
    label: 'SMS',
    description: 'Terima notifikasi melalui SMS',
    icon: DevicePhoneMobileIcon
  },
  {
    key: 'push' as keyof ClinicSettingsType['notifications'],
    label: 'Push Notification',
    description: 'Terima notifikasi push di browser',
    icon: BellIcon
  }
];

interface NotificationToggleProps {
  setting: typeof NOTIFICATION_SETTINGS[0];
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  setting,
  enabled,
  onChange,
  disabled = false
}) => {
  const Icon = setting.icon;
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <Icon className={`w-5 h-5 ${enabled ? 'text-blue-600' : 'text-gray-500'}`} />
        </div>
        <div>
          <p className="font-medium text-gray-900">{setting.label}</p>
          <p className="text-sm text-gray-500">{setting.description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export const ClinicSettings: React.FC<ClinicSettingsProps> = ({ className = '' }) => {
  const { clinic, isLoading, error, updateSettings, clearError } = useClinic();
  const [isEditing, setIsEditing] = useState(false);
  const [settingsData, setSettingsData] = useState<ClinicSettingsType>({
    timezone: 'Asia/Jakarta',
    language: 'id',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize settings data when clinic data is loaded
  useEffect(() => {
    if (clinic?.settings) {
      setSettingsData(clinic.settings);
    }
  }, [clinic]);

  const handleTimezoneChange = (timezone: string) => {
    setSettingsData(prev => ({
      ...prev,
      timezone
    }));
  };

  const handleLanguageChange = (language: string) => {
    setSettingsData(prev => ({
      ...prev,
      language
    }));
  };

  const handleNotificationChange = (key: keyof ClinicSettingsType['notifications'], enabled: boolean) => {
    setSettingsData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: enabled
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await updateSettings(settingsData);
    
    if (success) {
      setIsEditing(false);
    }
    
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (clinic?.settings) {
      setSettingsData(clinic.settings);
    }
    setIsEditing(false);
    clearError();
  };

  const getTimezoneInfo = (timezone: string) => {
    const option = TIMEZONE_OPTIONS.find(tz => tz.value === timezone);
    return option || TIMEZONE_OPTIONS[0];
  };

  const getLanguageInfo = (language: string) => {
    const option = LANGUAGE_OPTIONS.find(lang => lang.value === language);
    return option || LANGUAGE_OPTIONS[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', {
      timeZone: settingsData.timezone,
      hour12: false
    });
    const dateStr = now.toLocaleDateString('id-ID', {
      timeZone: settingsData.timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return { time: timeStr, date: dateStr };
  };

  if (!clinic) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 bg-gray-300 rounded flex-1 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentTime = getCurrentTime();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
            <div>
              <CardTitle>Pengaturan Klinik</CardTitle>
              <CardDescription>
                Konfigurasi pengaturan operasional dan preferensi klinik
              </CardDescription>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <Cog6ToothIcon className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Regional Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Pengaturan Regional</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
              {/* Timezone */}
              <div className="space-y-3">
                <Label>Zona Waktu</Label>
                <Select
                  value={settingsData.timezone}
                  onValueChange={handleTimezoneChange}
                  disabled={!isEditing || isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONE_OPTIONS.map((timezone) => (
                      <SelectItem key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-500 flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    Waktu saat ini: {currentTime.time} - {currentTime.date}
                  </span>
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <Label>Bahasa Sistem</Label>
                <Select
                  value={settingsData.language}
                  onValueChange={handleLanguageChange}
                  disabled={!isEditing || isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        <div className="flex items-center space-x-2">
                          <span>{language.flag}</span>
                          <span>{language.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Bahasa untuk interface dan notifikasi sistem
                </p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BellIcon className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-medium text-gray-900">Preferensi Notifikasi</h3>
            </div>

            <div className="space-y-3 pl-7">
              <p className="text-sm text-gray-600">
                Pilih cara Anda ingin menerima notifikasi dari sistem
              </p>
              
              {NOTIFICATION_SETTINGS.map((setting) => (
                <NotificationToggle
                  key={setting.key}
                  setting={setting}
                  enabled={settingsData.notifications[setting.key]}
                  onChange={(enabled) => handleNotificationChange(setting.key, enabled)}
                  disabled={!isEditing || isSubmitting}
                />
              ))}

              {/* Notification Summary */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-4">
                <div className="flex items-start space-x-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Jenis Notifikasi yang Akan Diterima
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-blue-700">• Appointment reminders dan konfirmasi</p>
                      <p className="text-xs text-blue-700">• Update status client dan session</p>
                      <p className="text-xs text-blue-700">• Notifikasi sistem dan maintenance</p>
                      <p className="text-xs text-blue-700">• Invoice dan billing reminders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Settings Display */}
          {!isEditing && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Pengaturan Saat Ini</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ClockIcon className="w-4 h-4 text-gray-600" />
                    <p className="font-medium text-gray-900">Zona Waktu</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {getTimezoneInfo(settingsData.timezone).label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentTime.time}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <GlobeAltIcon className="w-4 h-4 text-gray-600" />
                    <p className="font-medium text-gray-900">Bahasa</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{getLanguageInfo(settingsData.language).flag}</span>
                    <p className="text-sm text-gray-600">
                      {getLanguageInfo(settingsData.language).label}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BellIcon className="w-4 h-4 text-gray-600" />
                    <p className="font-medium text-gray-900">Notifikasi</p>
                  </div>
                  <div className="flex space-x-2">
                    {Object.entries(settingsData.notifications).map(([key, enabled]) => {
                      const setting = NOTIFICATION_SETTINGS.find(s => s.key === key);
                      if (!setting) return null;
                      
                      return (
                        <Badge
                          key={key}
                          variant={enabled ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {setting.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                <CheckIcon className="w-4 h-4 mr-1" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Batal
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};