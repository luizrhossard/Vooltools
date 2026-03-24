-- Remove apenas o admin legado com hash padrao conhecido (admin123).
-- Isso evita excluir contas de admin que ja tiveram senha alterada.
DELETE FROM admin_users
WHERE email = 'admin@admin.com'
  AND username = 'admin'
  AND password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7XP92goG0j1J0aSVLdR9XO.';
