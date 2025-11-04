# SOL-ms-Auth

Microserviço de autenticação desenvolvido com Node.js, TypeScript e Express.

## 📋 Sobre o Projeto

Este é um microserviço responsável por gerenciar autenticação e autorização de usuários, fornecendo endpoints para login, registro e validação de tokens JWT.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web para Node.js
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização
- **JWT** - JSON Web Tokens para autenticação

## 📁 Estrutura do Projeto

```
src/
├── app.ts                          # Configuração principal da aplicação
├── server.ts                       # Servidor Express
├── adapters/                       # Adaptadores para integração (DIP)
│   └── user-repository.adapter.ts  # Adapter para repositório existente
├── config/
│   ├── auth.config.ts              # Configurações de autenticação
│   ├── db.ts                       # Configuração do banco de dados
│   ├── jwt.ts                      # Configurações do JWT
│   └── seed.config.ts              # Configurações de seeds
├── controllers/
│   ├── auth.controller.ts          # Controladores de autenticação
│   ├── test.controller.ts          # Controladores de teste (dev)
│   └── user.controller.ts          # Controladores de usuário
├── database/
│   ├── migration.ts                # Script de migrações
│   ├── seeder.ts                   # Orquestrador SOLID de seeds
│   ├── migrations/                 # Migrações do banco
│   │   ├── 0001_create_users.ts    # Criação da tabela users
│   │   └── 0002_add_auth_fields.ts # Campos de autenticação
│   └── seeds/                      # Seeds para dados de teste
│       └── 001_auth_test_users.ts  # Usuários para testes de auth
├── factories/                      # Factory pattern para DI
│   └── auth.factory.ts             # Factory de dependências auth
├── handlers/                       # Tratamento de erros (SRP)
│   └── error.handler.ts            # Handler centralizado de erros
├── interfaces/                     # Contratos/Interfaces (DIP)
│   ├── auth.interfaces.ts          # Interfaces de autenticação
│   ├── email.interfaces.ts         # Interfaces de email
│   └── seed.interfaces.ts          # Interfaces de seeds
├── middlewares/
│   ├── auth.middleware.ts          # Middlewares de autenticação
│   └── validation.middleware.ts    # Middlewares de validação
├── models/
│   └── user.model.ts               # Modelo de usuário
├── providers/                      # Provedores de serviços
│   ├── email.provider.ts           # Provedor de email
│   └── mailhog.provider.ts         # Provedor MailHog (dev)
├── repositories/
│   └── user.repository.ts          # Repositório de usuários
├── routes/
│   ├── auth.routes.ts              # Rotas de autenticação
│   ├── test.routes.ts              # Rotas de teste (dev)
│   └── user.routes.ts              # Rotas de usuário
├── services/                       # Lógica de negócio (SRP)
│   ├── auth.service.ts             # Serviços de autenticação
│   ├── crypto.service.ts           # Operações criptográficas
│   ├── data-cleaner.service.ts     # Limpeza de dados (seeds)
│   ├── email.service.ts            # Serviços de email
│   ├── email-logger.service.ts     # Logger de emails
│   ├── email-template.service.ts   # Templates de email
│   ├── environment.service.ts      # Configurações de ambiente
│   ├── seed-logger.service.ts      # Logger de seeds
│   ├── seed-runner.service.ts      # Execução de seeds
│   ├── token.service.ts            # Gerenciamento de tokens
│   ├── user.service.ts             # Serviços de usuário
│   ├── user-generator.service.ts   # Geração de usuários (seeds)
│   └── user-validator.service.ts   # Validação de usuários
├── strategies/                     # Strategy Pattern (OCP)
│   ├── email-auth.strategy.ts      # Estratégia autenticação email
│   └── password-auth.strategy.ts   # Estratégia autenticação senha
├── tests/                          # Testes unitários
│   └── index.spec.ts               # Testes principais
├── types/                          # Definições de tipos TypeScript
│   ├── auth.ts                     # Tipos de autenticação
│   ├── database.ts                 # Tipos do banco de dados
│   └── email.ts                    # Tipos de email
└── utils/                          # Utilitários diversos
    ├── crypto.ts                   # Funções criptográficas
    ├── email.ts                    # Utilitários de email
    └── validation.ts               # Utilitários de validação
```

## 🛠️ Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- npm ou yarn

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/e-strategiapublica/sol-ms-auth.git
cd sol-ms-auth
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

## 🐳 Executando com Docker

### Usando Docker Compose (Recomendado)

1. Inicie todos os serviços:

```bash
docker-compose up -d
```

2. A aplicação estará disponível em `http://localhost:3000`

### Usando Docker diretamente

1. Construa a imagem:

```bash
docker build -t sol-ms-auth .
```

2. Inicie o banco de dados:

```bash
docker-compose up -d mysql
```

3. Execute a aplicação:

```bash
docker run -p 3000:3000 --env-file .env --network sol-ms-auth_default sol-ms-auth
```

## 🚀 Scripts Disponíveis

### **Desenvolvimento**
- `npm run dev` - Executa a aplicação em modo de desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia a aplicação em produção

### **Banco de Dados**
- `npm run migrations:up` - Executa as migrações do banco de dados
- `npm run seeds` - Popula o banco com dados de teste (arquitetura SOLID)

### **Testes e Qualidade**
- `npm test` - Executa os testes unitários com cobertura
- `npm run test:watch` - Executa os testes em modo watch
- `npm run lint` - Executa a verificação de estilo de código
- `npm run lint:fix` - Corrige automaticamente os problemas de estilo
- `npm run typecheck` - Verifica tipos sem gerar arquivos de build

### **🌱 Seeds de Teste**
O comando `npm run seeds` cria usuários de teste seguindo princípios SOLID:
- **Email**: `test@example.com`
- **Senha**: `123456`
- **Funcionalidades**: Suporte a todas as rotas de autenticação
- **Comandos**: Exibe comandos para Windows (PowerShell) e Linux/macOS (curl)

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sol_ms_auth
DB_USER=changeme
DB_PASSWORD=changeme
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Banco de Dados

O projeto utiliza PostgreSQL como banco de dados. A configuração do Docker Compose inclui:

- **Host**: localhost
- **Porta**: 5432
- **Database**: sol_ms_auth
- **Usuário**: changeme
- **Senha**: changeme

## 🏗️ Arquitetura SOLID

Este projeto implementa rigorosamente os **princípios SOLID** para garantir código limpo, testável e extensível:

- **SRP** (Single Responsibility): Cada classe tem uma responsabilidade única
- **OCP** (Open/Closed): Extensível via Strategy Pattern para novos métodos de auth
- **LSP** (Liskov Substitution): Implementações intercambiáveis via interfaces
- **ISP** (Interface Segregation): Interfaces específicas e focadas
- **DIP** (Dependency Inversion): Injeção de dependência via Factory Pattern

📖 **Documentação completa**: Veja [SOLID_PRINCIPLES.md](./SOLID_PRINCIPLES.md) para detalhes da implementação.

## 📚 API Endpoints

### **Autenticação**
- `POST /method/email/send` - Envia código de autenticação por email
- `POST /method/email` - Autentica com código recebido por email
- `POST /method/pass` - Autentica com senha

### **Usuários**
- `GET /users` - Lista usuários cadastrados

### **Saúde da Aplicação**
- `GET /health` - Verifica status da aplicação

### **Testes (Desenvolvimento)**
- `GET /test` - Informações sobre testes disponíveis
- `GET /test/mailhog` - Testa integração com MailHog

## 🔒 Segurança

- **Autenticação JWT** com claims específicas conforme spec IAM
- **Hash de senhas** com bcrypt e salt configurável
- **Códigos temporários** com expiração para email
- **Account lockout progressivo** (5min até 24h baseado em tentativas)
- **Rate limiting** por IP e email (proteção contra brute-force)
- **Timing attack protection** com comparações de tempo constante
- **Input sanitization** com validação rigorosa
- **User enumeration protection** com mensagens genéricas
- **Security logging** com mascaramento de dados sensíveis
- **Headers Link** corretos nas respostas
