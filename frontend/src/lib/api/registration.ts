import { ItemResponse, StatusResponse } from './types';

export interface RegistrationData {
  clinic?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    description?: string;
    workingHours?: string;
  };
  payment?: {
    subscriptionTier: string;
    paymentMethod: string;
    billingCycle: 'monthly' | 'yearly';
  };
}

export interface RegistrationStatus {
  registrationId: string;
  status: string;
  currentStep: string;
  completedSteps: string[];
}

export interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed';
  subscriptionId?: string;
}

export class RegistrationAPI {
  static async startRegistration(email: string): Promise<ItemResponse<RegistrationStatus>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async submitClinicData(registrationId: string, clinicData: RegistrationData['clinic']): Promise<ItemResponse<RegistrationStatus>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async submitVerificationDocuments(registrationId: string, documents: File[]): Promise<ItemResponse<RegistrationStatus>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async processPayment(registrationId: string, paymentData: RegistrationData['payment']): Promise<ItemResponse<PaymentStatus>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async completeRegistration(registrationId: string, subscriptionId: string): Promise<ItemResponse<RegistrationStatus>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async getRegistrationStatus(registrationId: string): Promise<ItemResponse<RegistrationStatus>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async validatePaymentMethod(paymentMethod: string): Promise<ItemResponse<boolean>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async resendVerificationEmail(email: string): Promise<StatusResponse> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async cancelRegistration(registrationId: string): Promise<StatusResponse> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }
}