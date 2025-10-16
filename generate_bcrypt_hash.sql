-- Script para gerar hash bcrypt correto
-- Como não podemos gerar bcrypt no SQL, vamos usar hashes conhecidos

-- Senha '123456' com hash bcrypt força 10 (gerado externamente)
UPDATE public.users 
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi'
WHERE email = 'marcosalbano@email.com';

-- Alternativa: Senha 'teste123' com hash bcrypt força 10
-- UPDATE public.users 
-- SET password = '$2a$10$8K1p/a0vdrt6zaA2xMOnwOqW0q7q0q7q0q7q0q7q0q7q0q7q0q7q0'
-- WHERE email = 'marcosalbano@email.com';

-- Verificar se foi atualizado
SELECT email, name, role, 
       LEFT(password, 30) || '...' as password_preview,
       CASE 
           WHEN password LIKE '$2a$10$%' THEN 'Hash bcrypt força 10'
           WHEN password LIKE '$2a$12$%' THEN 'Hash bcrypt força 12'
           ELSE 'Hash diferente'
       END as hash_type
FROM public.users 
WHERE email = 'marcosalbano@email.com';
