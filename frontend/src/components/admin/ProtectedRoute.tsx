import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { isTokenExpired } from '../../lib/authToken';
import { Unauthorized } from './Unauthorized';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, token, hasRole } = useAdminAuth();

    const isTokenInvalid = !token || isTokenExpired(token);

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="spinner-large"></div>
                <p>Carregando...</p>
            </div>
        );
    }

    if (!isAuthenticated || isTokenInvalid) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Unauthorized />;
    }

    return <>{children}</>;
}
