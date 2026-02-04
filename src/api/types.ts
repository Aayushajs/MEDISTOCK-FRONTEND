// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
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
    id: string;
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
    imageUrl?: string;
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

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';

export interface Order {
    id: string;
    orderNumber: string;
    customer: Customer;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    tax: number;
    totalAmount: number;
    paymentMethod: 'cash' | 'upi' | 'card' | 'credit';
    paymentStatus: 'pending' | 'paid' | 'failed';
    status: OrderStatus;
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
