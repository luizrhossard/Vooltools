export function NewsletterSection() {
    return (
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
                    <input type="email" className="nl-input" placeholder="seu@email.com.br" required />
                    <button type="submit" className="nl-btn">CADASTRAR <i className="fas fa-arrow-right"></i></button>
                </form>
            </div>
        </section>
    );
}
