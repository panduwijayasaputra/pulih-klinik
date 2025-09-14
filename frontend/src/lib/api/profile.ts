import { Profile, ProfileFormData } from '@/types/profile';
import { ApiResponse } from '@/lib/api/types';
import { httpClient, handleApiResponse, handleApiError } from '@/lib/http-client';

// Backend API response types
interface UserProfileApiResponse {
  id: string;
  email: string;
  status: string;
  profile: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
    bio?: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
  roles: Array<{
    id: string;
    role: string;
    createdAt: string;
  }>;
  clinicId?: string;
  clinicName?: string;
}

interface ProfileUpdateApiResponse {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export class ProfileApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileApiError';
  }
}

export const ProfileAPI = {
  getProfile: async (userId: string): Promise<ApiResponse<Profile>> => {
    try {
      const response = await httpClient.get(`/users/${userId}/profile`);
      const result = handleApiResponse<{ data: UserProfileApiResponse; message?: string }>(response);
      
      // Map backend response to frontend Profile type
      const profile: Profile = {
        id: result.data.profile.id,
        userId: result.data.id,
        name: result.data.profile.name,
        email: result.data.email,
        ...(result.data.profile.phone && { phone: result.data.profile.phone }),
        ...(result.data.profile.address && { address: result.data.profile.address }),
        ...(result.data.profile.bio && { bio: result.data.profile.bio }),
        ...(result.data.profile.avatarUrl && { avatar: result.data.profile.avatarUrl }),
        createdAt: result.data.profile.createdAt,
        updatedAt: result.data.profile.updatedAt
      };
      
      return {
        success: true,
        data: profile,
        message: result.message || 'Profile retrieved successfully'
      };
    } catch (error) {
      handleApiError(error);
      throw new ProfileApiError('Failed to fetch profile');
    }
  },

  updateProfile: async (userId: string, data: Partial<ProfileFormData>): Promise<ApiResponse<Profile>> => {
    try {
      const response = await httpClient.put(`/users/${userId}/profile`, data);
      const result = handleApiResponse<{ data: ProfileUpdateApiResponse; message?: string }>(response);
      
      // Map backend response to frontend Profile type
      const profile: Profile = {
        id: result.data.id,
        userId: userId, // Use the userId parameter since it's not in the update response
        name: result.data.name,
        email: '', // Email is not returned in update response, will need to be handled separately
        ...(result.data.phone && { phone: result.data.phone }),
        ...(result.data.address && { address: result.data.address }),
        ...(result.data.bio && { bio: result.data.bio }),
        ...(result.data.avatarUrl && { avatar: result.data.avatarUrl }),
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt
      };
      
      return {
        success: true,
        data: profile,
        message: result.message || 'Profile updated successfully'
      };
    } catch (error) {
      handleApiError(error);
      throw new ProfileApiError('Failed to update profile');
    }
  },

  uploadAvatar: async (userId: string, file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock file upload - in real app, this would upload to cloud storage
    const avatarUrl = `https://example.com/avatars/${userId}-${Date.now()}.jpg`;
    
    return {
      success: true,
      data: { avatarUrl },
      message: 'Avatar uploaded successfully'
    };
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock password validation
    if (currentPassword === 'wrongpassword') {
      throw new ProfileApiError('Current password is incorrect');
    }
    
    return {
      success: true,
      data: null,
      message: 'Password changed successfully'
    };
  }
};
