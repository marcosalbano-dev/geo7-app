-- Inserir usuários padrão para o sistema Geo7
-- IMPORTANTE: As senhas são 'admin123' e 'user123' criptografadas com bcrypt

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

-- Verificar se os usuários foram inseridos
SELECT id, email, name, role, active, created_at FROM users;
