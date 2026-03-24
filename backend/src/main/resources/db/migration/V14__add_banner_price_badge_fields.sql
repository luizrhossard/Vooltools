-- Adicionando colunas para personalizar o badge de preço no banner principal
ALTER TABLE banners ADD COLUMN show_price_badge BOOLEAN DEFAULT TRUE;
ALTER TABLE banners ADD COLUMN price_badge_prefix VARCHAR(100);
ALTER TABLE banners ADD COLUMN price_badge_value VARCHAR(100);
