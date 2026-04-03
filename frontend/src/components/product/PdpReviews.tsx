import type { Product } from '../../types/product';
import { getReviews, getFaq } from '../../lib/productDetails';

interface PdpReviewsProps {
    product: Product;
}

export function PdpReviews({ product }: PdpReviewsProps) {
    const reviews = getReviews(product);
    const faq = getFaq(product);

    return (
        <>
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
        </>
    );
}
