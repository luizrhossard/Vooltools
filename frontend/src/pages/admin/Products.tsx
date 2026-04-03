import { useState, useEffect } from 'react';
import { ApiErrorNotice } from '../../components/ApiErrorNotice';
import { apiClient, getApiErrorMessage } from '../../lib/apiClient';
import type { Product, Category } from '../../types/product';
import './Products.css';

export function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        sku: '',
        imageUrl: '',
        categoryId: '',
        featured: false,
    });

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        setErrorMessage(null);
        try {
            const response = await apiClient.get<Product[]>('/products');
            setProducts(response.data);
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Erro ao carregar produtos.'));
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await apiClient.get<Category[]>('/categories');
            setCategories(response.data);
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Erro ao carregar categorias.'));
        }
    };

    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price.toString(),
                stockQuantity: product.stockQuantity.toString(),
                sku: product.sku,
                imageUrl: product.imageUrl || '',
                categoryId: product.category.id.toString(),
                featured: product.featured || false,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                stockQuantity: '',
                sku: '',
                imageUrl: '',
                categoryId: categories[0]?.id.toString() || '',
                featured: false,
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stockQuantity: '',
            sku: '',
            imageUrl: '',
            categoryId: '',
            featured: false,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        
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

        try {
            if (editingProduct) {
                await apiClient.put(`/products/${editingProduct.id}`, payload);
            } else {
                await apiClient.post('/products', payload);
            }
            await loadProducts();
            closeModal();
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Erro ao salvar produto. Verifique os dados e tente novamente.'));
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;
        setErrorMessage(null);

        try {
            await apiClient.delete(`/products/${id}`);
            await loadProducts();
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Erro ao excluir produto.'));
        }
    };

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-large"></div>
                <p>Carregando produtos...</p>
            </div>
        );
    }

    return (
        <div className="admin-products">
            <div className="page-header">
                <div>
                    <h1>Produtos</h1>
                    <p>Gerencie os produtos da sua loja</p>
                </div>
                <button className="btn-primary" onClick={() => openModal()}>
                    <i className="fas fa-plus"></i>
                    Novo Produto
                </button>
            </div>

            {errorMessage ? (
                <ApiErrorNotice message={errorMessage} onRetry={() => window.location.reload()} />
            ) : null}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Imagem</th>
                            <th>Nome</th>
                            <th>SKU</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th>Estoque</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="product-thumb">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} />
                                        ) : (
                                            <i className="fas fa-image"></i>
                                        )}
                                    </div>
                                </td>
                                <td className="product-name">{product.name}</td>
                                <td><code>{product.sku}</code></td>
                                <td>{product.category.name}</td>
                                <td>R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                <td>
                                    <span className={`stock-badge ${product.stockQuantity <= 10 ? 'low' : 'ok'}`}>
                                        {product.stockQuantity}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions">
                                        <button 
                                            className="btn-icon btn-edit" 
                                            onClick={() => openModal(product)}
                                            title="Editar"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="btn-icon btn-delete" 
                                            onClick={() => handleDelete(product.id)}
                                            title="Excluir"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                            <button className="btn-close" onClick={closeModal}>
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
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
