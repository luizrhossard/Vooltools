import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
    badge?: { label: string; type: 'badge-new' | 'badge-sale' | 'badge-hot' };
    oldPrice?: number;
    brandClass?: string;
    brandLabel?: string;
    stars?: number;
    reviews?: number;
    parcel?: string;
    onAdded?: (product: Product) => void;
}

export function ProductCard({
    product,
    badge,
    oldPrice,
    brandClass = 'makita',
    brandLabel = 'MAKITA',
    stars = 4,
    reviews,
    parcel,
    onAdded,
}: ProductCardProps) {
    const { addToCart, openCart } = useCart();
    const [adding, setAdding] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, []);

    const fmt = (n: number) =>
        `R$\u00a0${n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    const handleAdd = () => {
        addToCart(product);
        openCart();
        onAdded?.(product);

        setAdding(true);
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setAdding(false), 1400);
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, i) => {
            if (i < Math.floor(stars)) return <i key={i} className="fas fa-star"></i>;
            if (i < stars) return <i key={i} className="fas fa-star-half-alt"></i>;
            return <i key={i} className="far fa-star"></i>;
        });
    };

    return (
        <article className="prod-card">
            <button className="fav-btn" title="Favoritar">
                <i className="far fa-heart"></i>
            </button>

            {badge && (
                <span className={`prod-badge ${badge.type}`}>{badge.label}</span>
            )}

            {product.stockQuantity < 30 && (
                <span className="prod-badge badge-sale">ÚLTIMAS {product.stockQuantity}</span>
            )}

            <Link to={`/produto/${product.id}`} className="prod-img-link">
                <div className="prod-img-wrap">
                    {product.imageUrl ? <img src={product.imageUrl} alt={product.name} loading="lazy" /> : null}
                </div>
            </Link>

            <div className="prod-body">
                <span className={`prod-brand ${brandClass}`}>{brandLabel}</span>
                <h3 className="prod-name">
                    <Link to={`/produto/${product.id}`} className="prod-name-link">
                        {product.name}
                    </Link>
                </h3>

                <div className="prod-stars">
                    {renderStars()}
                    {reviews && <span>({stars} · {reviews})</span>}
                </div>

                <div className="prod-prices">
                    {oldPrice && <span className="p-old">{fmt(oldPrice)}</span>}
                    <span className="p-new">{fmt(product.price)}</span>
                </div>

                {parcel && <span className="p-parcel">{parcel}</span>}

                <button
                    className={`btn-cart-add ${adding ? 'adding' : ''}`}
                    onClick={handleAdd}
                >
                    {adding
                        ? <><i className="fas fa-check"></i> ADICIONADO!</>
                        : <><i className="fas fa-cart-plus"></i> ADICIONAR AO CARRINHO</>
                    }
                </button>
            </div>
        </article>
    );
}
