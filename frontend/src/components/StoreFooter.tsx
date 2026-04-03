export function StoreFooter() {
    return (
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
                            <img src="/static/logo-volttools.png" alt="VoltTools" className="footer-logo-img" />
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
    );
}
