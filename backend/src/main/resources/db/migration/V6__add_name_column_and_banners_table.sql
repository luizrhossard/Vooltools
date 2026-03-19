-- Adicionar coluna name na tabela admin_users
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS name VARCHAR(150);

-- Atualizar o admin existente com um nome
UPDATE admin_users SET name = 'Administrador' WHERE username = 'admin';

-- Criar tabela de banners
CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    subtitle VARCHAR(500),
    image_url VARCHAR(255),
    link_url VARCHAR(255),
    display_order INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATE,
    end_date DATE
);

-- Inserir alguns banners de exemplo
INSERT INTO banners (title, subtitle, image_url, display_order, is_active) VALUES
('Promoção de Verão', 'Até 50% de desconto em ferramentas elétricas', 'https://via.placeholder.com/800x300', 1, TRUE),
('Lançamento Makita', 'Nova linha 20V MAX com tecnologia XR', 'https://via.placeholder.com/800x300', 2, TRUE),
('Frete Grátis', 'Compras acima de R$ 299 têm frete grátis', 'https://via.placeholder.com/800x300', 3, TRUE);
