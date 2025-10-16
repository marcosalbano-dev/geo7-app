-- Script para debugar a conexão do banco
-- Execute este script para verificar a configuração

-- 1. Verificar qual banco estamos conectados
SELECT current_database() as database_name;

-- 2. Verificar qual schema estamos usando
SELECT current_schema() as current_schema;

-- 3. Listar todos os schemas disponíveis
SELECT schema_name FROM information_schema.schemata;

-- 4. Verificar se a tabela users existe no schema public
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'users';

-- 5. Contar usuários na tabela (case insensitive)
SELECT COUNT(*) as total_users FROM users;

-- 6. Buscar especificamente os usuários que estamos testando
SELECT email, name, role, active 
FROM users 
WHERE LOWER(email) IN ('admin@geo7.com', 'user@geo7.com');

-- 7. Verificar se há diferenças de case
SELECT email, name, role, active 
FROM users 
WHERE email ILIKE '%admin%' OR email ILIKE '%user%';

-- 8. Verificar configurações de case sensitivity
SHOW case_sensitive_identifiers;

