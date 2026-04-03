import { useState, useMemo } from 'react';

const DEPARTMENT_MENU = [
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
];

const NAV_ITEMS = [
    { id: 'departamentos', label: 'TODOS DEPARTAMENTOS', icon: 'fa-th-large', className: 'cnav-all', deptId: null as string | null },
    { id: 'eletricas', label: 'ELÉTRICAS', icon: 'fa-bolt', deptId: 'eletricas' },
    { id: 'manuais', label: 'MANUAIS', icon: 'fa-hammer', deptId: 'manuais' },
    { id: 'medicao', label: 'MEDIÇÃO', icon: 'fa-ruler-combined', deptId: 'medicao' },
    { id: 'epi', label: 'EPI', icon: 'fa-hard-hat', deptId: 'epi' },
    { id: 'mecanica', label: 'MECÂNICA', icon: 'fa-cogs', deptId: 'mecanica' },
    { id: 'ofertas', label: 'OFERTAS', icon: 'fa-tags', className: 'cnav-promo', deptId: null },
];

export function StoreHeader() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [activeDept, setActiveDept] = useState(DEPARTMENT_MENU[0]?.id ?? '');

    const handleNavEnter = (item: typeof NAV_ITEMS[number]) => {
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
    };

    const handleNavFocus = handleNavEnter;

    const activeData = useMemo(
        () => DEPARTMENT_MENU.find((dept) => dept.id === activeDept) ?? DEPARTMENT_MENU[0],
        [activeDept]
    );

    return (
        <>
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
                        <button type="button" className="search-btn">BUSCAR</button>
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
                        <button className="hact hact-cart">
                            <i className="fas fa-shopping-cart"></i>
                            <div className="hact-lbl"><span>Meu</span><strong>Carrinho</strong></div>
                        </button>
                    </div>

                    <button className="hamburger">
                        <span></span><span></span><span></span>
                    </button>
                </div>

                <div className="cat-nav-wrap" onMouseLeave={() => setActiveMenu(null)}>
                    <nav className="cat-nav">
                        <div className="cat-nav-inner">
                            {NAV_ITEMS.map((item) => {
                                const isActive = item.deptId ? activeDept === item.deptId : false;
                                return (
                                    <a
                                        key={item.id}
                                        href={item.id === 'ofertas' ? '#destaques' : '#categorias'}
                                        className={`cnav-item ${item.className ?? ''} ${isActive && activeMenu ? 'is-active' : ''}`}
                                        onMouseEnter={() => handleNavEnter(item)}
                                        onFocus={() => handleNavFocus(item)}
                                    >
                                        <i className={`fas ${item.icon}`}></i> {item.label}
                                        {item.id === 'ofertas' && <span className="promo-pip"></span>}
                                    </a>
                                );
                            })}
                        </div>
                    </nav>

                    <div className={`mega-menu ${activeMenu ? 'open' : ''}`} onMouseEnter={() => setActiveMenu('departamentos')}>
                        {activeData && (
                            <div className="mega-inner">
                                <div className="mega-left">
                                    <div className="mega-left-title">Departamentos</div>
                                    <div className="mega-left-list">
                                        {DEPARTMENT_MENU.map((dept) => (
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
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
