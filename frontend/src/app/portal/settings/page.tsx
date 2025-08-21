'use client';

import React, { useState } from 'react';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; 
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { 
  BellIcon,
  CogIcon,
  ComputerDesktopIcon,
  MoonIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  SunIcon,
  UserIcon
} from '@heroicons/react/24/outline';

function SettingsPageContent() {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    language: 'id',
    timezone: 'Asia/Jakarta',
    dateFormat: 'dd/mm/yyyy',
    theme: 'system',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    sessionReminders: true,
    systemUpdates: true,
    
    // Privacy Settings
    profileVisibility: 'private',
    showOnlineStatus: true,
    allowDataCollection: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 60,
    loginNotifications: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Mock save functionality
    console.log('Saving settings:', settings);
    
    addToast({
      type: 'success',
      title: "Pengaturan berhasil disimpan",
      message: "Perubahan pengaturan telah diterapkan.",
    });
  };

  const handleResetSettings = () => {
    // Reset to default settings
    setSettings({
      language: 'id',
      timezone: 'Asia/Jakarta',
      dateFormat: 'dd/mm/yyyy',
      theme: 'system',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      sessionReminders: true,
      systemUpdates: true,
      profileVisibility: 'private',
      showOnlineStatus: true,
      allowDataCollection: false,
      twoFactorAuth: false,
      sessionTimeout: 60,
      loginNotifications: true
    });
    
    addToast({
      type: 'info',
      title: "Pengaturan direset",
      message: "Semua pengaturan telah dikembalikan ke nilai default.",
    });
  };

  const headerActions = (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={handleResetSettings}>
        Reset ke Default
      </Button>
      <Button onClick={handleSaveSettings}>
        Simpan Perubahan
      </Button>
    </div>
  );

  return (
    <PortalPageWrapper
      title="Pengaturan"
      description="Kelola preferensi dan konfigurasi sistem Anda"
      actions={headerActions}
    >
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <CogIcon className="w-4 h-4" />
            Umum
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellIcon className="w-4 h-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Privasi
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4" />
            Keamanan
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CogIcon className="w-5 h-5" />
                  Pengaturan Umum
                </CardTitle>
                <CardDescription>
                  Konfigurasi dasar untuk pengalaman pengguna
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Waktu</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Jakarta">WIB - Jakarta</SelectItem>
                      <SelectItem value="Asia/Makassar">WITA - Makassar</SelectItem>
                      <SelectItem value="Asia/Jayapura">WIT - Jayapura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Format Tanggal</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PaintBrushIcon className="w-5 h-5" />
                  Tampilan
                </CardTitle>
                <CardDescription>
                  Kustomisasi tema dan tampilan interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <SunIcon className="w-4 h-4" />
                          Terang
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <MoonIcon className="w-4 h-4" />
                          Gelap
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <ComputerDesktopIcon className="w-4 h-4" />
                          Ikuti Sistem
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellIcon className="w-5 h-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>
                Kelola cara Anda menerima pemberitahuan dari sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Email</Label>
                  <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked: boolean) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Push</Label>
                  <p className="text-sm text-gray-600">Terima notifikasi push di browser</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked: boolean) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi SMS</Label>
                  <p className="text-sm text-gray-600">Terima notifikasi melalui SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked: boolean) => handleSettingChange('smsNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pengingat Sesi</Label>
                  <p className="text-sm text-gray-600">Notifikasi untuk sesi yang akan datang</p>
                </div>
                <Switch
                  checked={settings.sessionReminders}
                  onCheckedChange={(checked: boolean) => handleSettingChange('sessionReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Update Sistem</Label>
                  <p className="text-sm text-gray-600">Notifikasi untuk update dan maintenance</p>
                </div>
                <Switch
                  checked={settings.systemUpdates}
                  onCheckedChange={(checked: boolean) => handleSettingChange('systemUpdates', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Pengaturan Privasi
              </CardTitle>
              <CardDescription>
                Kontrol siapa yang dapat melihat informasi Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profileVisibility">Visibilitas Profil</Label>
                <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange('profileVisibility', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Publik - Semua dapat melihat</SelectItem>
                    <SelectItem value="colleagues">Rekan Kerja - Hanya tim klinik</SelectItem>
                    <SelectItem value="private">Privat - Hanya saya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tampilkan Status Online</Label>
                  <p className="text-sm text-gray-600">Orang lain dapat melihat ketika Anda online</p>
                </div>
                <Switch
                  checked={settings.showOnlineStatus}
                  onCheckedChange={(checked: boolean) => handleSettingChange('showOnlineStatus', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Izinkan Pengumpulan Data</Label>
                  <p className="text-sm text-gray-600">Membantu meningkatkan layanan dengan data penggunaan anonim</p>
                </div>
                <Switch
                  checked={settings.allowDataCollection}
                  onCheckedChange={(checked: boolean) => handleSettingChange('allowDataCollection', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                Pengaturan Keamanan
              </CardTitle>
              <CardDescription>
                Kelola fitur keamanan untuk melindungi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autentikasi Dua Faktor</Label>
                  <p className="text-sm text-gray-600">Tambahan lapisan keamanan untuk akun Anda</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked: boolean) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout Sesi (menit)</Label>
                <Select value={settings.sessionTimeout.toString()} onValueChange={(value) => handleSettingChange('sessionTimeout', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 menit</SelectItem>
                    <SelectItem value="30">30 menit</SelectItem>
                    <SelectItem value="60">1 jam</SelectItem>
                    <SelectItem value="120">2 jam</SelectItem>
                    <SelectItem value="480">8 jam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Login</Label>
                  <p className="text-sm text-gray-600">Dapatkan notifikasi saat ada aktivitas login</p>
                </div>
                <Switch
                  checked={settings.loginNotifications}
                  onCheckedChange={(checked: boolean) => handleSettingChange('loginNotifications', checked)}
                />
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full">
                  Logout dari Semua Device
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PortalPageWrapper>
  );
}

export default function SettingsPage() {
  return <SettingsPageContent />;
}