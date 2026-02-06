// ═══════════════════════════════════════════════════════════
// HTTP Client - Production Grade with Interceptors
// ═══════════════════════════════════════════════════════════

import axios, {
    AxiosInstance,
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, API_CONFIG, STORAGE_KEYS, HTTP_STATUS } from './config';
import { storage } from '../services/StorageService';

// Types
interface QueueItem {
    resolve: (token: string) => void;
    reject: (error: Error) => void;
}

// State for token refresh
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

// Process failed queue after token refresh
const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((item) => {
        if (error) {
            item.reject(error);
        } else if (token) {
            item.resolve(token);
        }
    });
    failedQueue = [];
};

// Create axios instance
const httpClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ═══════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR
// ═══════════════════════════════════════════════════════════
httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add auth token
        const token = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for logging
        (config as any).metadata = { startTime: Date.now() };

        // Log request in dev
        if (__DEV__) {
            console.log(` [API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error: AxiosError) => {
        if (__DEV__) {
            console.error(' [Request Error]', error.message);
        }
        return Promise.reject(error);
    }
);

// ═══════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR
// ═══════════════════════════════════════════════════════════
httpClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Calculate response time
        const duration = Date.now() - ((response.config as any).metadata?.startTime || 0);

        if (__DEV__) {
            console.log(
                ` [API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`
            );
        }

        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Calculate response time for error
        const duration = Date.now() - ((originalRequest as any).metadata?.startTime || 0);

        if (__DEV__) {
            console.error(
                ` [API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - ${error.response?.status || 'Network Error'} (${duration}ms)`,
                error.response?.data || error.message
            );
        }

        // Handle specific error codes
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case HTTP_STATUS.UNAUTHORIZED:
                    // Token expired - try refresh
                    if (!originalRequest._retry) {
                        if (isRefreshing) {
                            // Wait for token refresh
                            return new Promise((resolve, reject) => {
                                failedQueue.push({ resolve, reject });
                            })
                                .then((token) => {
                                    if (originalRequest.headers) {
                                        originalRequest.headers.Authorization = `Bearer ${token}`;
                                    }
                                    return httpClient(originalRequest);
                                })
                                .catch((err) => Promise.reject(err));
                        }

                        originalRequest._retry = true;
                        isRefreshing = true;

                        // Try to refresh token
                        try {
                            // For now, just logout on 401
                            // TODO: Implement refresh token logic
                        storage.remove(STORAGE_KEYS.AUTH_TOKEN);
                        storage.remove(STORAGE_KEYS.USER_DATA);
                            
                            // Emit logout event
                            // eventEmitter.emit('LOGOUT');
                        } catch (refreshError) {
                            processQueue(refreshError as Error, null);
                            return Promise.reject(refreshError);
                        } finally {
                            isRefreshing = false;
                        }
                    }
                    break;

                case HTTP_STATUS.FORBIDDEN:
                    // Access denied
                    break;

                case HTTP_STATUS.NOT_FOUND:
                    // Resource not found
                    break;

                case HTTP_STATUS.TOO_MANY_REQUESTS:
                    // Rate limited - could implement retry with backoff
                    break;

                case HTTP_STATUS.INTERNAL_ERROR:
                case HTTP_STATUS.SERVICE_UNAVAILABLE:
                    // Server error - could implement retry
                    break;
            }
        } else if (error.request) {
            // Network error - no response received
            console.error('🌐 [Network Error] No response received');
        }

        return Promise.reject(error);
    }
);

export default httpClient;

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Set auth token for all future requests
 */
export const setAuthToken = (token: string): void => {
    storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Clear auth token
 */
export const clearAuthToken = (): void => {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Check if user has valid token
 */
export const hasAuthToken = (): boolean => {
    return !!storage.getString(STORAGE_KEYS.AUTH_TOKEN);
};
