import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import StorageService from '../services/StorageService';
import { STORAGE_KEYS } from '../api/config';
import { ToastService } from '../services/ToastService';

// ============================================
// Auth Types
// ============================================

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    storeId: string;
    storeName: string;
    role: 'owner' | 'manager' | 'staff';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

// ============================================
// Auth Context
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = StorageService.getString(STORAGE_KEYS.AUTH_TOKEN);
                const savedUser = StorageService.getObject<User>(STORAGE_KEYS.USER_DATA);

                if (token && savedUser) {
                    setUser(savedUser);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);

            // TODO: Replace with actual API call
            // const response = await authApi.login(email, password);

            // Mock successful login for now
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

            // Save to storage
            StorageService.setString(STORAGE_KEYS.AUTH_TOKEN, mockToken);
            StorageService.setObject(STORAGE_KEYS.USER_DATA, mockUser);

            setUser(mockUser);
            ToastService.success({ title: 'Welcome back!', message: mockUser.storeName });

            return true;
        } catch (error) {
            ToastService.error({ title: 'Login Failed', message: 'Invalid credentials' });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        StorageService.remove(STORAGE_KEYS.AUTH_TOKEN);
        StorageService.remove(STORAGE_KEYS.USER_DATA);
        setUser(null);
        ToastService.info({ title: 'Logged out', message: 'See you soon!' });
    };

    // Update user data
    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            StorageService.setObject(STORAGE_KEYS.USER_DATA, updatedUser);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ============================================
// useAuth Hook
// ============================================

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
