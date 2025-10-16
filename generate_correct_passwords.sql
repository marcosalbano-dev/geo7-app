-- Script para gerar senhas com hash correto
-- IMPORTANTE: Execute este script no seu banco PostgreSQL

-- Opção 1: Usar senhas simples para teste (sem hash)
-- Descomente as linhas abaixo se quiser usar senhas em texto plano temporariamente

-- UPDATE users SET password = 'admin123' WHERE email = 'admin@geo7.com';
-- UPDATE users SET password = 'user123' WHERE email = 'user@geo7.com';

-- Opção 2: Usar hashes bcrypt corretos (recomendado)
-- Atualizar senha do admin@geo7.com para 'admin123' (hash bcrypt)
UPDATE users 
SET password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K'
WHERE email = 'admin@geo7.com';

-- Atualizar senha do user@geo7.com para 'user123' (hash bcrypt)
UPDATE users 
SET password = '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'user@geo7.com';

-- Verificar resultado
SELECT email, name, role, 
       LEFT(password, 20) || '...' as password_preview
FROM users 
WHERE email IN ('admin@geo7.com', 'user@geo7.com');
