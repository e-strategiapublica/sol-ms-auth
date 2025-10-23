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
├── app.ts                 # Configuração principal da aplicação
├── server.ts             # Servidor Express
├── config/
│   └── jwt.ts            # Configurações do JWT
├── controllers/
│   └── auth.controller.ts # Controladores de autenticação
├── middlewares/
│   └── auth.middleware.ts # Middlewares de autenticação
├── models/
│   └── user.model.ts     # Modelo de usuário
├── repositories/
│   └── user.repository.ts # Repositório de usuários
├── routes/
│   ├── auth.routes.ts    # Rotas de autenticação
│   └── user.routes.ts    # Rotas de usuário
└── services/
    ├── auth.service.ts   # Serviços de autenticação
    └── user.service.ts   # Serviços de usuário
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

- `npm run dev` - Executa a aplicação em modo de desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia a aplicação em produção
- `npm test` - Executa os testes unitários com cobertura
- `npm run test:watch` - Executa os testes em modo watch
- `npm run lint` - Executa a verificação de estilo de código
- `npm run lint:fix` - Corrige automaticamente os problemas de estilo
- `npm run typecheck` - Verifica tipos sem gerar arquivos de build

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

## 📚 API Endpoints

### Autenticação

### Usuários

## 🔒 Segurança

- Autenticação baseada em JWT
- Middleware de validação de token
- Validação de entrada de dados
- Criptografia de senhas
