import './App.css';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useCart } from './contexts/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { ProductCard } from './components/ProductCard';
import { Toast } from './components/Toast';
import { ApiErrorNotice } from './components/ApiErrorNotice';
import { apiClient, getApiErrorMessage } from './lib/apiClient';
import { sanitizeProductText } from './lib/text';
import type { Product, Banner } from './types/product';

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

function App() {
  const { cartCount, openCart, addToCart } = useCart();
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);

    Promise.all([
      apiClient.get<Product[]>('/products').then((res) => res.data),
      apiClient.get<Banner[]>('/banners/active').then((res) => res.data)
    ]).then(([productsData, bannersData]) => {
      setProducts(productsData.map((product: Product) => sanitizeProductText(product)));
      setBanners(bannersData);
      setIsLoading(false);
    }).catch((error: unknown) => {
      setLoadError(getApiErrorMessage(error, 'Não foi possível carregar os dados da loja.'));
      setIsLoading(false);
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, message: msg });
  }, []);

  const hideToast = useCallback(() => {
    setToast(t => ({ ...t, visible: false }));
  }, []);

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

  const dealProduct = useMemo(() => {
    if (products.length === 0) return null;
    return products.find(p => p.featured) || products[0];
  }, [products]);

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
    return (dealProduct?.price ?? products[0]?.price ?? 12.9).toLocaleString('pt-BR', {
      minimumFractionDigits: 2
    });
  }, [dealProduct, products]);

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

  const departmentMenu = useMemo(() => ([
    {
      id: 'eletricas',
      label: 'Elétricas',
      desc: 'Furadeiras, serras e kits',
      icon: 'fa-bolt',
      groups: [
        { title: 'Parafusadeiras', items: ['Impacto', 'Furadeira/Paraf. combo', 'Chave de impacto', 'Kits 12V e 20V'] },
        { title: 'Cortes', items: ['Serra circular', 'Serra tico-tico', 'Serra sabre', 'Discos e lâminas'] },
        { title: 'Acessórios', items: ['Baterias', 'Carregadores', 'Brocas', 'Maletas'] },
      ],
      promo: { eyebrow: 'Linha 20V MAX', title: 'Poder e autonomia', cta: 'Ver elétricas' },
    },
    {
      id: 'manuais',
      label: 'Manuais',
      desc: 'Chaves, alicates e kits',
      icon: 'fa-hammer',
      groups: [
        { title: 'Chaves', items: ['Combinadas', 'Soquetes', 'Allen/Hex', 'Torx e Philips'] },
        { title: 'Alicates', items: ['Corte', 'Bico', 'Pressão', 'Rebitadores'] },
        { title: 'Fixação', items: ['Sargentos', 'Torquímetros', 'Grampo rápido', 'Morsas'] },
      ],
      promo: { eyebrow: 'Linha Profissional', title: 'Mais precisão', cta: 'Ver manuais' },
    },
    {
      id: 'medicao',
      label: 'Medição',
      desc: 'Laser, nível e precisão',
      icon: 'fa-ruler-combined',
      groups: [
        { title: 'Medição digital', items: ['Trenas a laser', 'Medidores', 'Detectores', 'Termômetros'] },
        { title: 'Nível', items: ['Nível bolha', 'Nível laser', 'Prumos', 'Tripés'] },
        { title: 'Marcação', items: ['Riscadores', 'Esquadros', 'Paquímetros', 'Marcadores'] },
      ],
      promo: { eyebrow: 'Precisão total', title: 'Confiança no corte', cta: 'Ver medição' },
    },
    {
      id: 'epi',
      label: 'EPI',
      desc: 'Proteção e segurança',
      icon: 'fa-hard-hat',
      groups: [
        { title: 'Proteção', items: ['Capacetes', 'Óculos', 'Luvas', 'Respiradores'] },
        { title: 'Calçados', items: ['Botinas', 'Botas', 'Palmilhas', 'Meias técnicas'] },
        { title: 'Sinalização', items: ['Cones', 'Fitas', 'Placas', 'Iluminação'] },
      ],
      promo: { eyebrow: 'Segurança', title: 'Obra protegida', cta: 'Ver EPI' },
    },
    {
      id: 'mecanica',
      label: 'Mecânica',
      desc: 'Oficina e automotivo',
      icon: 'fa-cogs',
      groups: [
        { title: 'Pneumáticas', items: ['Chave de impacto', 'Calibradores', 'Mangueiras', 'Conectores'] },
        { title: 'Automotivo', items: ['Macacos', 'Cavaletes', 'Chaves de roda', 'Organizadores'] },
        { title: 'Lubrificação', items: ['Graxeiras', 'Óleos', 'Bicos', 'Bombas'] },
      ],
      promo: { eyebrow: 'Oficina', title: 'Força no dia a dia', cta: 'Ver mecânica' },
    },
  ]), []);

  const navItems = useMemo(() => ([
    { id: 'departamentos', label: 'TODOS DEPARTAMENTOS', icon: 'fa-th-large', className: 'cnav-all', deptId: null },
    { id: 'eletricas', label: 'ELÉTRICAS', icon: 'fa-bolt', deptId: 'eletricas' },
    { id: 'manuais', label: 'MANUAIS', icon: 'fa-hammer', deptId: 'manuais' },
    { id: 'medicao', label: 'MEDIÇÃO', icon: 'fa-ruler-combined', deptId: 'medicao' },
    { id: 'epi', label: 'EPI', icon: 'fa-hard-hat', deptId: 'epi' },
    { id: 'mecanica', label: 'MECÂNICA', icon: 'fa-cogs', deptId: 'mecanica' },
    { id: 'ofertas', label: 'OFERTAS', icon: 'fa-tags', className: 'cnav-promo', deptId: null },
  ]), []);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeDept, setActiveDept] = useState(departmentMenu[0]?.id ?? '');

  const handleAdded = useCallback((product: Product) => {
    showToast(`"${product.name}" adicionado ao carrinho`);
  }, [showToast]);

  const handleDealAdd = useCallback((product: Product) => {
    addToCart(product);
    openCart();
    showToast(`"${product.name}" adicionado ao carrinho`);
  }, [addToCart, openCart, showToast]);

  return (
    <>
      {/* -- TOPBAR -- */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="tb-marquee">
            <span className="tb-m-track">
              <span><i className="fas fa-truck"></i>&nbsp;FRETE GRÁTIS acima de R$&nbsp;299</span>
              <span className="tb-dot">•</span>
              <span><i className="fas fa-bolt"></i>&nbsp;10X SEM JUROS em todas as bandeiras</span>
              <span className="tb-dot">•</span>
              <span><i className="fas fa-shield-alt"></i>&nbsp;GARANTIA em todos os produtos</span>
              <span className="tb-dot">•</span>
              <span><i className="fas fa-undo"></i>&nbsp;TROCA em 30 dias</span>
              <span className="tb-dot">•</span>
              <span><i className="fas fa-truck"></i>&nbsp;FRETE GRÁTIS acima de R$&nbsp;299</span>
              <span className="tb-dot">•</span>
              <span><i className="fas fa-bolt"></i>&nbsp;10X SEM JUROS em todas as bandeiras</span>
            </span>
          </div>
          <div className="tb-right">
            <span><i className="fas fa-phone"></i> (11) 4002-8922</span>
            <span className="tb-sep">|</span>
            <a href="#"><i className="fas fa-user"></i> Entrar</a>
          </div>
        </div>
      </div>

      {/* -- HEADER -- */}
      <header className="site-header" id="siteHeader">
        <div className="header-inner">
          <a href="#" className="site-logo">
            <img src="/static/logo-volttools.png" alt="VoltTools" className="site-logo-img" />
          </a>

          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="search-prefix">
              <i className="fas fa-search"></i>
            </div>
            <input type="text" className="search-input" placeholder="Buscar produto, marca ou referência..." />
            <button type="button" className="search-btn">
              BUSCAR
            </button>
          </form>

          <div className="header-acts">
            <a href="#" className="hact">
              <i className="fas fa-user-circle"></i>
              <div className="hact-lbl"><span>Olá, faça</span><strong>Login</strong></div>
            </a>
            <button className="hact">
              <i className="far fa-heart"></i>
              <div className="hact-lbl"><span>Meus</span><strong>Favoritos</strong></div>
            </button>
            <button className="hact hact-cart" onClick={openCart}>
              <i className="fas fa-shopping-cart"></i>
              <div className="hact-lbl"><span>Meu</span><strong>Carrinho</strong></div>
              {cartCount > 0 && (
                <span className="hact-badge">{cartCount}</span>
              )}
          </button>
        </div>

        <button className="hamburger">
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className="cat-nav-wrap" onMouseLeave={() => setActiveMenu(null)}>
        <nav className="cat-nav">
          <div className="cat-nav-inner">
            {navItems.map((item) => {
              const isActive = item.deptId ? activeDept === item.deptId : false;
              return (
                <a
                  key={item.id}
                  href={item.id === 'ofertas' ? '#destaques' : '#categorias'}
                  className={`cnav-item ${item.className ?? ''} ${isActive && activeMenu ? 'is-active' : ''}`}
                  onMouseEnter={() => {
                    if (item.deptId) {
                      setActiveDept(item.deptId);
                      setActiveMenu('departamentos');
                      return;
                    }
                    if (item.id === 'departamentos') {
                      setActiveMenu('departamentos');
                    } else {
                      setActiveMenu(null);
                    }
                  }}
                  onFocus={() => {
                    if (item.deptId) {
                      setActiveDept(item.deptId);
                      setActiveMenu('departamentos');
                      return;
                    }
                    if (item.id === 'departamentos') {
                      setActiveMenu('departamentos');
                    } else {
                      setActiveMenu(null);
                    }
                  }}
                >
                  <i className={`fas ${item.icon}`}></i> {item.label}
                  {item.id === 'ofertas' && <span className="promo-pip"></span>}
                </a>
              );
            })}
          </div>
        </nav>

        <div className={`mega-menu ${activeMenu ? 'open' : ''}`} onMouseEnter={() => setActiveMenu('departamentos')}>
          {(() => {
            const activeData = departmentMenu.find((dept) => dept.id === activeDept) ?? departmentMenu[0];
            if (!activeData) return null;
            return (
              <div className="mega-inner">
                <div className="mega-left">
                  <div className="mega-left-title">Departamentos</div>
                  <div className="mega-left-list">
                    {departmentMenu.map((dept) => (
                      <button
                        key={dept.id}
                        type="button"
                        className={`mega-left-item ${activeDept === dept.id ? 'is-active' : ''}`}
                        onMouseEnter={() => setActiveDept(dept.id)}
                        onFocus={() => setActiveDept(dept.id)}
                      >
                        <i className={`fas ${dept.icon}`}></i>
                        <div className="mega-left-text">
                          <span className="mega-left-name">{dept.label}</span>
                          <span className="mega-left-desc">{dept.desc}</span>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mega-right">
                  <div className="mega-right-header">
                    <span className="mega-title">
                      <i className={`fas ${activeData.icon}`}></i>
                      {activeData.label}
                    </span>
                    <a className="mega-all" href="#categorias">Ver tudo</a>
                  </div>

                  <div className="mega-cols">
                    {activeData.groups.map((group) => (
                      <div key={group.title} className="mega-col">
                        <span className="mega-col-title">{group.title}</span>
                        <ul className="mega-col-list">
                          {group.items.map((item) => (
                            <li key={item}>
                              <a href="#categorias">{item}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="mega-cta">
                    <span className="mega-cta-eyebrow">{activeData.promo.eyebrow}</span>
                    <strong className="mega-cta-title">{activeData.promo.title}</strong>
                    <a href="#destaques" className="mega-cta-btn">
                      {activeData.promo.cta} <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      </header>

      <main>
        {loadError && (
          <section className="cw" style={{ marginTop: '20px' }}>
            <ApiErrorNotice message={loadError} onRetry={() => window.location.reload()} />
          </section>
        )}

        {/* --- HERO BANNER + ASIDE --- */}
        <section className="hero-section">
          <div className="cw hero-wrap">

            {/* HERO SLIDES */}
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
                    <h1 className="hs-h1">FERRAMENTAS<br/><em>PROFISSIONAIS.</em></h1>
                    <p className="hs-lead">As melhores marcas com os melhores preços.<br/>Qualidade que você confia.</p>
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

            {/* ASIDE */}
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
                    <button className="btn-oc" onClick={() => handleDealAdd(dealProduct)}>
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

        {/* --- BENEFITS BAR --- */}
        <div className="benefits-bar">
          <div className="cw benefits-inner">
            <div className="ben"><i className="fas fa-truck"></i><div><strong>FRETE GRÁTIS</strong><span>Acima de R$&nbsp;299</span></div></div>
            <div className="ben-sep"></div>
            <div className="ben"><i className="fas fa-credit-card"></i><div><strong>10X SEM JUROS</strong><span>Todos os cartões</span></div></div>
            <div className="ben-sep"></div>
            <div className="ben"><i className="fas fa-award"></i><div><strong>GARANTIA</strong><span>Em todos os produtos</span></div></div>
            <div className="ben-sep"></div>
            <div className="ben"><i className="fas fa-headset"></i><div><strong>SUPORTE TÉCNICO</strong><span>Seg–Sex 8h–18h</span></div></div>
            <div className="ben-sep"></div>
            <div className="ben"><i className="fas fa-undo"></i><div><strong>30 DIAS</strong><span>Troca garantida</span></div></div>
          </div>
        </div>

        {/* --- CATEGORIAS --- */}
        <section className="page-sec" id="categorias">
          <div className="cw">
            <div className="sec-hd">
              <h2 className="sec-title">DEPARTAMENTOS</h2>
              <a href="#" className="sec-more">Ver todos <i className="fas fa-arrow-right"></i></a>
            </div>
            <div className="cat-grid">
              <a href="#" className="cat-card">
                <div className="cc-icon-wrap cc-orange"><i className="fas fa-bolt"></i></div>
                <span className="cc-name">ELÉTRICAS</span>
                <span className="cc-count">+320 itens</span>
              </a>
              <a href="#" className="cat-card">
                <div className="cc-icon-wrap cc-slate"><i className="fas fa-hammer"></i></div>
                <span className="cc-name">MANUAIS</span>
                <span className="cc-count">+580 itens</span>
              </a>
              <a href="#" className="cat-card">
                <div className="cc-icon-wrap cc-blue"><i className="fas fa-ruler-combined"></i></div>
                <span className="cc-name">MEDIÇÃO</span>
                <span className="cc-count">+145 itens</span>
              </a>
              <a href="#" className="cat-card">
                <div className="cc-icon-wrap cc-green"><i className="fas fa-hard-hat"></i></div>
                <span className="cc-name">EPI & SEG.</span>
                <span className="cc-count">+210 itens</span>
              </a>
              <a href="#" className="cat-card">
                <div className="cc-icon-wrap cc-red"><i className="fas fa-cogs"></i></div>
                <span className="cc-name">MECÂNICA</span>
                <span className="cc-count">+190 itens</span>
              </a>
              <a href="#" className="cat-card">
                <div className="cc-icon-wrap cc-wood"><i className="fas fa-tree"></i></div>
                <span className="cc-name">MARCENARIA</span>
                <span className="cc-count">+270 itens</span>
              </a>
              <a href="#" className="cat-card">
                <div className="cc-icon-wrap cc-yellow"><i className="fas fa-plug"></i></div>
                <span className="cc-name">ELÉTRICA</span>
                <span className="cc-count">+130 itens</span>
              </a>
              <a href="#" className="cat-card">
                <div className="cc-icon-wrap cc-pink"><i className="fas fa-spray-can"></i></div>
                <span className="cc-name">PINTURA</span>
                <span className="cc-count">+95 itens</span>
              </a>
            </div>
          </div>
        </section>

        {/* --- PRODUTOS --- */}
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

        {/* --- BRANDS --- */}
        <section className="brands-sec" id="marcas">
          <div className="cw">
            <div className="sec-hd">
              <h2 className="sec-title">MARCAS PARCEIRAS</h2>
            </div>
            <div className="brands-overflow">
              <div className="brands-track">
                <div className="brand-chip bc-makita">MAKITA</div>
                <div className="brand-chip bc-bosch">BOSCH</div>
                <div className="brand-chip bc-dewalt">DEWALT</div>
                <div className="brand-chip bc-stanley">STANLEY</div>
                <div className="brand-chip">TRAMONTINA</div>
                <div className="brand-chip bc-3m">3M</div>
                <div className="brand-chip bc-fluke">FLUKE</div>
                <div className="brand-chip">VONDER</div>
                <div className="brand-chip">IRWIN</div>
                <div className="brand-chip">WEGA</div>
                <div className="brand-chip bc-makita">MAKITA</div>
                <div className="brand-chip bc-bosch">BOSCH</div>
                <div className="brand-chip bc-dewalt">DEWALT</div>
                <div className="brand-chip bc-stanley">STANLEY</div>
                <div className="brand-chip">TRAMONTINA</div>
                <div className="brand-chip bc-3m">3M</div>
                <div className="brand-chip bc-fluke">FLUKE</div>
                <div className="brand-chip">VONDER</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- NEWSLETTER --- */}
        <section className="newsletter-sec">
          <div className="cw nl-inner">
            <div className="nl-left">
              <div className="nl-icon"><i className="fas fa-envelope-open-text"></i></div>
              <div>
                <h3>RECEBA NOSSAS OFERTAS</h3>
                <p>Promoções exclusivas direto no seu e-mail. Sem spam, prometemos.</p>
              </div>
            </div>
            <form className="nl-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" className="nl-input" placeholder="seu@email.com.br" required/>
              <button type="submit" className="nl-btn">CADASTRAR <i className="fas fa-arrow-right"></i></button>
            </form>
          </div>
        </section>
      </main>

      {/* -- FOOTER -- */}
      <footer className="site-footer">
        <div className="footer-strip">
          <div className="cw footer-strip-inner">
            <div className="fs-item"><i className="fas fa-map-marker-alt"></i><div><strong>RASTREAR PEDIDO</strong><span>Acompanhe online</span></div></div>
            <div className="fs-div"></div>
            <div className="fs-item"><i className="fas fa-headset"></i><div><strong>SUPORTE TÉCNICO</strong><span>Atendimento especializado</span></div></div>
            <div className="fs-div"></div>
            <div className="fs-item"><i className="fas fa-undo"></i><div><strong>DEVOLUÇÕES</strong><span>30 dias garantidos</span></div></div>
            <div className="fs-div"></div>
            <div className="fs-item"><i className="fas fa-lock"></i><div><strong>COMPRA SEGURA</strong><span>SSL 256-bit</span></div></div>
          </div>
        </div>

        <div className="footer-body">
          <div className="cw footer-body-inner">
            <div className="fc fc-brand">
              <a href="#" className="ft-logo">
                <img src="/static/logo-volttools.png" alt="VoltTools" className="footer-logo-img"/>
              </a>
              <p>A loja de ferramentas profissionais. Qualidade premium, preços justos e suporte técnico especializado.</p>
              <div className="ft-socials">
                <a href="#" title="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
                <a href="#" title="YouTube"><i className="fab fa-youtube"></i></a>
                <a href="#" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" title="TikTok"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>

            <div className="fc">
              <h4 className="fc-title">INSTITUCIONAL</h4>
              <ul className="fc-list">
                <li><a href="#">Sobre a VOLT TOOLS</a></li>
                <li><a href="#">Como comprar</a></li>
                <li><a href="#">Políticas de pagamento</a></li>
                <li><a href="#">Políticas de entrega</a></li>
                <li><a href="#">Trabalhe conosco</a></li>
                <li><a href="#">Blog técnico</a></li>
              </ul>
            </div>

            <div className="fc">
              <h4 className="fc-title">ATENDIMENTO</h4>
              <ul className="fc-list">
                <li><a href="#">Central de ajuda</a></li>
                <li><a href="#">Meus pedidos</a></li>
                <li><a href="#">Trocas e devoluções</a></li>
                <li><a href="#">Garantia</a></li>
                <li><a href="#">Fale conosco</a></li>
              </ul>
              <div className="fc-contact">
                <span><i className="fas fa-phone"></i> (11) 4002-8922</span>
                <span><i className="fas fa-envelope"></i> contato@volttools.com</span>
                <span><i className="fas fa-clock"></i> Seg–Sex 8h–18h</span>
              </div>
            </div>

            <div className="fc">
              <h4 className="fc-title">FORMAS DE PAGAMENTO</h4>
              <div className="pay-icons">
                <span className="pay-ic"><i className="fab fa-cc-visa"></i></span>
                <span className="pay-ic"><i className="fab fa-cc-mastercard"></i></span>
                <span className="pay-ic"><i className="fab fa-cc-amex"></i></span>
                <span className="pay-ic"><i className="fas fa-barcode"></i></span>
                <span className="pay-ic"><i className="fas fa-qrcode"></i></span>
              </div>
              <h4 className="fc-title" style={{ marginTop: '1.25rem' }}>SEGURANÇA</h4>
              <div className="cert-row">
                <span className="cert-badge"><i className="fas fa-lock"></i> SSL</span>
                <span className="cert-badge"><i className="fas fa-shield-alt"></i> SEGURO</span>
                <span className="cert-badge"><i className="fas fa-certificate"></i> ISO</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="cw footer-bottom-inner">
            <p>&copy; 2025 VOLT TOOLS. Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
            <div className="ft-status"><span className="status-dot"></span> LOJA ONLINE ATIVA</div>
          </div>
        </div>
      </footer>

      {/* -- CARRINHO DRAWER -- */}
      <CartDrawer />

      {/* -- BACK TO TOP -- */}
      <button className="btt" title="Topo"><i className="fas fa-chevron-up"></i></button>

      {/* -- TOAST -- */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onHide={hideToast}
      />
    </>
  );
}

export default App;
