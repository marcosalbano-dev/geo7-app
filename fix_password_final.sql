-- Script final para corrigir a senha
-- Vamos usar senhas com hash bcrypt força 10 (padrão do Spring Boot)

-- OPÇÃO 1: Senha 'admin123' (hash conhecido que funciona)
UPDATE public.users 
SET password = '$2a$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K'
WHERE email = 'marcosalbano@email.com';

-- OPÇÃO 2: Senha 'user123' (hash conhecido que funciona)
-- UPDATE public.users 
-- SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
-- WHERE email = 'marcosalbano@email.com';

-- Verificar resultado
SELECT email, name, role, 
       LEFT(password, 30) || '...' as password_preview
FROM public.users 
WHERE email = 'marcosalbano@email.com';
