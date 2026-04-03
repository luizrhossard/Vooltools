import { useCallback, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from './ProductCard';
import type { Product } from '../types/product';

interface ProductsSectionProps {
    products: Product[];
    isLoading: boolean;
}

interface FeaturedProduct {
    product: Product;
    badge: { label: string; type: 'badge-new' | 'badge-sale' | 'badge-hot' };
    oldPrice?: number;
    brandClass: string;
    brandLabel: string;
    stars: number;
    reviews: number;
    parcel: string;
}

export function ProductsSection({ products, isLoading }: ProductsSectionProps) {
    const { addToCart, openCart } = useCart();

    const featuredProducts: FeaturedProduct[] = useMemo(() => {
        if (products.length === 0) return [];

        const badges = ['badge-new', 'badge-sale', 'badge-hot'] as const;
        const brands = [
            { class: 'makita', label: 'MAKITA' },
            { class: 'dewalt', label: 'DEWALT' },
            { class: 'bosch', label: 'BOSCH' },
            { class: 'stanley', label: 'STANLEY' },
            { class: 'tramontina', label: 'TRAMONTINA' },
        ];

        return products.slice(0, 6).map((product, index) => {
            const discount = Math.floor(Math.random() * 25) + 5;
            const oldPrice = product.price * (1 + discount / 100);
            const brand = brands[index % brands.length];

            return {
                product,
                badge: {
                    label: index === 0 ? 'LANÇAMENTO' : index === 1 ? `-${discount}% OFF` : 'TOP VENDAS',
                    type: badges[index % 3]
                },
                oldPrice: index === 1 ? oldPrice : undefined,
                brandClass: brand.class,
                brandLabel: brand.label,
                stars: +(4 + Math.random()).toFixed(1),
                reviews: Math.floor(Math.random() * 200) + 20,
                parcel: `10x R$ ${(product.price / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros`,
            };
        });
    }, [products]);

    const handleAdded = useCallback((product: Product) => {
        addToCart(product);
        openCart();
    }, [addToCart, openCart]);

    return (
        <section className="page-sec bg-alt" id="destaques">
            <div className="cw">
                <div className="sec-hd">
                    <h2 className="sec-title">MAIS VENDIDOS</h2>
                    <div className="sec-tabs">
                        <button className="stab active">TODOS</button>
                        <button className="stab">NOVOS</button>
                        <button className="stab">OFERTAS</button>
                    </div>
                    <a href="#" className="sec-more">Ver todos <i className="fas fa-arrow-right"></i></a>
                </div>

                {isLoading ? (
                    <div className="loading-products">
                        <div className="spinner-large"></div>
                        <p>Carregando produtos...</p>
                    </div>
                ) : featuredProducts.length > 0 ? (
                    <div className="prod-grid">
                        {featuredProducts.map((entry) => (
                            <ProductCard
                                key={entry.product.id}
                                product={entry.product}
                                badge={entry.badge}
                                oldPrice={entry.oldPrice}
                                brandClass={entry.brandClass}
                                brandLabel={entry.brandLabel}
                                stars={entry.stars}
                                reviews={entry.reviews}
                                parcel={entry.parcel}
                                onAdded={handleAdded}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="no-products">
                        <i className="fas fa-box-open"></i>
                        <p>Nenhum produto cadastrado ainda.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
