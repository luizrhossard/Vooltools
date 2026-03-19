import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './Login';
import { AdminDashboard } from './Dashboard';
import { AdminProducts } from './Products';
import { AdminBanners } from './Banners';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';

export function AdminRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <Routes>
                                <Route path="/" element={<AdminDashboard />} />
                                <Route path="/produtos" element={<AdminProducts />} />
                                <Route path="/banners" element={<AdminBanners />} />
                                <Route path="*" element={<Navigate to="/admin" replace />} />
                            </Routes>
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
