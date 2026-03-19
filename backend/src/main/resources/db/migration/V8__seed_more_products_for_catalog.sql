-- Mais produtos simulados para visualização no catálogo e páginas de detalhe
INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id)
SELECT
  'Esmerilhadeira Angular 850W DeWalt DWE4020',
  'Esmerilhadeira compacta com alta rotação, ideal para corte e desbaste com precisão.',
  329.90,
  34,
  'DEW-ANG-850-011',
  'https://images.unsplash.com/photo-1621996659490-3275e6122181?auto=format&fit=crop&w=900&q=80',
  1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'DEW-ANG-850-011');

INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id)
SELECT
  'Nível a Laser 12m Bosch GLL 2',
  'Nível a laser com projeção horizontal e vertical para alinhamentos rápidos e precisos.',
  299.90,
  46,
  'BOS-LAS-12-012',
  'https://images.unsplash.com/photo-1615634262417-9f38f8d0f7fd?auto=format&fit=crop&w=900&q=80',
  1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BOS-LAS-12-012');

INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id)
SELECT
  'Jogo de Chaves Combinadas 16 Peças Stanley',
  'Conjunto completo de chaves combinadas com acabamento cromado e excelente resistência.',
  179.90,
  58,
  'STA-CHC-16-013',
  'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80',
  2
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'STA-CHC-16-013');

INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id)
SELECT
  'Martelo Unha 27mm Tramontina Master',
  'Martelo de unha com cabo ergonômico para uso geral em carpintaria e manutenção.',
  59.90,
  83,
  'TRA-MAR-27-014',
  'https://images.unsplash.com/photo-1594708767771-a7a9dc31d8a8?auto=format&fit=crop&w=900&q=80',
  2
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRA-MAR-27-014');

INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id)
SELECT
  'Óculos de Proteção Fumê Vonder',
  'Óculos de proteção leve com lentes fumê e tratamento anti-risco.',
  24.90,
  140,
  'VON-OCP-FU-015',
  'https://images.unsplash.com/photo-1577801599847-3d9fbf4d32d3?auto=format&fit=crop&w=900&q=80',
  3
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VON-OCP-FU-015');

INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id)
SELECT
  'Botina de Segurança Bico Composite Bracol',
  'Botina ocupacional com conforto térmico e proteção reforçada para rotinas intensas.',
  189.90,
  76,
  'BRA-BOT-CM-016',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
  3
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BRA-BOT-CM-016');

