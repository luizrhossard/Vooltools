import type { Product } from '../types/product';

export function inferBrand(product: Product) {
    const knownBrands = ['bosch', 'makita', 'tramontina', 'dewalt', 'vonder', 'stanley', 'fluke'];
    const productName = product.name.toLowerCase();
    const found = knownBrands.find((brand) => productName.includes(brand));
    if (found) return found.toUpperCase();
    const firstWord = product.name.split(' ')[0];
    return firstWord.toUpperCase();
}

export function getBenefits(product: Product) {
    const defaultBenefits = [
        'Alto desempenho no uso diario',
        'Design ergonomico para maior conforto',
        'Construcao robusta e confiavel',
        'Excelente custo-beneficio para quem busca produtividade'
    ];

    const byCategory: Record<string, string[]> = {
        eletricas: [
            'Potencia consistente para tarefas exigentes',
            'Precisao no controle para diferentes aplicacoes',
            'Estrutura resistente para uso continuo',
            'Mais produtividade em montagem e manutencao'
        ],
        manuais: [
            'Pegada firme com acabamento confortavel',
            'Maior precisao na execucao dos ajustes',
            'Durabilidade para rotina de oficina e manutencao',
            'Kit versatil para varias aplicacoes'
        ],
        epi: [
            'Mais seguranca para atividades de risco',
            'Conforto para uso prolongado',
            'Materiais resistentes para maior vida util',
            'Protecao confiavel em diferentes ambientes'
        ]
    };

    const categoryKey = product.category.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const options = byCategory[categoryKey] ?? defaultBenefits;
    return options.slice(0, 4);
}

export function getTechnicalSpecs(product: Product) {
    return [
        `SKU: ${product.sku}`,
        `Categoria: ${product.category.name}`,
        `Quantidade em estoque: ${product.stockQuantity} unidades`,
        'Material principal: aco/composto tecnico de alta resistencia',
        'Aplicacao recomendada: uso profissional e domestico',
        'Acabamento: premium com foco em durabilidade',
        'Compatibilidade: padrao de mercado para acessorios do segmento'
    ];
}

export function getFaq(product: Product) {
    return [
        {
            question: `Esse ${product.name} e indicado para uso profissional?`,
            answer: 'Sim. Ele foi desenvolvido para oferecer desempenho estavel tanto em uso profissional quanto em aplicacoes do dia a dia.'
        },
        {
            question: 'Qual e o prazo de garantia?',
            answer: 'A garantia do fabricante e de 12 meses contra defeitos de fabricacao.'
        },
        {
            question: 'Posso usar em ambientes externos?',
            answer: 'Sim, desde que sejam respeitadas as recomendacoes do manual e os cuidados basicos de armazenamento.'
        }
    ];
}

export function getReviews(product: Product) {
    return [
        {
            name: 'Carlos M.',
            rating: 5,
            date: '05/03/2026',
            text: `Produto muito bom. O ${product.name} superou minha expectativa no acabamento e na performance.`
        },
        {
            name: 'Renata S.',
            rating: 4,
            date: '26/02/2026',
            text: 'Entrega rapida e otimo custo-beneficio. No uso diario esta sendo bem confiavel.'
        },
        {
            name: 'Joao P.',
            rating: 5,
            date: '17/02/2026',
            text: 'Excelente compra. Recomendo para quem quer qualidade e praticidade no trabalho.'
        }
    ];
}
