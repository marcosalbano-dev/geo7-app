-- Script para verificar e criar usuários no banco Geo7

-- 1. Verificar se a tabela users existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';

-- 2. Verificar se existem usuários na tabela
SELECT COUNT(*) as total_users FROM users;

-- 3. Listar todos os usuários existentes
SELECT id, email, name, role, active, created_at FROM users;

-- 4. Criar usuários padrão se não existirem
INSERT INTO users (email, password, name, role, active) VALUES 
(
    'admin@geo7.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', -- admin123
    'Administrador do Sistema',
    'ADMIN',
    true
),
(
    'user@geo7.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- user123
    'Usuário Teste',
    'USER',
    true
)
ON CONFLICT (email) DO NOTHING;

-- 5. Verificar novamente após inserção
SELECT id, email, name, role, active, created_at FROM users;

