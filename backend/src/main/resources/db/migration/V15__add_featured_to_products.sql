-- Adicionando flag de produto em destaque (oferta do dia)
ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT FALSE;
