-- Script para testar senhas com hashes conhecidos
-- Execute UMA das opções abaixo

-- OPÇÃO 1: Senha '123456' (mais simples para teste)
UPDATE public.users 
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi'
WHERE email = 'marcosalbano@email.com';

-- OPÇÃO 2: Senha 'admin123' 
-- UPDATE users 
-- SET password = '$2a$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K'
-- WHERE email = 'marcosalbano@email.com';

-- OPÇÃO 3: Senha 'user123'
-- UPDATE users 
-- SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
-- WHERE email = 'marcosalbano@email.com';

-- Verificar resultado
SELECT email, name, role, 
       LEFT(password, 25) || '...' as password_preview
FROM users 
WHERE email = 'marcosalbano@email.com';
