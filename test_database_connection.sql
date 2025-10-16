-- Teste simples para verificar se o backend está vendo os dados
-- Execute este script e compare com o que o backend está vendo

-- 1. Verificar se conseguimos ver os usuários
SELECT 'Total de usuários:' as info, COUNT(*) as count FROM users;

-- 2. Listar todos os usuários com email admin ou user
SELECT 'Usuários admin/user:' as info, email, name, role, active FROM users 
WHERE email LIKE '%admin%' OR email LIKE '%user%';

-- 3. Buscar especificamente os usuários que estamos testando
SELECT 'Busca específica:' as info, email, name, role, active FROM users 
WHERE email = 'admin@geo7.com' OR email = 'user@geo7.com';

-- 4. Verificar se há problemas de case
SELECT 'Case insensitive:' as info, email, name, role, active FROM users 
WHERE LOWER(email) = LOWER('admin@geo7.com') OR LOWER(email) = LOWER('user@geo7.com');

-- 5. Verificar configuração do banco
SELECT 'Database info:' as info, current_database() as database, current_schema() as schema;
