import { Profile, ProfileFormData } from '@/types/profile';
import { mockProfiles } from '@/lib/mocks/profile';
import { ApiResponse } from '@/lib/api/types';

export class ProfileApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileApiError';
  }
}

export const ProfileAPI = {
  getProfile: async (userId: string): Promise<ApiResponse<Profile>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profile = mockProfiles.find(p => p.userId === userId);
    
    if (!profile) {
      throw new ProfileApiError('Profile not found');
    }
    
    return {
      success: true,
      data: profile,
      message: 'Profile retrieved successfully'
    };
  },

  updateProfile: async (userId: string, data: Partial<ProfileFormData>): Promise<ApiResponse<Profile>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const profileIndex = mockProfiles.findIndex(p => p.userId === userId);
    
    if (profileIndex === -1) {
      throw new ProfileApiError('Profile not found');
    }
    
    // Update the profile
    const updatedProfile: Profile = {
      ...mockProfiles[profileIndex],
      ...data,
      updatedAt: new Date().toISOString()
    } as Profile;
    
    // In a real app, this would update the database
    // For now, we'll just return the updated profile
    mockProfiles[profileIndex] = updatedProfile;
    
    return {
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    };
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
