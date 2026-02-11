import { environment } from "../../env/environment";

// Utility function to build query string from params
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) return '';

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  queryParams?: Record<string, unknown>;
}

// Core API Client Class
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    const { queryParams, body, ...restOptions } = options;
    const queryString = buildQueryString(queryParams);
    const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}${queryString}`;

    const config: RequestInit = {
      credentials: 'include',
      headers: {
        ...(body instanceof FormData ? {} : this.defaultHeaders),
        ...restOptions.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...restOptions,
    };

    // Set body if provided
    if (body !== undefined) {
      config.body = body;
    }

    // Handle body serialization
    if (
      config.body &&
      typeof config.body === 'object' &&
      !(config.body instanceof FormData)
    ) {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);

    // Handle authentication
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    // Handle errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: any = {
        message: errorData.message || `HTTP error! status: ${response.status}`,
        code: errorData.code || 'HTTP_ERROR',
        status: response.status,
        details: errorData.details,
      };
      throw error;
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    return response.json();
  }
}

// Global API client instance
export const api = new ApiClient(environment.apiUrl);