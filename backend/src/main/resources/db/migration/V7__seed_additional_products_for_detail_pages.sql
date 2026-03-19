-- Seed adicional para demonstrar páginas de detalhe de produto
INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id)
SELECT
  'Parafusadeira de Impacto 20V Vonder PFI 20',
  'Parafusadeira de impacto sem fio com controle de torque e ótima autonomia para uso profissional.',
  389.90,
  42,
  'VON-PFI-20-007',
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80',
  1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VON-PFI-20-007');

INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id)
SELECT
  'Serra Tico-Tico Bosch GST 750W',
  'Serra tico-tico com corte preciso e alta estabilidade para madeira, metal e derivados.',
  459.00,
  27,
  'BOS-GST-750-008',
  'https://images.unsplash.com/photo-1581147036324-c1c0d9e3d9a1?auto=format&fit=crop&w=900&q=80',
  1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BOS-GST-750-008');

INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id)
SELECT
  'Jogo de Soquetes 40 Peças Tramontina PRO',
  'Kit de soquetes com catraca reversível e encaixes variados para manutenção automotiva e industrial.',
  229.90,
  65,
  'TRA-SKT-40-009',
  'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=900&q=80',
  2
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRA-SKT-40-009');

INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id)
SELECT
  'Capacete de Segurança Classe B Delta Plus',
  'Capacete com ajuste fácil e proteção reforçada para ambientes de obra e manutenção.',
  69.90,
  120,
  'DLP-CAP-B-010',
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80',
  3
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'DLP-CAP-B-010');

