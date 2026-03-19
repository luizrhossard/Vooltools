// src/types/product.ts
export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stockQuantity: number;
    sku: string;
    imageUrl?: string;
    category: Category;
}

export interface AdminUser {
    id: number;
    email: string;
    name: string;
    role: string;
}

export interface Banner {
    id: number;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    linkUrl?: string;
    displayOrder?: number;
    active: boolean;
    startDate?: string;
    endDate?: string;
}

export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    lowStockProducts: number;
}
