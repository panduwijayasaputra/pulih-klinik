import axios, { AxiosInstance, AxiosError } from 'axios';

// Cache for auth token to reduce localStorage access (moved to module scope)
let cachedToken: string | null = null;
let tokenCacheTime = 0;
const TOKEN_CACHE_DURATION = 30000; // 30 seconds

// Create axios instance with base configuration
const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      // Get token from cache or localStorage
      if (typeof window !== 'undefined') {
        const now = Date.now();
        
        // Use cached token if it's still valid
        if (cachedToken && (now - tokenCacheTime) < TOKEN_CACHE_DURATION) {
          config.headers.Authorization = `Bearer ${cachedToken}`;
          return config;
        }

        // Fetch fresh token from localStorage
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          try {
            const parsed = JSON.parse(authStorage);
            const token = parsed.state?.accessToken || parsed.state?.token;
            if (token) {
              cachedToken = token;
              tokenCacheTime = now;
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.warn('Failed to parse auth storage:', error);
            cachedToken = null;
            tokenCacheTime = 0;
          }
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle 401 errors by clearing auth state
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          // Only redirect to login if we're not already on the login page or registration page
          const currentPath = window.location.pathname;
          if (currentPath !== '/login' && currentPath !== '/register') {
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const httpClient = createHttpClient();

// Function to clear token cache (useful for logout)
export const clearTokenCache = () => {
  if (typeof window !== 'undefined') {
    cachedToken = null;
    tokenCacheTime = 0;
  }
};
export const apiClient = httpClient;

// Helper function to handle API responses
export const handleApiResponse = <T>(response: any): T => {
  if (response.data?.success === false) {
    throw new Error(response.data.message || 'API Error');
  }
  return response.data;
};

// Helper function to handle API errors
export const handleApiError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
  throw error;
};