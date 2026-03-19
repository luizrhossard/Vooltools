-- Corrige textos com acentuação que ficaram corrompidos em seeds anteriores
UPDATE categories
SET
  name = 'Ferramentas Elétricas',
  description = 'Furadeiras, parafusadeiras, serras elétricas e afins.'
WHERE id = 1;

UPDATE categories
SET
  name = 'Ferramentas Manuais',
  description = 'Chaves, alicates, martelos, etc.'
WHERE id = 2;

UPDATE categories
SET
  name = 'EPI',
  description = 'Equipamentos de Proteção Individual como luvas, óculos e capacetes.'
WHERE id = 3;

UPDATE products SET name = 'Kit de Chaves de Fenda 10 peças' WHERE sku = 'KIT-CHV-003';
UPDATE products SET name = 'Óculos de Proteção Incolor' WHERE sku = 'OCU-PRO-006';

UPDATE products
SET description = 'Parafusadeira de impacto sem fio com controle de torque e ótima autonomia para uso profissional.'
WHERE sku = 'VON-PFI-20-007';

UPDATE products
SET name = 'Jogo de Soquetes 40 Peças Tramontina PRO',
    description = 'Kit de soquetes com catraca reversível e encaixes variados para manutenção automotiva e industrial.'
WHERE sku = 'TRA-SKT-40-009';

UPDATE products
SET name = 'Capacete de Segurança Classe B Delta Plus',
    description = 'Capacete com ajuste fácil e proteção reforçada para ambientes de obra e manutenção.'
WHERE sku = 'DLP-CAP-B-010';

UPDATE products
SET description = 'Esmerilhadeira compacta com alta rotação, ideal para corte e desbaste com precisão.'
WHERE sku = 'DEW-ANG-850-011';

UPDATE products
SET name = 'Nível a Laser 12m Bosch GLL 2',
    description = 'Nível a laser com projeção horizontal e vertical para alinhamentos rápidos e precisos.'
WHERE sku = 'BOS-LAS-12-012';

UPDATE products
SET name = 'Jogo de Chaves Combinadas 16 Peças Stanley',
    description = 'Conjunto completo de chaves combinadas com acabamento cromado e excelente resistência.'
WHERE sku = 'STA-CHC-16-013';

UPDATE products
SET description = 'Martelo de unha com cabo ergonômico para uso geral em carpintaria e manutenção.'
WHERE sku = 'TRA-MAR-27-014';

UPDATE products
SET name = 'Óculos de Proteção Fumê Vonder',
    description = 'Óculos de proteção leve com lentes fumê e tratamento anti-risco.'
WHERE sku = 'VON-OCP-FU-015';

UPDATE products
SET name = 'Botina de Segurança Bico Composite Bracol',
    description = 'Botina ocupacional com conforto térmico e proteção reforçada para rotinas intensas.'
WHERE sku = 'BRA-BOT-CM-016';
