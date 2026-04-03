import { useState } from 'react';
import type { Banner } from '../../types/product';

interface BannerFormModalProps {
    banner: Banner | null;
    onSubmit: (payload: Record<string, unknown>) => Promise<void>;
    onClose: () => void;
}

export function BannerFormModal({ banner, onSubmit, onClose }: BannerFormModalProps) {
    const [formData, setFormData] = useState({
        title: banner?.title ?? '',
        subtitle: banner?.subtitle ?? '',
        imageUrl: banner?.imageUrl ?? '',
        linkUrl: banner?.linkUrl ?? '',
        displayOrder: banner?.displayOrder?.toString() ?? '',
        active: banner?.active ?? true,
        startDate: banner?.startDate ?? '',
        endDate: banner?.endDate ?? '',
        showPriceBadge: banner?.showPriceBadge !== false,
        priceBadgePrefix: banner?.priceBadgePrefix ?? '',
        priceBadgeValue: banner?.priceBadgeValue ?? '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            subtitle: formData.subtitle,
            imageUrl: formData.imageUrl,
            linkUrl: formData.linkUrl,
            displayOrder: formData.displayOrder ? parseInt(formData.displayOrder, 10) : null,
            active: formData.active,
            startDate: formData.startDate || null,
            endDate: formData.endDate || null,
            showPriceBadge: formData.showPriceBadge,
            priceBadgePrefix: formData.priceBadgePrefix || null,
            priceBadgeValue: formData.priceBadgeValue || null,
        };

        await onSubmit(payload);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{banner ? 'Editar Banner' : 'Novo Banner'}</h2>
                    <button className="btn-close" onClick={onClose}>
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
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary">
                            {banner ? 'Salvar Alterações' : 'Criar Banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
