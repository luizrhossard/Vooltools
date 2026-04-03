import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import type { Product, Banner } from '../types/product';

interface HeroSectionProps {
    banners: Banner[];
    products: Product[];
}

export function HeroSection({ banners, products }: HeroSectionProps) {
    const { addToCart, openCart } = useCart();
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    const visibleBanners = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return banners
            .filter((banner) => {
                if (!banner.active) return false;

                const startDate = banner.startDate ? new Date(`${banner.startDate}T00:00:00`) : null;
                const endDate = banner.endDate ? new Date(`${banner.endDate}T00:00:00`) : null;

                if (startDate && !Number.isNaN(startDate.getTime()) && startDate > today) {
                    return false;
                }

                if (endDate && !Number.isNaN(endDate.getTime()) && endDate < today) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER));
    }, [banners]);

    const heroPrice = useMemo(() => {
        const dealProduct = products.find(p => p.featured) || products[0];
        return (dealProduct?.price ?? products[0]?.price ?? 12.9).toLocaleString('pt-BR', {
            minimumFractionDigits: 2
        });
    }, [products]);

    const dealProduct = useMemo(() => {
        if (products.length === 0) return null;
        return products.find(p => p.featured) || products[0];
    }, [products]);

    const hasMultipleBanners = visibleBanners.length > 1;

    const goToBanner = useCallback((index: number) => {
        if (visibleBanners.length === 0) return;
        const normalizedIndex = (index + visibleBanners.length) % visibleBanners.length;
        setCurrentBannerIndex(normalizedIndex);
    }, [visibleBanners.length]);

    const goToNextBanner = useCallback(() => {
        if (visibleBanners.length === 0) return;
        setCurrentBannerIndex((prev) => (prev + 1) % visibleBanners.length);
    }, [visibleBanners.length]);

    const goToPreviousBanner = useCallback(() => {
        if (visibleBanners.length === 0) return;
        setCurrentBannerIndex((prev) => (prev - 1 + visibleBanners.length) % visibleBanners.length);
    }, [visibleBanners.length]);

    useEffect(() => {
        setCurrentBannerIndex(0);
    }, [visibleBanners.length]);

    useEffect(() => {
        if (!hasMultipleBanners) return;

        const interval = window.setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % visibleBanners.length);
        }, 6000);

        return () => window.clearInterval(interval);
    }, [hasMultipleBanners, visibleBanners.length]);

    const handleDealAdd = () => {
        if (!dealProduct) return;
        addToCart(dealProduct);
        openCart();
    };

    return (
        <section className="hero-section">
            <div className="cw hero-wrap">
                <div className="hero-banner" id="heroBanner">
                    {visibleBanners.length > 0 ? (
                        visibleBanners.map((banner, index) => (
                            <div
                                key={banner.id}
                                className={`hero-slide ${index === currentBannerIndex ? 'active' : ''}`}
                                data-slide={index}
                            >
                                <div
                                    className="hs-bg hs-bg-0"
                                    style={banner.imageUrl ? { backgroundImage: `url(${banner.imageUrl})` } : undefined}
                                ></div>
                                <div className="hs-content">
                                    <span className="hs-eyebrow"><i className="fas fa-certificate"></i> DESTAQUE DA SEMANA</span>
                                    <h1 className="hs-h1">{banner.title}</h1>
                                    <p className="hs-lead">{banner.subtitle || 'Confira nossas ofertas imperdíveis!'}</p>
                                    {banner.linkUrl ? (
                                        <a href={banner.linkUrl} className="btn-hs">
                                            SAIBA MAIS <i className="fas fa-arrow-right"></i>
                                        </a>
                                    ) : (
                                        <a href="#destaques" className="btn-hs">
                                            VER OFERTAS <i className="fas fa-arrow-right"></i>
                                        </a>
                                    )}
                                </div>
                                <div className="hs-img-side">
                                    {banner.showPriceBadge !== false && (
                                        <div className="hs-badge-price">
                                            <span className="hsbp-from">{banner.priceBadgePrefix || 'a partir de'}</span>
                                            <span className="hsbp-val">{banner.priceBadgeValue || `R$ ${heroPrice}`}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="hero-slide active" data-slide="0">
                            <div className="hs-bg hs-bg-0"></div>
                            <div className="hs-content">
                                <span className="hs-eyebrow"><i className="fas fa-certificate"></i> BEM-VINDO À VOLTTOOLS</span>
                                <h1 className="hs-h1">FERRAMENTAS<br /><em>PROFISSIONAIS.</em></h1>
                                <p className="hs-lead">As melhores marcas com os melhores preços.<br />Qualidade que você confia.</p>
                                <a href="#destaques" className="btn-hs">
                                    VER OFERTAS <i className="fas fa-arrow-right"></i>
                                </a>
                            </div>
                            <div className="hs-img-side">
                                <div className="hs-badge-price">
                                    <span className="hsbp-from">a partir de</span>
                                    <span className="hsbp-val">R$&nbsp;{heroPrice}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {hasMultipleBanners && (
                        <>
                            <button type="button" className="ha ha-prev" onClick={goToPreviousBanner} aria-label="Banner anterior">
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button type="button" className="ha ha-next" onClick={goToNextBanner} aria-label="Próximo banner">
                                <i className="fas fa-chevron-right"></i>
                            </button>
                            <div className="hero-dots">
                                {visibleBanners.map((banner, index) => (
                                    <button
                                        key={banner.id}
                                        type="button"
                                        className={`hdot ${index === currentBannerIndex ? 'active' : ''}`}
                                        onClick={() => goToBanner(index)}
                                        aria-label={`Ir para banner ${index + 1}`}
                                    ></button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <aside className="hero-aside">
                    <div className="oferta-card">
                        <div className="oc-header">
                            <span className="oc-lbl"><i className="fas fa-bolt"></i> OFERTA DO DIA</span>
                            <div className="oc-timer">
                                <span className="oct">06</span>:<span className="oct">00</span>:<span className="oct">00</span>
                            </div>
                        </div>
                        <div className="oc-img-wrap">
                            <span className="oc-discount">-35%</span>
                            {dealProduct?.imageUrl && (
                                <img
                                    src={dealProduct.imageUrl}
                                    alt={dealProduct.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                        <div className="oc-body">
                            <span className="oc-brand">{dealProduct?.category.name || 'DESTAQUE'}</span>
                            <p className="oc-name">{dealProduct?.name || 'Produto em oferta'}</p>
                            <div className="oc-prices">
                                <span className="oc-old">R$&nbsp;{((dealProduct?.price || 0) * 1.35).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                <span className="oc-new">R$&nbsp;{(dealProduct?.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <span className="oc-parcel">ou 10x R$&nbsp;{((dealProduct?.price || 0) / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</span>
                            {dealProduct && (
                                <button className="btn-oc" onClick={handleDealAdd}>
                                    <i className="fas fa-cart-plus"></i> ADICIONAR AO CARRINHO
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="aside-minis">
                        <a href="#categorias" className="aside-mini am-orange">
                            <i className="fas fa-toolbox"></i>
                            <div><strong>KITS PROFISSIONAIS</strong><span>Monte seu arsenal completo</span></div>
                            <i className="fas fa-chevron-right am-arr"></i>
                        </a>
                        <a href="#marcas" className="aside-mini am-dark">
                            <i className="fas fa-medal"></i>
                            <div><strong>TOP MARCAS</strong><span>Makita · Bosch · DeWalt</span></div>
                            <i className="fas fa-chevron-right am-arr"></i>
                        </a>
                    </div>
                </aside>
            </div>
        </section>
    );
}
