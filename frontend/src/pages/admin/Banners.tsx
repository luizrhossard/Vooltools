import { useState, useEffect } from 'react';
import { ApiErrorNotice } from '../../components/ApiErrorNotice';
import { apiClient, getApiErrorMessage } from '../../lib/apiClient';
import type { Banner } from '../../types/product';
import { BannerCard } from '../../components/admin/BannerCard';
import { BannerFormModal } from '../../components/admin/BannerFormModal';
import './Banners.css';

export function AdminBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        setErrorMessage(null);
        try {
            const response = await apiClient.get<Banner[]>('/banners');
            setBanners(response.data);
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Erro ao carregar banners.'));
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (banner?: Banner) => {
        setEditingBanner(banner ?? null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBanner(null);
    };

    const handleSubmit = async (payload: Record<string, unknown>) => {
        setErrorMessage(null);

        try {
            if (editingBanner) {
                await apiClient.put(`/banners/${editingBanner.id}`, payload);
            } else {
                await apiClient.post('/banners', payload);
            }
            await loadBanners();
            closeModal();
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Erro ao salvar banner. Verifique os dados e tente novamente.'));
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este banner?')) return;
        setErrorMessage(null);

        try {
            await apiClient.delete(`/banners/${id}`);
            await loadBanners();
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Erro ao excluir banner.'));
        }
    };

    const toggleActive = async (id: number, currentActive: boolean) => {
        setErrorMessage(null);
        try {
            const banner = banners.find(b => b.id === id);
            if (banner) {
                await apiClient.put(`/banners/${id}`, { ...banner, active: !currentActive });
                await loadBanners();
            }
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Erro ao atualizar banner.'));
        }
    };

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-large"></div>
                <p>Carregando banners...</p>
            </div>
        );
    }

    return (
        <div className="admin-banners">
            <div className="page-header">
                <div>
                    <h1>Banners</h1>
                    <p>Gerencie os banners do site principal</p>
                </div>
                <button className="btn-primary" onClick={() => openModal()}>
                    <i className="fas fa-plus"></i>
                    Novo Banner
                </button>
            </div>

            {errorMessage ? (
                <ApiErrorNotice message={errorMessage} onRetry={() => window.location.reload()} />
            ) : null}

            <div className="banners-grid">
                {banners.map((banner) => (
                    <BannerCard
                        key={banner.id}
                        banner={banner}
                        onEdit={openModal}
                        onDelete={handleDelete}
                        onToggle={toggleActive}
                    />
                ))}
            </div>

            {showModal && (
                <BannerFormModal
                    banner={editingBanner}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
