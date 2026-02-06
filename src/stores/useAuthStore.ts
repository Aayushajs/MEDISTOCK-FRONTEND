// ═══════════════════════════════════════════════════════════
// Auth Store - Production Grade with Zustand
// ═══════════════════════════════════════════════════════════

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authApi } from '../api/services/authApi';
import StorageService from '../services/StorageService';
import type { User, LoginRequest, RegisterRequest, ApiErrorResponse } from '../api/types';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface AuthState {
    // State
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginRequest) => Promise<boolean>;
    logout: () => Promise<void>;
    initialize: () => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    updateUser: (user: Partial<User>) => void;
}

// ═══════════════════════════════════════════════════════════
// STORAGE ADAPTER (MMKV)
// ═══════════════════════════════════════════════════════════

const zustandStorage = {
    getItem: (name: string) => {
        const value = StorageService.getString(name);
        return value ? Promise.resolve(value) : Promise.resolve(null);
    },
    setItem: (name: string, value: string) => {
        StorageService.setString(name, value);
        return Promise.resolve();
    },
    removeItem: (name: string) => {
        StorageService.remove(name);
        return Promise.resolve();
    },
};

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Extract error message from API error response
 */
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        // Check for axios error with response
        const axiosError = error as any;
        if (axiosError.response?.data) {
            const apiError = axiosError.response.data as ApiErrorResponse;
            return apiError.message || 'An error occurred';
        }
        return error.message;
    }
    return 'An unexpected error occurred';
};

// ═══════════════════════════════════════════════════════════
// AUTH STORE
// ═══════════════════════════════════════════════════════════

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,
            error: null,

            /**
             * Initialize auth state from storage
             * Called on app startup
             */
            initialize: () => {
                const storedUser = authApi.getStoredUser();
                const isAuthenticated = authApi.isAuthenticated();

                set({
                    user: storedUser,
                    isAuthenticated: isAuthenticated && !!storedUser,
                    isInitialized: true,
                });
            },

            /**
             * Login with email and password
             * Returns true on success, false on failure
             */
            login: async (credentials: LoginRequest): Promise<boolean> => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authApi.login(credentials);

                    if (response.success && response.data) {
                        const { user, token } = response.data;

                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });

                        return true;
                    } else {
                        set({
                            isLoading: false,
                            error: response.message || 'Login failed',
                        });
                        return false;
                    }
                } catch (error) {
                    const errorMessage = getErrorMessage(error);
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    return false;
                }
            },

            /**
             * Logout user and clear all auth data
             */
            logout: async () => {
                set({ isLoading: true });

                try {
                    await authApi.logout();
                } catch (error) {
                    // Ignore logout errors
                    console.warn('Logout error:', error);
                } finally {
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                }
            },

            /**
             * Set error message
             */
            setError: (error: string | null) => set({ error }),

            /**
             * Clear error message
             */
            clearError: () => set({ error: null }),

            /**
             * Update user data locally
             */
            updateUser: (userData: Partial<User>) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: { ...currentUser, ...userData },
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => zustandStorage),
            // Only persist these fields
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// ═══════════════════════════════════════════════════════════
// SELECTORS - Optimized subscriptions
// ═══════════════════════════════════════════════════════════

export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectIsInitialized = (state: AuthState) => state.isInitialized;
export const selectAuthError = (state: AuthState) => state.error;
export const selectUserRole = (state: AuthState) => state.user?.role;
export const selectUserName = (state: AuthState) => state.user?.name;
export const selectUserEmail = (state: AuthState) => state.user?.email;
export const selectUserProfileImage = (state: AuthState) => state.user?.ProfileImage?.[0];

// Compound selectors
export const selectAuthState = (state: AuthState) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
});

