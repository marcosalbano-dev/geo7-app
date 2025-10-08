-- Atualizar senhas dos usuários com hashes corretos
-- Execute este script para corrigir as senhas

-- Primeiro, vamos deletar os usuários existentes
DELETE FROM users WHERE email IN ('admin@geo7.com', 'user@geo7.com');

-- Inserir usuários com senhas corretas
INSERT INTO users (email, password, name, role, active) VALUES 
(
    'admin@geo7.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', -- admin123
    'Administrador do Sistema',
    'ADMIN',
    true
),
(
    'user@geo7.com',
    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- user123
    'Usuário Teste',
    'USER',
    true
);

-- Verificar se os usuários foram inseridos
SELECT id, email, name, role, active, created_at FROM users;
