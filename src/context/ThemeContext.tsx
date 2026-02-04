import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import StorageService from '../services/StorageService';
import { STORAGE_KEYS } from '../api/config';

// ============================================
// Theme Types
// ============================================

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
}

interface ThemeContextType {
    theme: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

// ============================================
// Theme Colors
// ============================================

const lightColors: ThemeColors = {
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E0E0E0',
    primary: '#2874F0',
    secondary: '#FB641B',
    success: '#388E3C',
    warning: '#F57C00',
    danger: '#D32F2F',
};

const darkColors: ThemeColors = {
    background: '#0A0A0A',
    card: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#333333',
    primary: '#5B9BF5',
    secondary: '#FF8A50',
    success: '#66BB6A',
    warning: '#FFB74D',
    danger: '#EF5350',
};

// ============================================
// Theme Context
// ============================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<ThemeMode>('system');

    // Load saved theme on mount
    useEffect(() => {
        const savedTheme = StorageService.getString(STORAGE_KEYS.THEME) as ThemeMode;
        if (savedTheme) {
            setThemeState(savedTheme);
        }
    }, []);

    // Determine if dark mode based on theme setting
    const isDark = theme === 'system'
        ? systemColorScheme === 'dark'
        : theme === 'dark';

    // Get colors based on theme
    const colors = isDark ? darkColors : lightColors;

    // Set theme and save to storage
    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        StorageService.setString(STORAGE_KEYS.THEME, newTheme);
    };

    // Toggle between light and dark
    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, colors, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// ============================================
// useTheme Hook
// ============================================

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
