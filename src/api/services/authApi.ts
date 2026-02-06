// ═══════════════════════════════════════════════════════════
// Auth API Service - Production Grade
// ═══════════════════════════════════════════════════════════

import httpClient, { setAuthToken, clearAuthToken } from '../httpClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config';
import { storage } from '../../services/StorageService';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    UpdateProfileRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ApiResponse,
    User,
} from '../types';

/**
 * Auth API Service
 * Handles all authentication related API calls
 */
export const authApi = {
    /**
     * Login user with email and password
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await httpClient.post<LoginResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        
        // Store token and user data on successful login
        if (response.data.success && response.data.data) {
            const { token, user } = response.data.data;
            setAuthToken(token);
            storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        }
        
        return response.data;
    },

    /**
     * Register new user
     */
    register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
        const response = await httpClient.post<RegisterResponse>(
            API_ENDPOINTS.AUTH.REGISTER,
            userData
        );
        
        // Store token and user data on successful registration
        if (response.data.success && response.data.data) {
            const { token, user } = response.data.data;
            setAuthToken(token);
            storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        }
        
        return response.data;
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        try {
            await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            // Ignore logout API errors - clear local data anyway
            console.warn('Logout API failed, clearing local data');
        } finally {
            clearAuthToken();
            storage.remove(STORAGE_KEYS.USER_DATA);
            storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        }
    },

    /**
     * Get current user profile
     */
    getProfile: async (): Promise<ApiResponse<User>> => {
        const response = await httpClient.get<ApiResponse<User>>(
            API_ENDPOINTS.AUTH.PROFILE
        );
        return response.data;
    },

    /**
     * Update user profile
     */
    updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<User>> => {
        const response = await httpClient.put<ApiResponse<User>>(
            API_ENDPOINTS.AUTH.UPDATE_PROFILE,
            data
        );
        
        // Update stored user data
        if (response.data.success && response.data.data) {
            storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.data));
        }
        
        return response.data;
    },

    /**
     * Request password reset OTP
     */
    forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
        const response = await httpClient.post<ApiResponse<{ message: string }>>(
            API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
            data
        );
        return response.data;
    },

    /**
     * Reset password with OTP
     */
    resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
        const response = await httpClient.post<ApiResponse<{ message: string }>>(
            API_ENDPOINTS.AUTH.RESET_PASSWORD,
            data
        );
        return response.data;
    },

    /**
     * Verify OTP
     */
    verifyOtp: async (email: string, otp: string): Promise<ApiResponse<{ verified: boolean }>> => {
        const response = await httpClient.post<ApiResponse<{ verified: boolean }>>(
            API_ENDPOINTS.AUTH.VERIFY_OTP,
            { email, otp }
        );
        return response.data;
    },

    /**
     * Update FCM token for push notifications
     */
    updateFcmToken: async (fcmToken: string): Promise<ApiResponse<{ message: string }>> => {
        const response = await httpClient.put<ApiResponse<{ message: string }>>(
            API_ENDPOINTS.AUTH.UPDATE_FCM_TOKEN,
            { fcmToken }
        );
        return response.data;
    },

    /**
     * Get stored user from local storage
     */
    getStoredUser: (): User | null => {
        const userData = storage.getString(STORAGE_KEYS.USER_DATA);
        if (userData) {
            try {
                return JSON.parse(userData) as User;
            } catch {
                return null;
            }
        }
        return null;
    },

    /**
     * Check if user is authenticated (has valid token)
     */
    isAuthenticated: (): boolean => {
        return !!storage.getString(STORAGE_KEYS.AUTH_TOKEN);
    },
};

export default authApi;
