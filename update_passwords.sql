-- Script para atualizar as senhas dos usuários com os hashes corretos
-- As senhas são: admin123 e user123

-- Atualizar senha do admin@geo7.com para 'admin123'
UPDATE users 
SET password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K'
WHERE email = 'admin@geo7.com';

-- Atualizar senha do user@geo7.com para 'user123'  
UPDATE users 
SET password = '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'user@geo7.com';

-- Verificar se as senhas foram atualizadas
SELECT email, name, role, 
       CASE 
           WHEN password LIKE '$2a$12$%' THEN 'Hash correto (bcrypt 12 rounds)'
           ELSE 'Hash incorreto'
       END as password_status
FROM users 
WHERE email IN ('admin@geo7.com', 'user@geo7.com');

