// ============================================
// App Constants
// ============================================

export const COLORS = {
    primary: '#2874F0',
    secondary: '#FB641B',
    success: '#388E3C',
    warning: '#F57C00',
    danger: '#D32F2F',

    // Gradients (start, end)
    gradientBlue: ['#667eea', '#764ba2'],
    gradientOrange: ['#f093fb', '#f5576c'],
    gradientGreen: ['#4facfe', '#00f2fe'],
    gradientPurple: ['#a18cd1', '#fbc2eb'],
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 18,
    xxl: 48,
};

export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export const FONT_SIZES = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
};

// Order status colors
export const ORDER_STATUS_COLORS = {
    pending: '#F57C00',
    confirmed: '#2874F0',
    processing: '#9C27B0',
    delivered: '#388E3C',
    cancelled: '#D32F2F',
};

// Stock level thresholds
export const STOCK_LEVELS = {
    LOW: 10,
    MEDIUM: 50,
    HIGH: 100,
};
