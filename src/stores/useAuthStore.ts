import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import StorageService from '../services/StorageService';
import { STORAGE_KEYS } from '../api/config';
import { ToastService } from '../services/ToastService';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    storeId: string;
    storeName: string;
    role: 'owner' | 'manager' | 'staff';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    checkAuth: () => Promise<void>;
}

const storage = {
    getItem: (name: string) => {
        const value = StorageService.getString(name);
        return value ? Promise.resolve(value) : null;
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

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,

            checkAuth: async () => {
                // With Zustand persist, state is rehydrated automatically.
                // However, we might want to validate the token with the backend here.
                set({ isLoading: false });
            },

            login: async (email, password) => {
                try {
                    set({ isLoading: true });

                    // TODO: Replace with actual API call
                    // const response = await authApi.login(email, password);

                    // Mock successful login
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(() => resolve(true), 1000));

                    const mockUser: User = {
                        id: '1',
                        name: 'Store Owner',
                        email: email,
                        phone: '+91 9876543210',
                        storeId: 'store-1',
                        storeName: 'MediCare Pharmacy',
                        role: 'owner',
                    };

                    const mockToken = 'mock-jwt-token-xyz';

                    // Token is stored via persist middleware if we include it in state, 
                    // or we handle it separately if we want to keep it out of the general store.
                    // For now, let's assume the persist middleware handles the state sync, 
                    // but we might want to explicitly set the token in StorageService for axios interceptors.
                    StorageService.setString(STORAGE_KEYS.AUTH_TOKEN, mockToken);

                    set({
                        user: mockUser,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    ToastService.success({ title: 'Welcome back!', message: mockUser.storeName });
                    return true;
                } catch (error) {
                    set({ isLoading: false });
                    ToastService.error({ title: 'Login Failed', message: 'Invalid credentials' });
                    return false;
                }
            },

            logout: () => {
                StorageService.remove(STORAGE_KEYS.AUTH_TOKEN);
                set({ user: null, isAuthenticated: false });
                ToastService.info({ title: 'Logged out', message: 'See you soon!' });
            },

            updateUser: (updates) => {
                const { user } = get();
                if (user) {
                    set({ user: { ...user, ...updates } });
                }
            },
        }),
        {
            name: 'auth-storage', // unique name
            storage: createJSONStorage(() => storage),
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // Only persist user and auth status, not loading
        }
    )
);
