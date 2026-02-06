
// ============================================
// Theme Types
// ============================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
    background: string;
    surface: string;
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

// ============================================
// Theme Colors
// ============================================

export const lightColors: ThemeColors = {
    background: '#F5F5F5',
    surface: '#FFFFFF',
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

export const darkColors: ThemeColors = {
    background: '#0A0A0A',
    surface: '#1A1A1A',
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
