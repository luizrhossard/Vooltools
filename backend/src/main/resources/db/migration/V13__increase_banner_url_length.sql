-- Aumentando o tamanho das colunas de URL para suportar links como os do Freepik
ALTER TABLE banners ALTER COLUMN image_url TYPE VARCHAR(2000);
ALTER TABLE banners ALTER COLUMN link_url TYPE VARCHAR(2000);
