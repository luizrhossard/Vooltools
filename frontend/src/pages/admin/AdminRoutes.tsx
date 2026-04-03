import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AdminDashboard } from './Dashboard';
import { AdminProducts } from './Products';
import { AdminBanners } from './Banners';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';

export function AdminRoutes() {
    const renderProtected = (page: ReactNode) => (
        <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout>{page}</AdminLayout>
        </ProtectedRoute>
    );

    return (
        <Routes>
            <Route path="login" element={<Navigate to="/login" replace />} />
            <Route index element={renderProtected(<AdminDashboard />)} />
            <Route path="produtos" element={renderProtected(<AdminProducts />)} />
            <Route path="banners" element={renderProtected(<AdminBanners />)} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
}
