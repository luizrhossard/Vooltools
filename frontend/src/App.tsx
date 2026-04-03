import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import { HomePage } from './pages/HomePage';
import { AdminLogin } from './pages/admin/Login';
import { AdminRoutes } from './pages/admin/AdminRoutes';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

function LogoutListener() {
    const { logout } = useAdminAuth();
    window.addEventListener('auth:logout', logout);
    return null;
}

export default function App() {
    return (
        <CartProvider>
            <AdminAuthProvider>
                <LogoutListener />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <AdminRoutes />
                        </ProtectedRoute>
                    } />
                    <Route path="/produto/:id" element={<ProductDetailsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AdminAuthProvider>
        </CartProvider>
    );
}
