-- Fix Categories
UPDATE categories SET name = 'Ferramentas Elétricas' WHERE id = 1;

-- Fix Products
UPDATE products SET name = 'Kit de Chaves de Fenda 10 peças' WHERE sku = 'KIT-CHV-003';

UPDATE products 
SET name = 'Óculos de Proteção Incolor',
    description = 'Óculos anti-risco de alta durabilidade.'
WHERE sku = 'OCU-PRO-006';

UPDATE products SET name = 'Jogo de Soquetes 40 Peças Tramontina PRO' WHERE sku = 'TRA-SKT-40-009';

UPDATE products 
SET name = 'Óculos de Proteção Fumê Vonder',
    description = 'Óculos de proteção leve com lentes fumê e tratamento anti-risco.'
WHERE sku = 'VON-OCP-FU-015';

UPDATE products 
SET name = 'Botina de Segurança Bico Composite Bracol',
    description = 'Botina ocupacional com conforto térmico e proteção reforçada para rotinas intensas.'
WHERE sku = 'BRA-BOT-CM-016';

-- Fix Banners
UPDATE banners 
SET title = 'Promoção de Verão', 
    subtitle = 'Até 50% de desconto em ferramentas elétricas' 
WHERE id = 1;
