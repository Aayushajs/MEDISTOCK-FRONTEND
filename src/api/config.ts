// ═══════════════════════════════════════════════════════════
// API Configuration - Production Grade
// ═══════════════════════════════════════════════════════════

// Environment Detection
//const __DEV__ = process.env.NODE_ENV === 'development';

// Environment-specific URLs
const ENVIRONMENTS = {
    development: 'https://phrma-production-app-backend-main-tld3.onrender.com',
    staging: 'https://phrma-staging-backend.onrender.com',
    production: 'https://phrma-production-app-backend-main-tld3.onrender.com',
} as const;

// Current environment - change for different builds
const CURRENT_ENV: keyof typeof ENVIRONMENTS = __DEV__ ? 'development' : 'production';

// API Configuration
export const API_CONFIG = {
    BASE_URL: ENVIRONMENTS[CURRENT_ENV],
    API_VERSION: 'v1',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
} as const;

// Full API Base URL
export const API_BASE_URL = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}`;

// App Configuration
export const APP_CONFIG = {
    APP_NAME: 'MediStore Pro',
    VERSION: '1.0.0',
    BUILD_NUMBER: 1,
} as const;

// Storage Keys - Centralized
export const STORAGE_KEYS = {
    // Auth
    AUTH_TOKEN: '@auth_token',
    REFRESH_TOKEN: '@refresh_token',
    USER_DATA: '@user_data',
    
    // App State
    THEME: '@theme_preference',
    ONBOARDING_COMPLETE: '@onboarding_complete',
    
    // Business
    STORE_PROFILE: '@store_profile',
    CART_DATA: '@cart_data',
    
    // Cache
    PRODUCTS_CACHE: '@products_cache',
    ORDERS_CACHE: '@orders_cache',
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
} as const;

// API Endpoints - Centralized
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/register',
        LOGOUT: '/users/logout',
        REFRESH_TOKEN: '/users/refresh-token',
        FORGOT_PASSWORD: '/users/forgot-password',
        RESET_PASSWORD: '/users/reset-password',
        VERIFY_OTP: '/users/verify-otp',
        PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
        UPDATE_FCM_TOKEN: '/users/fcm-token',
    },
    
    // Products
    PRODUCTS: {
        LIST: '/products',
        DETAIL: (id: string) => `/products/${id}`,
        CREATE: '/products',
        UPDATE: (id: string) => `/products/${id}`,
        DELETE: (id: string) => `/products/${id}`,
        SEARCH: '/products/search',
        CATEGORIES: '/products/categories',
    },
    
    // Orders
    ORDERS: {
        LIST: '/orders',
        DETAIL: (id: string) => `/orders/${id}`,
        CREATE: '/orders',
        UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
        CANCEL: (id: string) => `/orders/${id}/cancel`,
    },
    
    // Inventory
    INVENTORY: {
        LIST: '/inventory',
        LOW_STOCK: '/inventory/low-stock',
        UPDATE_STOCK: (id: string) => `/inventory/${id}/stock`,
        EXPIRING_SOON: '/inventory/expiring-soon',
    },
    
    // Analytics
    ANALYTICS: {
        DASHBOARD: '/analytics/dashboard',
        SALES_REPORT: '/analytics/sales',
        INVENTORY_REPORT: '/analytics/inventory',
    },
    
    // Notifications
    NOTIFICATIONS: {
        LIST: '/notifications',
        MARK_READ: (id: string) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/read-all',
    },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;
