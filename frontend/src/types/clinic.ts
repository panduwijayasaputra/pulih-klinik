export interface ClinicBranding {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface ClinicNotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface ClinicSettings {
  timezone: string;
  language: string;
  notifications: ClinicNotificationSettings;
}

export interface ClinicDocument {
  id: string;
  name: string;
  type: 'license' | 'certificate' | 'insurance' | 'tax' | 'other';
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  url: string;
  description?: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  description?: string;
  branding: ClinicBranding;
  settings: ClinicSettings;
  documents?: ClinicDocument[];

  subscriptionTier: 'beta' | 'alpha' | 'theta' | 'delta';
  createdAt: string;
  updatedAt: string;
}

export interface ClinicFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  logo?: File;
}