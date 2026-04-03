import { useState } from 'react';
import type { Product, Category } from '../../types/product';

interface ProductFormModalProps {
    product: Product | null;
    categories: Category[];
    onSubmit: (payload: Record<string, unknown>) => Promise<void>;
    onClose: () => void;
}

export function ProductFormModal({ product, categories, onSubmit, onClose }: ProductFormModalProps) {
    const [formData, setFormData] = useState({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price.toString() ?? '',
        stockQuantity: product?.stockQuantity.toString() ?? '',
        sku: product?.sku ?? '',
        imageUrl: product?.imageUrl ?? '',
        categoryId: product?.category.id.toString() ?? categories[0]?.id.toString() ?? '',
        featured: product?.featured ?? false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stockQuantity: parseInt(formData.stockQuantity, 10),
            sku: formData.sku,
            imageUrl: formData.imageUrl,
            category: { id: parseInt(formData.categoryId, 10) },
            featured: formData.featured,
        };

        await onSubmit(payload);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{product ? 'Editar Produto' : 'Novo Produto'}</h2>
                    <button className="btn-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nome *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>SKU *</label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Preço (R$) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Estoque *</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.stockQuantity}
                                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Categoria *</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                            >
                                <option value="">Selecione...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>URL da Imagem</label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label" style={{ marginTop: '10px' }}>
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            />
                            <span>Produto em Destaque (Oferta do Dia)</span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary">
                            {product ? 'Salvar Alterações' : 'Criar Produto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
