import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './config';
import { storage } from '../services/StorageService';
import { STORAGE_KEYS } from './config';

// Create axios instance
const httpClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
httpClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    // Token expired - clear storage and redirect to login
                    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
                    storage.remove(STORAGE_KEYS.USER_DATA);
                    // TODO: Navigate to login
                    break;
                case 403:
                    console.error('Access denied');
                    break;
                case 500:
                    console.error('Server error');
                    break;
                default:
                    console.error('API Error:', error.message);
            }
        } else if (error.request) {
            console.error('Network error - no response received');
        }

        return Promise.reject(error);
    }
);

export default httpClient;
