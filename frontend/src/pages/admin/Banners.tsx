import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { Banner } from '../../types/product';
import './Banners.css';

export function AdminBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        imageUrl: '',
        linkUrl: '',
        displayOrder: '',
        active: true,
        startDate: '',
        endDate: '',
        showPriceBadge: true,
        priceBadgePrefix: '',
        priceBadgeValue: '',
    });

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            const response = await api.get('/banners');
            setBanners(response.data);
        } catch (error) {
            console.error('Erro ao carregar banners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                subtitle: banner.subtitle || '',
                imageUrl: banner.imageUrl || '',
                linkUrl: banner.linkUrl || '',
                displayOrder: banner.displayOrder?.toString() || '',
                active: banner.active,
                startDate: banner.startDate || '',
                endDate: banner.endDate || '',
                showPriceBadge: banner.showPriceBadge !== false,
                priceBadgePrefix: banner.priceBadgePrefix || '',
                priceBadgeValue: banner.priceBadgeValue || '',
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                subtitle: '',
                imageUrl: '',
                linkUrl: '',
                displayOrder: '',
                active: true,
                startDate: '',
                endDate: '',
                showPriceBadge: true,
                priceBadgePrefix: '',
                priceBadgeValue: '',
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBanner(null);
        setFormData({
            title: '',
            subtitle: '',
            imageUrl: '',
            linkUrl: '',
            displayOrder: '',
            active: true,
            startDate: '',
            endDate: '',
            showPriceBadge: true,
            priceBadgePrefix: '',
            priceBadgeValue: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            subtitle: formData.subtitle,
            imageUrl: formData.imageUrl,
            linkUrl: formData.linkUrl,
            displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : null,
            active: formData.active,
            startDate: formData.startDate || null,
            endDate: formData.endDate || null,
            showPriceBadge: formData.showPriceBadge,
            priceBadgePrefix: formData.priceBadgePrefix || null,
            priceBadgeValue: formData.priceBadgeValue || null,
        };

        try {
            if (editingBanner) {
                await api.put(`/banners/${editingBanner.id}`, payload);
            } else {
                await api.post('/banners', payload);
            }
            loadBanners();
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar banner:', error);
            alert('Erro ao salvar banner. Verifique os dados e tente novamente.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este banner?')) return;

        try {
            await api.delete(`/banners/${id}`);
            loadBanners();
        } catch (error) {
            console.error('Erro ao excluir banner:', error);
            alert('Erro ao excluir banner.');
        }
    };

    const toggleActive = async (id: number, currentActive: boolean) => {
        try {
            const banner = banners.find(b => b.id === id);
            if (banner) {
                await api.put(`/banners/${id}`, { ...banner, active: !currentActive });
                loadBanners();
            }
        } catch (error) {
            console.error('Erro ao atualizar banner:', error);
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

            <div className="banners-grid">
                {banners.map((banner) => (
                    <div key={banner.id} className={`banner-card ${!banner.active ? 'inactive' : ''}`}>
                        <div className="banner-preview">
                            {banner.imageUrl ? (
                                <img src={banner.imageUrl} alt={banner.title} />
                            ) : (
                                <div className="banner-placeholder">
                                    <i className="fas fa-image"></i>
                                    <span>Sem imagem</span>
                                </div>
                            )}
                            {!banner.active && (
                                <div className="inactive-overlay">
                                    <span>Inativo</span>
                                </div>
                            )}
                        </div>
                        <div className="banner-info">
                            <h3>{banner.title}</h3>
                            {banner.subtitle && <p>{banner.subtitle}</p>}
                            <div className="banner-meta">
                                {banner.displayOrder && (
                                    <span className="order-badge">
                                        <i className="fas fa-sort"></i>
                                        Ordem: {banner.displayOrder}
                                    </span>
                                )}
                                <span className={`status-badge ${banner.active ? 'active' : 'inactive'}`}>
                                    {banner.active ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                        <div className="banner-actions">
                            <button
                                className={`btn-toggle ${banner.active ? 'active' : ''}`}
                                onClick={() => toggleActive(banner.id, banner.active)}
                                title={banner.active ? 'Desativar' : 'Ativar'}
                            >
                                <i className={`fas ${banner.active ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                            </button>
                            <button
                                className="btn-icon btn-edit"
                                onClick={() => openModal(banner)}
                                title="Editar"
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                            <button
                                className="btn-icon btn-delete"
                                onClick={() => handleDelete(banner.id)}
                                title="Excluir"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingBanner ? 'Editar Banner' : 'Novo Banner'}</h2>
                            <button className="btn-close" onClick={closeModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Título *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Subtítulo</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>URL da Imagem</label>
                                    <input
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>URL do Link</label>
                                    <input
                                        type="url"
                                        value={formData.linkUrl}
                                        onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ordem de Exibição</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        />
                                        <span>Banner Ativo</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Data de Início</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Data de Fim</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                                    <label className="checkbox-label" style={{ marginBottom: 0 }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.showPriceBadge}
                                            onChange={(e) => setFormData({ ...formData, showPriceBadge: e.target.checked })}
                                        />
                                        <span>Mostrar Badge de Preço</span>
                                    </label>
                                </div>
                            </div>

                            {formData.showPriceBadge && (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Texto do Badge (opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.priceBadgePrefix}
                                            onChange={(e) => setFormData({ ...formData, priceBadgePrefix: e.target.value })}
                                            placeholder="Ex: A partir de"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Valor do Badge (opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.priceBadgeValue}
                                            onChange={(e) => setFormData({ ...formData, priceBadgeValue: e.target.value })}
                                            placeholder="Ex: R$ 680,90"
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.imageUrl && (
                                <div className="image-preview">
                                    <label>Pré-visualização</label>
                                    <img src={formData.imageUrl} alt="Preview" />
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingBanner ? 'Salvar Alterações' : 'Criar Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
