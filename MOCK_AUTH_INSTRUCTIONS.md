# Instruções para Autenticação Mock

## Status Atual
✅ **Sistema configurado para usar autenticação mock**  
✅ **Login funcionando localmente sem backend**

## Como Usar

### Credenciais de Teste
- **Admin:** `admin@geo7.com` / `admin123`
- **Usuário:** `user@geo7.com` / `user123`

### Para Alternar Entre Mock e Backend Real

No arquivo `src/app/services/auth.service.ts`, linha 41:

```typescript
// Para usar MOCK (desenvolvimento local)
private readonly USE_MOCK_AUTH = true;

// Para usar BACKEND REAL (quando estiver rodando)
private readonly USE_MOCK_AUTH = false;
```

## Quando o Backend Estiver Pronto

1. **Configure o backend** seguindo as instruções em `backend-files/INSTRUCOES_BACKEND.md`
2. **Inicie o backend** na porta 8080
3. **Mude `USE_MOCK_AUTH` para `false`** no AuthService
4. **Teste com as mesmas credenciais** que estão no banco

## Funcionalidades do Mock

- ✅ Login com validação de credenciais
- ✅ Simulação de delay de rede (1 segundo)
- ✅ Armazenamento de token e usuário no localStorage
- ✅ Diferenciação entre usuários ADMIN e USER
- ✅ Tratamento de erros para credenciais inválidas
- ✅ Registro de usuários
- ✅ Refresh de dados do usuário

## Vantagens

- **Desenvolvimento independente:** Frontend pode ser desenvolvido sem backend
- **Testes rápidos:** Não precisa configurar banco de dados
- **Transição fácil:** Uma linha de código para alternar entre mock e real
- **Comportamento realista:** Simula delays e comportamentos de API real

