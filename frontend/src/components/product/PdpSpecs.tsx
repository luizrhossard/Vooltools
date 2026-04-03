import type { Product } from '../../types/product';
import { inferBrand, getTechnicalSpecs } from '../../lib/productDetails';

interface PdpSpecsProps {
    product: Product;
}

export function PdpSpecs({ product }: PdpSpecsProps) {
    const brand = inferBrand(product);
    const specs = getTechnicalSpecs(product);

    return (
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
    );
}
