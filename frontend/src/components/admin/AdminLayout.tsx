import { useState } from 'react';
import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import './AdminLayout.css';

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: 'fa-chart-line' },
        { path: '/admin/produtos', label: 'Produtos', icon: 'fa-box' },
        { path: '/admin/banners', label: 'Banners', icon: 'fa-image' },
        { path: '/admin/categorias', label: 'Categorias', icon: 'fa-tags' },
        { path: '/admin/pedidos', label: 'Pedidos', icon: 'fa-shopping-cart' },
    ];

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <img src="/static/logo-volttools.png" alt="VoltTools" className="sidebar-logo" />
                    {sidebarOpen && <span className="sidebar-title">Admin</span>}
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className={`fas ${item.icon}`}></i>
                            {sidebarOpen && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-sign-out-alt"></i>
                        {sidebarOpen && <span>Sair</span>}
                    </button>
                </div>
            </aside>

            <div className="admin-content">
                <header className="admin-header">
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <i className="fas fa-bars"></i>
                    </button>

                    <div className="header-right">
                        <div className="user-info">
                            <span className="user-name">{user?.name || 'Admin'}</span>
                            <span className="user-role">{user?.role || 'Administrador'}</span>
                        </div>
                        <div className="user-avatar">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </header>

                <main className="admin-main">
                    {children}
                </main>
            </div>
        </div>
    );
}
