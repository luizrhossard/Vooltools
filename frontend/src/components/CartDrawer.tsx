import { useCart } from '../contexts/CartContext';

export function CartDrawer() {
    const { cartItems, cartTotal, cartCount, isCartOpen, closeCart, updateQuantity, removeFromCart } = useCart();
    const fmt = (n: number) =>
        `R$\u00a0${n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    return (
        <>
            <div className={`overlay ${isCartOpen ? 'open' : ''}`} onClick={closeCart}></div>

            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} id="cartDrawer">
                <div className="drawer-hd">
                    <h3><i className="fas fa-shopping-cart"></i> MEU CARRINHO</h3>
                    <button className="drawer-close" onClick={closeCart}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="drawer-items">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <i className="fas fa-shopping-cart"></i>
                            <p>Seu carrinho está vazio</p>
                            <button className="btn-empty-go" onClick={closeCart}>VER PRODUTOS</button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-item" key={item.product.id}>
                                <div className="ci-icon">
                                    {item.product.imageUrl
                                        ? <img src={item.product.imageUrl} alt={item.product.name} />
                                        : <i className="fas fa-tools" style={{ fontSize: '1.4rem', color: 'var(--forest)' }}></i>
                                    }
                                </div>
                                <div className="ci-info">
                                    <div className="ci-name">{item.product.name}</div>
                                    <div className="ci-price">{fmt(item.product.price * item.quantity)}</div>
                                    <div className="ci-qty">
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="ci-remove"
                                    onClick={() => removeFromCart(item.product.id)}
                                    title="Remover"
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--red)' }}
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="drawer-ft">
                        <div className="cart-total-row">
                            <span>SUBTOTAL ({cartCount} {cartCount === 1 ? 'item' : 'itens'})</span>
                            <span className="ctv">{fmt(cartTotal)}</span>
                        </div>
                        <div className="cart-parcel" style={{ fontSize: '0.8rem', color: 'var(--gray-md)', marginBottom: '1rem' }}>
                            ou 10x de {fmt(cartTotal / 10)} sem juros
                        </div>
                        <button className="btn-checkout">
                            FINALIZAR COMPRA <i className="fas fa-arrow-right"></i>
                        </button>
                        <button className="btn-keep" onClick={closeCart}>
                            <i className="fas fa-arrow-left"></i> CONTINUAR COMPRANDO
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}