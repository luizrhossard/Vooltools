UPDATE categories 
SET name = 'Ferramentas Elétricas' 
WHERE name LIKE 'Ferramentas El_tricas' OR name LIKE 'Ferramentas El%tricas';

UPDATE categories 
SET description = 'Furadeiras, parafusadeiras, serras elétricas e afins.' 
WHERE id = 1;

UPDATE products 
SET name = 'Óculos de Proteção Incolor' 
WHERE sku = 'OCU-PRO-006';

UPDATE products 
SET description = 'Óculos anti-risco de alta durabilidade.' 
WHERE sku = 'OCU-PRO-006';
