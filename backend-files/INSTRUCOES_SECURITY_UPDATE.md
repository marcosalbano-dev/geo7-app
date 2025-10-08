# 🔐 Instruções para Atualizar o SecurityConfig

## 📋 **Arquivos para integrar:**

### 1. **SecurityConfig.java** (Atualizar)
- Substitua seu `SecurityConfig` atual pelo conteúdo do arquivo `SecurityConfigUpdated.java`
- Adicione as configurações de endpoints autenticados
- Inclua o JWT Filter

### 2. **JwtAuthenticationFilter.java** (Novo)
- Adicione este arquivo ao seu projeto
- Localização: `src/main/java/org/geo7/config/JwtAuthenticationFilter.java`

### 3. **CustomUserDetailsService.java** (Novo)
- Adicione este arquivo ao seu projeto
- Localização: `src/main/java/org/geo7/config/CustomUserDetailsService.java`

### 4. **JwtConfigService.java** (Novo)
- Adicione este arquivo ao seu projeto
- Localização: `src/main/java/org/geo7/config/JwtConfigService.java`

## 🔧 **Dependências necessárias no pom.xml:**

```xml
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

## 🚀 **Passos para integrar:**

1. **Adicione as dependências JWT** no seu `pom.xml`
2. **Substitua o SecurityConfig** pelo conteúdo atualizado
3. **Adicione os 3 novos arquivos** de configuração
4. **Reinicie o backend**
5. **Teste o login** no frontend

## ✅ **Resultado esperado:**

- ✅ Login funcionando
- ✅ Redirecionamento para consulta
- ✅ Endpoints `/api/municipios` e `/api/lotes` funcionando
- ✅ Consulta de lotes funcionando
- ✅ Sistema completo operacional

## 🎯 **Teste:**

1. Acesse `http://localhost:4200`
2. Faça login com `admin@geo7.com` / `admin123`
3. Deve ir para a consulta de lotes
4. A consulta deve funcionar sem erros 403
