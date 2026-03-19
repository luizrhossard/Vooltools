import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { DashboardStats } from '../../types/product';
import './Dashboard.css';

export function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(response => setStats(response.data))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const statCards = [
        {
            title: 'Total de Produtos',
            value: stats?.totalProducts ?? 0,
            icon: 'fa-box',
            color: 'blue',
        },
        {
            title: 'Total de Pedidos',
            value: stats?.totalOrders ?? 0,
            icon: 'fa-shopping-cart',
            color: 'green',
        },
        {
            title: 'Pedidos Pendentes',
            value: stats?.pendingOrders ?? 0,
            icon: 'fa-clock',
            color: 'orange',
        },
        {
            title: 'Receita Total',
            value: stats?.totalRevenue 
                ? `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : 'R$ 0,00',
            icon: 'fa-dollar-sign',
            color: 'purple',
        },
        {
            title: 'Produtos com Estoque Baixo',
            value: stats?.lowStockProducts ?? 0,
            icon: 'fa-exclamation-triangle',
            color: 'red',
        },
    ];

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-large"></div>
                <p>Carregando dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Visão geral da sua loja</p>
            </div>

            <div className="stats-grid">
                {statCards.map((card) => (
                    <div key={card.title} className={`stat-card stat-${card.color}`}>
                        <div className="stat-icon">
                            <i className={`fas ${card.icon}`}></i>
                        </div>
                        <div className="stat-info">
                            <span className="stat-title">{card.title}</span>
                            <span className="stat-value">{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-actions">
                <h2>Ações Rápidas</h2>
                <div className="actions-grid">
                    <a href="/admin/produtos" className="action-card">
                        <i className="fas fa-plus-circle"></i>
                        <span>Novo Produto</span>
                    </a>
                    <a href="/admin/banners" className="action-card">
                        <i className="fas fa-image"></i>
                        <span>Gerenciar Banners</span>
                    </a>
                    <a href="/admin/categorias" className="action-card">
                        <i className="fas fa-tags"></i>
                        <span>Categorias</span>
                    </a>
                    <a href="/admin/pedidos" className="action-card">
                        <i className="fas fa-shopping-cart"></i>
                        <span>Pedidos</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
