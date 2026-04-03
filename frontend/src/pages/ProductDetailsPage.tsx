import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import './ProductDetailsPage.css';
import { ApiErrorNotice } from '../components/ApiErrorNotice';
import { apiClient, getApiErrorMessage } from '../lib/apiClient';
import { sanitizeProductText } from '../lib/text';
import { inferBrand } from '../lib/productDetails';
import { PdpDescription } from '../components/product/PdpDescription';
import { PdpSpecs } from '../components/product/PdpSpecs';
import { PdpReviews } from '../components/product/PdpReviews';
import { useCart } from '../contexts/CartContext';
import { CartDrawer } from '../components/CartDrawer';
import type { Product } from '../types/product';

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [failedImages, setFailedImages] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setLoadError(null);

    Promise.all([
      apiClient.get<Product>(`/products/${id}`).then((res) => res.data),
      apiClient.get<Product[]>('/products').then((res) => res.data)
    ])
      .then(([productData, productsData]) => {
        setProduct(sanitizeProductText(productData));
        setProducts(productsData.map((item: Product) => sanitizeProductText(item)));
      })
      .catch((error: unknown) => {
        setLoadError(getApiErrorMessage(error, 'Não foi possível carregar os detalhes do produto.'));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id && item.category.id === product.category.id)
      .slice(0, 2);
  }, [product, products]);

  const imageGallery = useMemo(() => {
    if (!product) return [];
    const seededImages = [
      `https://picsum.photos/seed/${product.sku}-1/900/900`,
      `https://picsum.photos/seed/${product.sku}-2/900/900`,
      `https://picsum.photos/seed/${product.sku}-3/900/900`
    ];
    const images = [product.imageUrl, ...seededImages].filter(Boolean) as string[];
    return Array.from(new Set(images));
  }, [product]);

  const pricing = useMemo(() => {
    if (!product) return null;
    const fullPrice = Number((product.price * 1.14).toFixed(2));
    const pixPrice = Number((product.price * 0.93).toFixed(2));
    const installmentCount = 10;
    const installmentValue = Number((fullPrice / installmentCount).toFixed(2));
    return { fullPrice, pixPrice, installmentCount, installmentValue };
  }, [product]);

  const visibleGallery = useMemo(
    () => imageGallery.filter((url) => !failedImages.includes(url)),
    [imageGallery, failedImages]
  );

  useEffect(() => {
    setFailedImages([]);
    if (imageGallery.length > 0) setActiveImage(imageGallery[0]);
    else setActiveImage('');
  }, [imageGallery]);

  const markImageAsFailed = (url: string) => {
    setFailedImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
  };

  const activeImageIndex = activeImage ? visibleGallery.indexOf(activeImage) : -1;

  const goToPreviousImage = () => {
    if (visibleGallery.length <= 1 || activeImageIndex < 0) return;
    setActiveImage(visibleGallery[(activeImageIndex - 1 + visibleGallery.length) % visibleGallery.length]);
  };

  const goToNextImage = () => {
    if (visibleGallery.length <= 1 || activeImageIndex < 0) return;
    setActiveImage(visibleGallery[(activeImageIndex + 1) % visibleGallery.length]);
  };

  const addCurrentToCart = () => {
    if (!product) return;
    addToCart(product);
    openCart();
  };

  if (loading) return <div className="pdp-loading">Carregando produto...</div>;

  if (loadError) {
    return (
      <main className="pdp-page">
        <div className="cw" style={{ marginTop: '40px' }}>
          <ApiErrorNotice message={loadError} onRetry={() => window.location.reload()} />
          <Link to="/">Voltar para a loja</Link>
        </div>
      </main>
    );
  }

  if (!product || !pricing) {
    return (
      <div className="pdp-loading">
        Produto nao encontrado. <Link to="/">Voltar para a loja</Link>
      </div>
    );
  }

  const brand = inferBrand(product);

  return (
    <main className="pdp-page">
      <div className="cw">
        <div className="pdp-breadcrumbs">Home &gt; {product.category.name} &gt; {product.name}</div>

        <header className="pdp-header">
          <div className="pdp-gallery">
            <div className="pdp-image-wrap">
              {activeImage ? (
                <img src={activeImage} alt={product.name} onError={() => markImageAsFailed(activeImage)} />
              ) : (
                <div className="pdp-image-placeholder">Sem imagem</div>
              )}

              {visibleGallery.length > 1 && (
                <>
                  <button type="button" className="pdp-gallery-nav pdp-gallery-prev" onClick={goToPreviousImage} aria-label="Imagem anterior">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button type="button" className="pdp-gallery-nav pdp-gallery-next" onClick={goToNextImage} aria-label="Próxima imagem">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>

            {visibleGallery.length > 1 && (
              <div className="pdp-thumb-row">
                {visibleGallery.map((imageUrl) => (
                  <button
                    key={imageUrl}
                    type="button"
                    className={`pdp-thumb ${activeImage === imageUrl ? 'is-active' : ''}`}
                    onClick={() => setActiveImage(imageUrl)}
                  >
                    <img src={imageUrl} alt={`${product.name} miniatura`} onError={() => markImageAsFailed(imageUrl)} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pdp-main-info">
            <h1>{product.name}</h1>
            <p className="pdp-subtitle">Performance, durabilidade e precisao para quem leva resultado a serio.</p>

            <section className="pdp-box">
              <h2>Sobre o produto</h2>
              <ul>
                <li>Produto da marca {brand} com foco em qualidade e confiabilidade.</li>
                <li>Ideal para uso em {product.category.name.toLowerCase()} com excelente acabamento.</li>
                <li>Perfeito para profissionais e usuarios que buscam produtividade.</li>
                <li>Otimo custo-beneficio para projetos de manutencao e rotina operacional.</li>
              </ul>
            </section>

            <section className="pdp-grid-2">
              <article className="pdp-box">
                <h2>Preco</h2>
                <p className="pdp-price-full">De: {formatPrice(pricing.fullPrice)}</p>
                <p className="pdp-price-pix">Por: {formatPrice(pricing.pixPrice)} a vista</p>
                <p className="pdp-price-installments">ou {pricing.installmentCount}x de {formatPrice(pricing.installmentValue)} sem juros</p>
                <button className="btn-hs" onClick={addCurrentToCart}>ADICIONAR AO CARRINHO</button>
              </article>

              <article className="pdp-box">
                <h2>Frete</h2>
                <ul>
                  <li>Frete economico: {formatPrice(24.9)} • prazo de 6 a 9 dias uteis</li>
                  <li>Frete expresso: {formatPrice(39.9)} • prazo de 2 a 4 dias uteis</li>
                </ul>
              </article>
            </section>

            {relatedProducts.length > 0 && (
              <section className="pdp-box">
                <h2>Aproveite e compre junto</h2>
                <div className="pdp-related-list">
                  {relatedProducts.map((item) => (
                    <Link key={item.id} to={`/produto/${item.id}`} className="pdp-related-item">
                      <strong>{item.name}</strong>
                      <span>{formatPrice(item.price)}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </header>

        <PdpDescription product={product} />
        <PdpSpecs product={product} />
        <PdpReviews product={product} />
      </div>

      <CartDrawer />
    </main>
  );
}
