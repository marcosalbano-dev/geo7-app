-- Script para atualizar a senha do usuário marcosalbano@email.com
-- Vamos usar uma senha simples para teste

-- Opção 1: Atualizar para senha '123456' (hash bcrypt)
UPDATE users 
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi'
WHERE email = 'marcosalbano@email.com';

-- Opção 2: Atualizar para senha 'admin123' (hash bcrypt)
UPDATE users 
SET password = '$2a$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K'
WHERE email = 'marcosalbano@email.com';

-- Opção 3: Atualizar para senha 'user123' (hash bcrypt)
UPDATE users 
SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'marcosalbano@email.com';

-- Verificar se foi atualizado
SELECT email, name, role, 
       LEFT(password, 20) || '...' as password_preview
FROM users 
WHERE email = 'marcosalbano@email.com';

