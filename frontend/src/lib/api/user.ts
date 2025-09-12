import { apiClient } from '../http-client';
import { StatusResponse } from './types';
import { UserStatusEnum } from '@/types/status';

export interface UserStatusUpdateData {
  status: UserStatusEnum;
  reason?: string;
}

export interface UserStatusUpdateResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    status: UserStatusEnum;
  };
}

export class UserAPI {
  /**
   * Update user active status (admin only)
   */
  static async updateUserStatus(
    userId: string,
    data: UserStatusUpdateData,
  ): Promise<UserStatusUpdateResponse> {
    try {
      console.log('UserAPI.updateUserStatus called with:', { userId, data });
      const response = await apiClient.put(`/users/${userId}/status`, data);
      console.log('UserAPI.updateUserStatus response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('UserAPI.updateUserStatus error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user status',
        data: {
          id: userId,
          email: '',
          status: UserStatusEnum.INACTIVE,
        },
      };
    }
  }

  /**
   * Send email verification to user
   */
  static async sendEmailVerification(userId: string): Promise<StatusResponse> {
    try {
      const response = await apiClient.post(`/users/${userId}/send-verification`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send email verification',
      };
    }
  }
}
