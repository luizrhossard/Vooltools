import { useState, useEffect } from 'react';
import { ApiErrorNotice } from '../../components/ApiErrorNotice';
import { apiClient, getApiErrorMessage } from '../../lib/apiClient';
import type { Product, Category } from '../../types/product';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import './Products.css';

export function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
        setEditingProduct(product ?? null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (payload: Record<string, unknown>) => {
        setErrorMessage(null);

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
                <ProductFormModal
                    product={editingProduct}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
