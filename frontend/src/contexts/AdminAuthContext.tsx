import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { AdminUser } from '../types/product';
import { apiClient } from '../lib/apiClient';
import {
    clearStoredSession,
    getStoredToken,
    getStoredUser,
    setStoredSession,
} from '../lib/adminSession';
import { isTokenExpired } from '../lib/authToken';

interface AdminAuthContextType {
    user: AdminUser | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (role: string) => boolean;
    isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface LoginResponse {
    token: string;
    user: AdminUser;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(() => getStoredUser());
    const [token, setToken] = useState<string | null>(() => getStoredToken());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        if (storedToken && storedUser && !isTokenExpired(storedToken)) {
            setToken(storedToken);
            setUser(storedUser);
        } else {
            clearStoredSession();
            setToken(null);
            setUser(null);
        }

        const handleAuthLogout = () => {
            clearStoredSession();
            setToken(null);
            setUser(null);
        };

        window.addEventListener('auth:logout', handleAuthLogout);
        setIsLoading(false);

        return () => {
            window.removeEventListener('auth:logout', handleAuthLogout);
        };
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
            const nextToken = response.data.token;
            const nextUser = response.data.user;

            if (isTokenExpired(nextToken)) {
                throw new Error('Token recebido já está expirado.');
            }

            setStoredSession(nextToken, nextUser);

            setToken(nextToken);
            setUser(nextUser);
        } catch (error) {
            clearStoredSession();
            setToken(null);
            setUser(null);
            throw error;
        }
    };

    const logout = () => {
        clearStoredSession();
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = useMemo(() => {
        if (!token || !user) return false;
        return !isTokenExpired(token);
    }, [token, user]);

    const hasRole = (role: string) => {
        if (!user?.role) return false;
        return user.role.toUpperCase() === role.toUpperCase();
    };

    return (
        <AdminAuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated,
            hasRole,
            isLoading
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}
