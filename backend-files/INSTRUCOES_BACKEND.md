# Instruções para Configurar o Backend

## Arquivos que você precisa adicionar ao seu projeto Spring Boot:

### 1. Controllers
- `src/main/java/org/geo7/rest/AuthController.java`

### 2. DTOs
- `src/main/java/org/geo7/dto/LoginRequestDTO.java`
- `src/main/java/org/geo7/dto/RegisterRequestDTO.java`
- `src/main/java/org/geo7/dto/AuthResponseDTO.java`
- `src/main/java/org/geo7/dto/UserDTO.java`

### 3. Executar Script SQL
Execute o arquivo `insert_default_users.sql` no seu banco PostgreSQL.

## Configurações necessárias:

### 1. Dependências no pom.xml
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

### 2. Configuração do SecurityConfig
Você já tem o SecurityConfig, mas certifique-se de que está permitindo as rotas de auth:

```java
.authorizeHttpRequests(authz -> authz
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/health").permitAll()
    .anyRequest().authenticated()
)
```

### 3. Configuração do CORS
Você já tem o CorsConfig, mas pode remover o SecurityConfig se quiser usar apenas o CorsConfig.

## Testando:

1. **Inicie o backend** na porta 8080
2. **Inicie o frontend** na porta 4200
3. **Acesse** `http://localhost:4200`
4. **Use as credenciais:**
   - Admin: `admin@geo7.com` / `admin123`
   - User: `user@geo7.com` / `user123`

## Endpoints disponíveis:

- `POST /api/auth/login` - Fazer login
- `POST /api/auth/register` - Registrar usuário
- `GET /api/auth/me` - Obter usuário atual
- `POST /api/auth/logout` - Fazer logout

## Credenciais padrão:

- **Admin:** admin@geo7.com / admin123
- **User:** user@geo7.com / user123
