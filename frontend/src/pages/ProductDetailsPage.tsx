import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import './ProductDetailsPage.css';
import { api } from '../lib/api';
import { sanitizeProductText } from '../lib/text';
import { useCart } from '../contexts/CartContext';
import { CartDrawer } from '../components/CartDrawer';
import type { Product } from '../types/product';

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function inferBrand(product: Product) {
  const knownBrands = ['bosch', 'makita', 'tramontina', 'dewalt', 'vonder', 'stanley', 'fluke'];
  const productName = product.name.toLowerCase();
  const found = knownBrands.find((brand) => productName.includes(brand));
  if (found) return found.toUpperCase();
  const firstWord = product.name.split(' ')[0];
  return firstWord.toUpperCase();
}

function getBenefits(product: Product) {
  const defaultBenefits = [
    'Alto desempenho no uso diario',
    'Design ergonomico para maior conforto',
    'Construcao robusta e confiavel',
    'Excelente custo-beneficio para quem busca produtividade'
  ];

  const byCategory: Record<string, string[]> = {
    eletricas: [
      'Potencia consistente para tarefas exigentes',
      'Precisao no controle para diferentes aplicacoes',
      'Estrutura resistente para uso continuo',
      'Mais produtividade em montagem e manutencao'
    ],
    manuais: [
      'Pegada firme com acabamento confortavel',
      'Maior precisao na execucao dos ajustes',
      'Durabilidade para rotina de oficina e manutencao',
      'Kit versatil para varias aplicacoes'
    ],
    epi: [
      'Mais seguranca para atividades de risco',
      'Conforto para uso prolongado',
      'Materiais resistentes para maior vida util',
      'Protecao confiavel em diferentes ambientes'
    ]
  };

  const categoryKey = normalize(product.category.name);
  const options = byCategory[categoryKey] ?? defaultBenefits;
  return options.slice(0, 4);
}

function getTechnicalSpecs(product: Product) {
  return [
    `SKU: ${product.sku}`,
    `Categoria: ${product.category.name}`,
    `Quantidade em estoque: ${product.stockQuantity} unidades`,
    'Material principal: aco/composto tecnico de alta resistencia',
    'Aplicacao recomendada: uso profissional e domestico',
    'Acabamento: premium com foco em durabilidade',
    'Compatibilidade: padrao de mercado para acessorios do segmento'
  ];
}

function getFaq(product: Product) {
  return [
    {
      question: `Esse ${product.name} e indicado para uso profissional?`,
      answer: 'Sim. Ele foi desenvolvido para oferecer desempenho estavel tanto em uso profissional quanto em aplicacoes do dia a dia.'
    },
    {
      question: 'Qual e o prazo de garantia?',
      answer: 'A garantia do fabricante e de 12 meses contra defeitos de fabricacao.'
    },
    {
      question: 'Posso usar em ambientes externos?',
      answer: 'Sim, desde que sejam respeitadas as recomendacoes do manual e os cuidados basicos de armazenamento.'
    }
  ];
}

function getReviews(product: Product) {
  return [
    {
      name: 'Carlos M.',
      rating: 5,
      date: '05/03/2026',
      text: `Produto muito bom. O ${product.name} superou minha expectativa no acabamento e na performance.`
    },
    {
      name: 'Renata S.',
      rating: 4,
      date: '26/02/2026',
      text: 'Entrega rapida e otimo custo-beneficio. No uso diario esta sendo bem confiavel.'
    },
    {
      name: 'Joao P.',
      rating: 5,
      date: '17/02/2026',
      text: 'Excelente compra. Recomendo para quem quer qualidade e praticidade no trabalho.'
    }
  ];
}

export function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [failedImages, setFailedImages] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      api.get(`/products/${id}`).then((res) => res.data),
      api.get('/products').then((res) => res.data)
    ])
      .then(([productData, productsData]) => {
        setProduct(sanitizeProductText(productData));
        setProducts(productsData.map((item: Product) => sanitizeProductText(item)));
      })
      .catch((error) => {
        console.error('Erro ao carregar detalhes do produto:', error);
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

  const addCurrentToCart = () => {
    if (!product) return;
    addToCart(product);
    openCart();
  };

  const visibleGallery = useMemo(
    () => imageGallery.filter((url) => !failedImages.includes(url)),
    [imageGallery, failedImages]
  );

  useEffect(() => {
    setFailedImages([]);
    if (imageGallery.length > 0) {
      setActiveImage(imageGallery[0]);
    } else {
      setActiveImage('');
    }
  }, [imageGallery]);

  const markImageAsFailed = (url: string) => {
    setFailedImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
  };

  const activeImageIndex = activeImage ? visibleGallery.indexOf(activeImage) : -1;

  const goToPreviousImage = () => {
    if (visibleGallery.length <= 1 || activeImageIndex < 0) return;
    const prevIndex = (activeImageIndex - 1 + visibleGallery.length) % visibleGallery.length;
    setActiveImage(visibleGallery[prevIndex]);
  };

  const goToNextImage = () => {
    if (visibleGallery.length <= 1 || activeImageIndex < 0) return;
    const nextIndex = (activeImageIndex + 1) % visibleGallery.length;
    setActiveImage(visibleGallery[nextIndex]);
  };

  if (loading) {
    return <div className="pdp-loading">Carregando produto...</div>;
  }

  if (!product || !pricing) {
    return (
      <div className="pdp-loading">
        Produto nao encontrado. <Link to="/">Voltar para a loja</Link>
      </div>
    );
  }

  const brand = inferBrand(product);
  const benefits = getBenefits(product);
  const specs = getTechnicalSpecs(product);
  const reviews = getReviews(product);
  const faq = getFaq(product);

  return (
    <main className="pdp-page">
      <div className="cw">
        <div className="pdp-breadcrumbs">Home &gt; {product.category.name} &gt; {product.name}</div>

        <header className="pdp-header">
          <div className="pdp-gallery">
            <div className="pdp-image-wrap">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  onError={() => markImageAsFailed(activeImage)}
                />
              ) : (
                <div className="pdp-image-placeholder">Sem imagem</div>
              )}

              {visibleGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="pdp-gallery-nav pdp-gallery-prev"
                    onClick={goToPreviousImage}
                    aria-label="Imagem anterior"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    type="button"
                    className="pdp-gallery-nav pdp-gallery-next"
                    onClick={goToNextImage}
                    aria-label="Próxima imagem"
                  >
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
                    <img
                      src={imageUrl}
                      alt={`${product.name} miniatura`}
                      onError={() => markImageAsFailed(imageUrl)}
                    />
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

        <section className="pdp-box">
          <h2>Descricao do produto</h2>
          <h3>Visao geral do produto</h3>
          <p>
            O {product.name} foi desenvolvido para quem precisa de eficiencia e consistencia nas tarefas do dia a dia.
            Ele combina robustez com usabilidade, mantendo otimo desempenho mesmo em rotinas intensas.
          </p>

          {benefits.map((benefit) => (
            <div key={benefit}>
              <h3>{benefit}</h3>
              <p>
                Esse diferencial contribui para uma operacao mais fluida, com melhor resultado final e maior seguranca no uso.
              </p>
            </div>
          ))}

          <p>
            Garanta agora o seu {product.name} e tenha um equipamento confiavel para elevar sua produtividade.
          </p>
        </section>

        <section className="pdp-box">
          <h2>Informacoes tecnicas</h2>
          <h3>Caracteristicas</h3>
          <ul>
            <li>Marca: {brand}</li>
            <li>Modelo: {product.sku}</li>
            <li>Cor: Verde escuro com detalhes em preto</li>
          </ul>

          <h3>Especificacoes</h3>
          <ul>
            {specs.map((spec) => <li key={spec}>{spec}</li>)}
          </ul>

          <h3>Conteudo da embalagem</h3>
          <ul>
            <li>1x {product.name}</li>
            <li>1x Manual de instrucoes</li>
            <li>1x Certificado de garantia</li>
          </ul>

          <h3>Garantia</h3>
          <p>12 meses com o fabricante.</p>

          <h3>Peso aproximado com embalagem</h3>
          <p>1,8 kg.</p>
        </section>

        <section className="pdp-box">
          <h2>Avaliacoes dos usuarios</h2>
          <div className="pdp-review-list">
            {reviews.map((review) => (
              <article key={`${review.name}-${review.date}`} className="pdp-review-item">
                <header>
                  <strong>{review.name}</strong>
                  <span>Nota: {review.rating}/5</span>
                  <span>{review.date}</span>
                </header>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pdp-box">
          <h2>Perguntas e respostas</h2>
          <div className="pdp-faq-list">
            {faq.map((item) => (
              <article key={item.question} className="pdp-faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <CartDrawer />
    </main>
  );
}
