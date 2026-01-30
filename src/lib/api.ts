/**
 * Centralized API client with axios
 * Features:
 * - Automatic error handling
 * - Request/response interceptors
 * - Retry logic for failed requests
 * - Cookie-based authentication support
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import config from '@/config/env';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and token handling
api.interceptors.request.use(
  (requestConfig) => {
    if (config.isDev) {
      console.log(`[API] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh the session
      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message = getErrorMessage(error);
    console.error(`[API Error] ${message}`);

    return Promise.reject(error);
  }
);

// Helper to extract error message from various error formats
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Server responded with an error
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    // Network error or timeout
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    if (!error.response) {
      return 'Network error. Please check your connection.';
    }
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Retry wrapper for critical operations
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error) && error.response?.status !== 401) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export default api;
