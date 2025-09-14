import { useCallback, useEffect, useState } from 'react';
import { Profile, ProfileFormData } from '@/types/profile';
import { ProfileAPI } from '@/lib/api/profile';

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProfileAPI.getProfile(userId);
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      setProfile(null); // Explicitly set profile to null when error occurs
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(async (data: Partial<ProfileFormData>) => {
    if (!userId) throw new Error('User ID is required');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProfileAPI.updateProfile(userId, data);
      if (response.success && response.data) {
        setProfile(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!userId) throw new Error('User ID is required');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProfileAPI.uploadAvatar(userId, file);
      if (response.success && response.data) {
        // Update the profile with new avatar URL
        setProfile(prev => prev ? { ...prev, avatar: response.data!.avatarUrl } : null);
        return response.data!.avatarUrl;
      } else {
        throw new Error(response.message || 'Failed to upload avatar');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!userId) throw new Error('User ID is required');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProfileAPI.changePassword(userId, currentPassword, newPassword);
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load profile on mount
  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId, loadProfile]);

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    uploadAvatar,
    changePassword,
    setError
  };
};
