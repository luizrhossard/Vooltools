import { useState } from 'react';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    selectedCategoryId: string;
    setSelectedCategoryId: (val: string) => void;
    categories: Array<{ id: number; name: string }>;
    cartCount: number;
    onOpenCart: () => void;
}

export function Header({ searchTerm, setSearchTerm, selectedCategoryId, setSelectedCategoryId, categories, cartCount, onOpenCart }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {/* TOPBAR */}
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
                        </span>
                    </div>
                    <div className="tb-right">
                        <span><i className="fas fa-phone"></i> (11) 4002-8922</span>
                        <span className="tb-sep">|</span>
                        <a href="#"><i className="fas fa-user"></i> Entrar</a>
                    </div>
                </div>
            </div>

            {/* HEADER */}
            <header className="site-header" id="siteHeader">
                <div className="header-inner">
                    <a href="#" className="site-logo">
                        <span className="logo">VOLT<span>TOOLS</span></span>
                    </a>

                    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                        <select
                            className="search-sel search-select"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                        >
                            <option value="">Todas as Categorias</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Buscar produto, marca ou referência..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="button" className="search-btn">
                            <i className="fas fa-search"></i> BUSCAR
                        </button>
                    </form>

                    <div className="header-acts">
                        <button className="hact hact-cart cart-btn" onClick={onOpenCart}>
                            <i className="fas fa-shopping-cart" style={{ display: 'none' }}></i>
                            <span className="label">MEU</span>
                            <span className="title">Carrinho</span>
                            {cartCount > 0 && (
                                <span className="hact-badge">{cartCount}</span>
                            )}
                        </button>
                    </div>

                    <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none' }}>
                        <span></span><span></span><span></span>
                    </button>
                </div>

                <nav className={`cat-nav ${menuOpen ? 'open' : ''}`} style={{ display: 'none' }}>
                    <div className="cat-nav-inner">
                        <a href="#categorias" className="cnav-item cnav-all">
                            <i className="fas fa-th-large"></i> TODOS DEPARTAMENTOS
                        </a>
                        <a href="#categorias" className="cnav-item"><i className="fas fa-bolt"></i> ELÉTRICAS</a>
                        <a href="#categorias" className="cnav-item"><i className="fas fa-hammer"></i> MANUAIS</a>
                        <a href="#categorias" className="cnav-item"><i className="fas fa-ruler-combined"></i> MEDIÇÃO</a>
                        <a href="#categorias" className="cnav-item"><i className="fas fa-hard-hat"></i> EPI</a>
                        <a href="#destaques" className="cnav-item cnav-promo">
                            <i className="fas fa-tags"></i> OFERTAS <span className="promo-pip"></span>
                        </a>
                    </div>
                </nav>
            </header>
        </>
    );
}
