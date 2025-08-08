'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClinic } from '@/hooks/useClinic';
import { ClinicBranding } from '@/types/clinic';
import { 
  PaintBrushIcon,
  SwatchIcon,
  EyeIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface ClinicBrandingProps {
  className?: string;
}

const PRESET_COLORS = [
  { name: 'Biru Profesional', primary: '#3B82F6', secondary: '#1E40AF' },
  { name: 'Hijau Tenang', primary: '#10B981', secondary: '#047857' },
  { name: 'Ungu Mewah', primary: '#8B5CF6', secondary: '#5B21B6' },
  { name: 'Merah Dinamis', primary: '#EF4444', secondary: '#B91C1C' },
  { name: 'Oranye Hangat', primary: '#F59E0B', secondary: '#D97706' },
  { name: 'Teal Modern', primary: '#14B8A6', secondary: '#0F766E' },
  { name: 'Pink Lembut', primary: '#EC4899', secondary: '#BE185D' },
  { name: 'Indigo Elegan', primary: '#6366F1', secondary: '#4338CA' }
];

const FONT_OPTIONS = [
  { name: 'Inter', label: 'Inter (Modern)' },
  { name: 'Poppins', label: 'Poppins (Friendly)' },
  { name: 'Roboto', label: 'Roboto (Clean)' },
  { name: 'Open Sans', label: 'Open Sans (Classic)' },
  { name: 'Montserrat', label: 'Montserrat (Bold)' },
  { name: 'Lato', label: 'Lato (Professional)' }
];

export const ClinicBrandingComponent: React.FC<ClinicBrandingProps> = ({ className = '' }) => {
  const { clinic, isLoading, error, updateBranding, clearError } = useClinic();
  const [isEditing, setIsEditing] = useState(false);
  const [brandingData, setBrandingData] = useState<ClinicBranding>({
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    fontFamily: 'Inter'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Initialize branding data when clinic data is loaded
  useEffect(() => {
    if (clinic?.branding) {
      setBrandingData(clinic.branding);
    }
  }, [clinic]);

  const handleColorChange = (field: keyof Pick<ClinicBranding, 'primaryColor' | 'secondaryColor'>, color: string) => {
    setBrandingData(prev => ({
      ...prev,
      [field]: color
    }));
  };

  const handlePresetColorSelect = (preset: typeof PRESET_COLORS[0]) => {
    setBrandingData(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    }));
  };

  const handleFontChange = (fontFamily: string) => {
    setBrandingData(prev => ({
      ...prev,
      fontFamily
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await updateBranding(brandingData);
    
    if (success) {
      setIsEditing(false);
    }
    
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (clinic?.branding) {
      setBrandingData(clinic.branding);
    }
    setIsEditing(false);
    setPreviewMode(false);
    clearError();
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 59, g: 130, b: 246 };
  };

  const generateCssVars = () => {
    const primaryRgb = hexToRgb(brandingData.primaryColor);
    const secondaryRgb = hexToRgb(brandingData.secondaryColor);
    
    return {
      '--clinic-primary': brandingData.primaryColor,
      '--clinic-secondary': brandingData.secondaryColor,
      '--clinic-primary-rgb': `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`,
      '--clinic-secondary-rgb': `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`,
      '--clinic-font': brandingData.fontFamily
    } as React.CSSProperties;
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

  return (
    <Card className={className} style={previewMode ? generateCssVars() : undefined}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PaintBrushIcon className="w-6 h-6 text-purple-600" />
            <div>
              <CardTitle>Branding Klinik</CardTitle>
              <CardDescription>
                Kustomisasi tampilan dan identitas visual klinik Anda
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              size="sm"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              {previewMode ? 'Normal' : 'Preview'}
            </Button>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <PaintBrushIcon className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
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
          {/* Color Presets */}
          {isEditing && (
            <div className="space-y-3">
              <Label>Tema Warna Cepat</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PRESET_COLORS.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePresetColorSelect(preset)}
                    className={`p-3 rounded-lg border-2 text-left hover:shadow-md transition-all ${
                      brandingData.primaryColor === preset.primary && brandingData.secondaryColor === preset.secondary
                        ? 'border-blue-500 shadow-md'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-900">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Color */}
            <div className="space-y-3">
              <Label>Warna Utama</Label>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                  style={{ backgroundColor: brandingData.primaryColor }}
                  onClick={() => isEditing && document.getElementById('primary-color')?.click()}
                />
                <div className="flex-1">
                  <Input
                    id="primary-color"
                    type="color"
                    value={brandingData.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    disabled={!isEditing}
                    className="hidden"
                  />
                  <Input
                    value={brandingData.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    disabled={!isEditing}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Warna utama untuk tombol, header, dan aksen penting
              </p>
            </div>

            {/* Secondary Color */}
            <div className="space-y-3">
              <Label>Warna Sekunder</Label>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                  style={{ backgroundColor: brandingData.secondaryColor }}
                  onClick={() => isEditing && document.getElementById('secondary-color')?.click()}
                />
                <div className="flex-1">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={brandingData.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    disabled={!isEditing}
                    className="hidden"
                  />
                  <Input
                    value={brandingData.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    disabled={!isEditing}
                    placeholder="#1E40AF"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Warna untuk hover states dan aksen sekunder
              </p>
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-3">
            <Label>Font Klinik</Label>
            <Select
              value={brandingData.fontFamily}
              onValueChange={handleFontChange}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem key={font.name} value={font.name}>
                    <div style={{ fontFamily: font.name }}>
                      {font.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Pilih font yang mencerminkan kepribadian klinik Anda
            </p>
          </div>

          {/* Preview Section */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <SwatchIcon className="w-4 h-4" />
              <span>Preview Branding</span>
            </Label>
            <div 
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg"
              style={{
                fontFamily: brandingData.fontFamily,
                backgroundColor: `${brandingData.primaryColor}15`
              }}
            >
              <div className="space-y-4">
                <div 
                  className="inline-block px-4 py-2 rounded-md text-white font-medium"
                  style={{ backgroundColor: brandingData.primaryColor }}
                >
                  {clinic.name}
                </div>
                <div className="space-y-2">
                  <h3 
                    className="text-lg font-semibold"
                    style={{ color: brandingData.secondaryColor }}
                  >
                    Selamat datang di {clinic.name}
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: brandingData.fontFamily }}>
                    Klinik hipnoterapi terpercaya dengan layanan profesional dan tim therapist berpengalaman.
                  </p>
                  <button
                    className="px-4 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: brandingData.secondaryColor }}
                  >
                    Jadwalkan Sesi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Branding Info */}
          {!isEditing && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-900">Branding Saat Ini</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Warna Utama</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: brandingData.primaryColor }}
                    />
                    <span className="font-mono">{brandingData.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Warna Sekunder</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: brandingData.secondaryColor }}
                    />
                    <span className="font-mono">{brandingData.secondaryColor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Font</p>
                  <p className="font-medium mt-1" style={{ fontFamily: brandingData.fontFamily }}>
                    {brandingData.fontFamily}
                  </p>
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
                {isSubmitting ? 'Menyimpan...' : 'Simpan Branding'}
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