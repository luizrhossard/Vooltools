import type { Banner } from '../../types/product';

interface BannerCardProps {
    banner: Banner;
    onEdit: (banner: Banner) => void;
    onDelete: (id: number) => void;
    onToggle: (id: number, currentActive: boolean) => void;
}

export function BannerCard({ banner, onEdit, onDelete, onToggle }: BannerCardProps) {
    return (
        <div className={`banner-card ${!banner.active ? 'inactive' : ''}`}>
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
                    onClick={() => onToggle(banner.id, banner.active)}
                    title={banner.active ? 'Desativar' : 'Ativar'}
                >
                    <i className={`fas ${banner.active ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
                <button
                    className="btn-icon btn-edit"
                    onClick={() => onEdit(banner)}
                    title="Editar"
                >
                    <i className="fas fa-edit"></i>
                </button>
                <button
                    className="btn-icon btn-delete"
                    onClick={() => onDelete(banner.id)}
                    title="Excluir"
                >
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
}
