-- Atualizar a senha do admin com a senha correta gerada pelo TestController
UPDATE users 
SET password = '$2a$10$h8UXlwmj/SlIzpWkblnmV.G/MSg08Kl0LdDXkUxE6vaSFmAQSzLki'
WHERE email = 'admin@geo7.com';

-- Verificar se foi atualizada
SELECT email, password FROM users WHERE email = 'admin@geo7.com';
