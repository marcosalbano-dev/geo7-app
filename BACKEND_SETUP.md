# Configuração do Backend para Autenticação

## Status Atual
✅ **Frontend funcionando** com sistema de login mock  
⏳ **Backend** precisa ser implementado

## Para Implementar o Backend Real

### 1. Criar os Controllers de Autenticação

Crie estes arquivos no seu projeto Spring Boot:

```
src/main/java/com/geo7/controller/AuthController.java
src/main/java/com/geo7/controller/UserController.java
src/main/java/com/geo7/service/UserService.java
src/main/java/com/geo7/service/JwtService.java
src/main/java/com/geo7/config/SecurityConfig.java
```

### 2. Executar Scripts SQL

Execute estes scripts no seu banco PostgreSQL:

```sql
-- 1. Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Inserir usuários padrão
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
```

### 3. Atualizar Frontend

Quando o backend estiver pronto, descomente as linhas no `AuthService`:

```typescript
// Em src/app/services/auth.service.ts
// Descomente as linhas que fazem chamadas HTTP reais
// Comente as linhas que usam authMockService
```

### 4. Testar

1. **Backend rodando** na porta 8080
2. **Frontend rodando** na porta 4200
3. **Banco PostgreSQL** configurado
4. **Usuários criados** no banco

## Credenciais de Teste

- **Admin:** admin@geo7.com / admin123
- **User:** user@geo7.com / user123

## Endpoints Necessários

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `POST /api/auth/logout`

## Dependências Spring Boot

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```
