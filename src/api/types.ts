// ═══════════════════════════════════════════════════════════
// API Types - Production Grade
// ═══════════════════════════════════════════════════════════

// ============================================
// Base API Response Types
// ============================================

/** Standard API Response wrapper */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/** Error Response */
export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: string;
    errors?: Record<string, string[]>;
}

/** Paginated Response */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// ============================================
// User & Auth Types (Based on actual API)
// ============================================

/** User Address */
export interface UserAddress {
    location: {
        latitude: number;
        longitude: number;
    };
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

/** User Role */
export type UserRole = 'ADMIN' | 'OWNER' | 'MANAGER' | 'STAFF' | 'CUSTOMER';

/** User Model - Based on API response */
export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    fcmToken?: string;
    lastLogin: string;
    address: UserAddress;
    role: UserRole;
    ProfileImage: string[];
    createdAt: string;
    updatedAt: string;
}

/** Login Request */
export interface LoginRequest {
    email: string;
    password: string;
    fcmToken?: string;
}

/** Login Response Data */
export interface LoginResponseData {
    user: User;
    token: string;
}

/** Login Response */
export type LoginResponse = ApiResponse<LoginResponseData>;

/** Register Request */
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: UserRole;
    fcmToken?: string;
    address?: Partial<UserAddress>;
}

/** Register Response */
export type RegisterResponse = ApiResponse<LoginResponseData>;

/** Update Profile Request */
export interface UpdateProfileRequest {
    name?: string;
    phone?: string;
    address?: Partial<UserAddress>;
    ProfileImage?: string[];
}

/** Forgot Password Request */
export interface ForgotPasswordRequest {
    email: string;
}

/** Reset Password Request */
export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
    totalRevenue: number;
    todayOrders: number;
    lowStockCount: number;
    rating: number;
    revenueChange: number; // percentage
}

export interface RecentOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    itemCount: number;
    status: OrderStatus;
    createdAt: string;
}

// ============================================
// Product/Inventory Types
// ============================================

export interface Product {
    _id: string;
    name: string;
    genericName?: string;
    manufacturer: string;
    mrp: number;
    sellingPrice: number;
    stock: number;
    minStock: number;
    unit: string;
    expiryDate: string;
    batchNumber: string;
    barcode?: string;
    category: string;
    description?: string;
    images: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData {
    name: string;
    genericName?: string;
    manufacturer: string;
    mrp: number;
    sellingPrice: number;
    stock: number;
    minStock: number;
    unit: string;
    expiryDate: string;
    batchNumber: string;
    barcode?: string;
    category: string;
    description?: string;
}

// ============================================
// Order Types
// ============================================

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'credit' | 'online';

export interface OrderItem {
    product: string | Product;
    name: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Order {
    _id: string;
    orderNumber: string;
    customer: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    items: OrderItem[];
    subtotal: number;
    discount: number;
    tax: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    status: OrderStatus;
    deliveryAddress?: UserAddress;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
}

// ============================================
// Analytics Types
// ============================================

export interface SalesData {
    date: string;
    revenue: number;
    orders: number;
}

export interface TopProduct {
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
}

// ============================================
// Store/Settings Types
// ============================================

export interface StoreProfile {
    id: string;
    name: string;
    ownerName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gstNumber?: string;
    drugLicenseNumber?: string;
    logoUrl?: string;
    rating: number;
    reviewCount: number;
}
