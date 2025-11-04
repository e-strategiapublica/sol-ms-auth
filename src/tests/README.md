# Testes - sol-ms-auth

## 📋 Visão Geral

Este diretório contém os testes unitários e de integração do microserviço de autenticação, seguindo rigorosamente os **princípios SOLID**.

## 🏗️ Estrutura de Testes

```
tests/
├── setup.ts                              # Configuração global dos testes
├── README.md                             # Esta documentação
├── strategies/                           # Testes unitários das estratégias (OCP)
│   ├── email-auth.strategy.test.ts       # Testes da estratégia de email
│   └── password-auth.strategy.test.ts    # Testes da estratégia de senha
└── routes/                               # Testes de integração das rotas
    └── auth.routes.test.ts               # Testes completos das rotas HTTP
```

## 🧪 Tipos de Testes

### **1. Testes Unitários de Estratégias**
- **Localização**: `strategies/`
- **Objetivo**: Testar a lógica de autenticação isoladamente
- **Princípios SOLID aplicados**:
  - **SRP**: Cada teste tem uma responsabilidade única
  - **DIP**: Dependências são injetadas via mocks
  - **ISP**: Interfaces específicas são mockadas
  - **LSP**: Implementações são intercambiáveis

### **2. Testes de Integração de Rotas**
- **Localização**: `routes/`
- **Objetivo**: Testar o fluxo completo HTTP → Controller → Service
- **Princípios SOLID aplicados**:
  - **OCP**: Middlewares são extensíveis
  - **SRP**: Controller apenas coordena
  - **DIP**: Factory pattern é utilizado

## 🚀 Executando os Testes

### **Todos os testes com cobertura**
```bash
npm test
```

### **Modo watch (desenvolvimento)**
```bash
npm run test:watch
```

### **Testes específicos**
```bash
# Apenas estratégias
npm test -- strategies

# Apenas rotas
npm test -- routes

# Arquivo específico
npm test -- email-auth.strategy.test.ts
```

### **Cobertura detalhada**
```bash
npm test -- --coverage --verbose
```

## 📐 Princípios SOLID nos Testes

### **Single Responsibility Principle (SRP)**
Cada teste tem uma única asserção ou verifica um único comportamento:

```typescript
it("should return 200 and token when authentication succeeds", async () => {
  // Testa APENAS o sucesso da autenticação
});

it("should throw error when email code is invalid", async () => {
  // Testa APENAS código inválido
});
```

### **Open/Closed Principle (OCP)**
Testes de estratégias podem ser estendidos sem modificação:

```typescript
// Novas estratégias seguem o mesmo padrão de testes
describe("NewAuthStrategy", () => {
  // Mesmo padrão de testes que EmailAuthStrategy
});
```

### **Liskov Substitution Principle (LSP)**
Mocks implementam interfaces completas:

```typescript
let mockUserRepository: jest.Mocked<IUserRepository>;
// Pode substituir qualquer implementação de IUserRepository
```

### **Interface Segregation Principle (ISP)**
Mocks são criados para interfaces específicas:

```typescript
mockTokenService: jest.Mocked<ITokenService>;
mockCryptoService: jest.Mocked<ICryptoService>;
// Interfaces pequenas e focadas
```

### **Dependency Inversion Principle (DIP)**
Estratégias recebem dependências via construtor:

```typescript
emailAuthStrategy = new EmailAuthStrategy(
  mockUserRepository,
  mockTokenService,
  mockCryptoService,
  mockUserValidator,
  mockTimingSafeService
);
```

## 🔍 Cenários de Teste

### **Testes de Sucesso**
- Autenticação válida com email
- Autenticação válida com senha
- Atualização de token existente
- Geração de novo token

### **Testes de Falha**
- Código de email inválido
- Código de email expirado
- Senha incorreta
- Usuário não encontrado
- Conta bloqueada
- Tentativas excedidas

### **Testes de Segurança**
- Timing-safe comparison
- User enumeration protection
- Rate limiting
- Input validation
- Error handling genérico

### **Testes de Validação**
- Campos obrigatórios
- Formato de email
- Tipos de dados
- Campos extras (security)

## 📊 Cobertura de Código

O projeto mantém os seguintes thresholds de cobertura:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### **Visualizar relatório de cobertura**
```bash
npm test
# Abrir coverage/index.html no navegador
```

## 🛠️ Ferramentas Utilizadas

- **Jest**: Framework de testes
- **ts-jest**: Suporte TypeScript
- **Supertest**: Testes HTTP
- **@types/jest**: Tipagens TypeScript
- **@types/supertest**: Tipagens TypeScript

## 📝 Convenções de Nomenclatura

### **Estrutura de describe**
```typescript
describe("ComponentName - Test Category", () => {
  describe("methodName - Scenario type", () => {
    it("should [expected behavior] when [condition]", async () => {
      // Test implementation
    });
  });
});
```

### **Nomenclatura de variáveis**
```typescript
// Mocks
mockUserRepository
mockTokenService

// Dados de teste
mockUser
mockResponse
existingToken
```

### **Comentários AAA Pattern**
```typescript
// Arrange: Preparar dados de teste
// Act: Executar método
// Assert: Verificar comportamento esperado
```

## 🔒 Testes de Segurança

### **Timing Attack Protection**
```typescript
it("should use timing-safe comparison", async () => {
  expect(mockTimingSafeService.safeCompareEmailCode).toHaveBeenCalled();
});
```

### **User Enumeration Protection**
```typescript
it("should return generic error message", async () => {
  await expect(...).rejects.toThrow("Invalid credentials");
});
```

### **Rate Limiting**
```typescript
it("should apply rate limit middleware", async () => {
  // Verifica que middleware está aplicado
});
```

## 🐛 Debugging Testes

### **Executar teste específico em modo debug**
```bash
node --inspect-brk node_modules/.bin/jest --runInBand email-auth.strategy.test.ts
```

### **Usar console.log em testes**
```typescript
it("debug test", async () => {
  console.log("Debug info:", mockResponse);
  // Test implementation
});
```

### **Aumentar timeout**
```typescript
it("slow test", async () => {
  // Test implementation
}, 30000); // 30 segundos
```

## ✅ Checklist de Teste

Ao criar novos testes, verificar:

- [ ] Testes seguem princípios SOLID
- [ ] Mocks implementam interfaces completas
- [ ] Cenários de sucesso e falha cobertos
- [ ] Testes de segurança incluídos
- [ ] Validação de entrada testada
- [ ] Error handling verificado
- [ ] Comentários AAA pattern
- [ ] Nomenclatura consistente
- [ ] Cobertura mínima atingida

## 📚 Referências

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [SOLID Principles](../../SOLID_PRINCIPLES.md)
- [TypeScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
