import type { Product } from '../../types/product';
import { getBenefits } from '../../lib/productDetails';

interface PdpDescriptionProps {
    product: Product;
}

export function PdpDescription({ product }: PdpDescriptionProps) {
    const benefits = getBenefits(product);

    return (
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
    );
}
