-- Inserir categorias
INSERT INTO categories (name, description) VALUES 
('Ferramentas Elétricas', 'Furadeiras, parafusadeiras, serras elétricas e afins.'),
('Ferramentas Manuais', 'Chaves, alicates, martelos, etc.'),
('EPI', 'Equipamentos de Proteção Individual como luvas, óculos e capacetes.');

-- Inserir ferramentas (Os IDs das categorias serão 1, 2 e 3)
INSERT INTO products (name, description, price, stock_quantity, sku, image_url, category_id) VALUES 
('Furadeira de Impacto Bosch', 'Furadeira 700W com maleta e brocas.', 350.00, 50, 'BOSCH-FUR-001', 'https://via.placeholder.com/200', 1),
('Serra Circular Makita', 'Serra circular 1400W profissional.', 680.90, 20, 'MAK-SER-002', 'https://via.placeholder.com/200', 1),
('Kit de Chaves de Fenda 10 peças', 'Kit completo com chaves Philips e Fenda.', 89.90, 100, 'KIT-CHV-003', 'https://via.placeholder.com/200', 2),
('Alicate Universal Tramontina', 'Alicate 8 polegadas isolado.', 45.50, 150, 'TRA-ALI-004', 'https://via.placeholder.com/200', 2),
('Luva de Raspa', 'Luva de raspa de couro para trabalhos pesados.', 15.00, 300, 'LUV-RSP-005', 'https://via.placeholder.com/200', 3),
('Óculos de Proteção Incolor', 'Óculos anti-risco de alta durabilidade.', 12.90, 500, 'OCU-PRO-006', 'https://via.placeholder.com/200', 3);
