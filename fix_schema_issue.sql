-- Script para corrigir o problema de schema
-- Os usuários estão em public.users mas o backend procura em geo7.users

-- 1. Verificar se a tabela users existe no schema geo7
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'users' AND table_schema = 'geo7';

-- 2. Se não existir, criar a tabela no schema geo7
CREATE TABLE IF NOT EXISTS geo7.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Copiar os usuários do schema public para geo7
INSERT INTO geo7.users (email, password, name, role, active, created_at, updated_at)
SELECT email, password, name, role, active, created_at, updated_at
FROM public.users
ON CONFLICT (email) DO NOTHING;

-- 4. Verificar se os usuários foram copiados
SELECT 'Usuários no schema geo7:' as info, COUNT(*) as count FROM geo7.users;

-- 5. Listar usuários no schema geo7
SELECT email, name, role, active FROM geo7.users WHERE email IN ('admin@geo7.com', 'user@geo7.com');

-- 6. Verificar se a tabela foi criada corretamente
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'users';

