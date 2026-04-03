export function CategoriesSection() {
    return (
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
                        <span className="cc-name">EPI &amp; SEG.</span>
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
    );
}
