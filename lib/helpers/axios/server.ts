import axios from 'axios';
import { cookies } from 'next/headers';

import { trimStringValues } from '..';

import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(async (config) => {
      // Trim request data
      if (config.data) {
        config.data = trimStringValues(config.data);
      }
      if (config.params) {
        config.params = trimStringValues(config.params);
      }

      // Get fresh token from cookie on every request
      const token = (await cookies()).get('token')?.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Trim response data
        if (response.data) {
          response.data = trimStringValues(response.data);
        }
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: 500,
    };

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      apiError.status = error.response.status;
      interface ErrorResponseData {
        message?: string;
      }
      const responseData = error.response.data as ErrorResponseData;
      apiError.message = responseData.message || error.message;
      apiError.details = error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      apiError.status = 503;
      apiError.message = 'No response received from server';
      apiError.code = 'NO_RESPONSE';
    } else {
      // Something happened in setting up the request that triggered an Error
      apiError.status = 400;
      apiError.message = error.message;
      apiError.code = 'REQUEST_SETUP_ERROR';
    }

    return apiError;
  }

  private async makeRequest<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.request<T>(config);
      return {
        data: response.data,
        error: null,
        success: true,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        data: null,
        error: apiError,
        success: false,
      };
    }
  }

  // Convenience methods with type safety
  async get<T>(url: string, config?: Omit<AxiosRequestConfig, 'url'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ ...config, url, method: 'GET' });
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: Omit<AxiosRequestConfig, 'url' | 'data'>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ ...config, url, data, method: 'POST' });
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: Omit<AxiosRequestConfig, 'url' | 'data'>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ ...config, url, data, method: 'PUT' });
  }

  async delete<T>(url: string, config?: Omit<AxiosRequestConfig, 'url'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ ...config, url, method: 'DELETE' });
  }
}

// Create and export a singleton instance
const axiosClientServer = new ApiClient();
export default axiosClientServer;
