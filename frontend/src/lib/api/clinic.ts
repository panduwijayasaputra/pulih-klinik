import { 
  ClinicBranding, 
  ClinicDocument, 
  ClinicProfile,
  ClinicProfileFormData,
  ClinicSettings 
} from '@/types/clinic';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

class ClinicApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ClinicApiError';
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = 'Terjadi kesalahan pada server';
    let errorCode = response.status.toString();
    let errorDetails;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      errorCode = errorData.code || errorCode;
      errorDetails = errorData.details;
    } catch {
      // If can't parse error response, use default message
    }

    throw new ClinicApiError(errorMessage, errorCode, errorDetails);
  }

  const data: ApiResponse<T> = await response.json();
  
  if (!data.success) {
    throw new ClinicApiError(data.error || 'Operasi tidak berhasil');
  }

  if (!data.data) {
    throw new ClinicApiError('Data tidak ditemukan');
  }

  return data.data;
};

/**
 * Fetch clinic profile data
 */
export const getClinicProfile = async (): Promise<ClinicProfile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clinic/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    return await handleApiResponse<ClinicProfile>(response);
  } catch (error) {
    if (error instanceof ClinicApiError) {
      throw error;
    }
    throw new ClinicApiError('Gagal mengambil data profil klinik');
  }
};

/**
 * Update clinic profile
 */
export const updateClinicProfile = async (
  profileData: ClinicProfileFormData
): Promise<ClinicProfile> => {
  try {
    // Prepare form data for file upload
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', profileData.name);
    formData.append('address', profileData.address);
    formData.append('phone', profileData.phone);
    formData.append('email', profileData.email);
    
    if (profileData.website) {
      formData.append('website', profileData.website);
    }
    
    if (profileData.description) {
      formData.append('description', profileData.description);
    }
    
    if (profileData.workingHours) {
      formData.append('workingHours', profileData.workingHours);
    }

    // Add logo file if provided
    if (profileData.logo) {
      formData.append('logo', profileData.logo);
    }

    const response = await fetch(`${API_BASE_URL}/clinic/profile`, {
      method: 'PUT',
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData,
    });

    return await handleApiResponse<ClinicProfile>(response);
  } catch (error) {
    if (error instanceof ClinicApiError) {
      throw error;
    }
    throw new ClinicApiError('Gagal memperbarui profil klinik');
  }
};

/**
 * Upload clinic logo
 */
export const uploadClinicLogo = async (logoFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('logo', logoFile);

    const response = await fetch(`${API_BASE_URL}/clinic/logo`, {
      method: 'POST',
      headers: {
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData,
    });

    const result = await handleApiResponse<{ logoUrl: string }>(response);
    return result.logoUrl;
  } catch (error) {
    if (error instanceof ClinicApiError) {
      throw error;
    }
    throw new ClinicApiError('Gagal mengunggah logo klinik');
  }
};

/**
 * Update clinic branding settings
 */
export const updateClinicBranding = async (
  brandingData: ClinicBranding
): Promise<ClinicBranding> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clinic/branding`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(brandingData),
    });

    return await handleApiResponse<ClinicBranding>(response);
  } catch (error) {
    if (error instanceof ClinicApiError) {
      throw error;
    }
    throw new ClinicApiError('Gagal memperbarui branding klinik');
  }
};

/**
 * Update clinic settings
 */
export const updateClinicSettings = async (
  settingsData: ClinicSettings
): Promise<ClinicSettings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clinic/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(settingsData),
    });

    return await handleApiResponse<ClinicSettings>(response);
  } catch (error) {
    if (error instanceof ClinicApiError) {
      throw error;
    }
    throw new ClinicApiError('Gagal memperbarui pengaturan klinik');
  }
};

/**
 * Get clinic documents
 */
export const getClinicDocuments = async (): Promise<ClinicDocument[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clinic/documents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    return await handleApiResponse<ClinicDocument[]>(response);
  } catch (error) {
    if (error instanceof ClinicApiError) {
      throw error;
    }
    throw new ClinicApiError('Gagal mengambil daftar dokumen');
  }
};

/**
 * Upload clinic document
 */
export const uploadClinicDocument = async (
  file: File,
  documentType: ClinicDocument['type'],
  description?: string
): Promise<ClinicDocument> => {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);
    
    if (description) {
      formData.append('description', description);
    }

    const response = await fetch(`${API_BASE_URL}/clinic/documents`, {
      method: 'POST',
      headers: {
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData,
    });

    return await handleApiResponse<ClinicDocument>(response);
  } catch (error) {
    if (error instanceof ClinicApiError) {
      throw error;
    }
    throw new ClinicApiError('Gagal mengunggah dokumen');
  }
};

/**
 * Delete clinic document
 */
export const deleteClinicDocument = async (documentId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clinic/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    await handleApiResponse<void>(response);
  } catch (error) {
    if (error instanceof ClinicApiError) {
      throw error;
    }
    throw new ClinicApiError('Gagal menghapus dokumen');
  }
};

/**
 * Download clinic document
 */
export const downloadClinicDocument = async (
  documentId: string,
  fileName: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clinic/documents/${documentId}/download`, {
      method: 'GET',
      headers: {
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      throw new ClinicApiError('Gagal mengunduh dokumen');
    }

    // Create blob from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof ClinicApiError) {
      throw error;
    }
    throw new ClinicApiError('Gagal mengunduh dokumen');
  }
};

// Export the error class for use in components
export { ClinicApiError };

// Export types for API responses
export type { ApiResponse, ApiError };