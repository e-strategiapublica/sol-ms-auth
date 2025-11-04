# MailHog Setup - Teste de Emails em Desenvolvimento

## O que é o MailHog?

MailHog é uma ferramenta para capturar e visualizar emails enviados durante o desenvolvimento, evitando o envio de emails reais para usuários.

## Arquitetura SOLID Implementada

O sistema agora usa **arquitetura SOLID** com:
- **EmailService**: Coordenação principal com injeção de dependência
- **MailHogProvider**: Configuração específica do MailHog (SRP)
- **SmtpProvider**: Configuração SMTP para produção (SRP)
- **EmailProviderFactory**: Seleção automática do provedor (Factory Pattern + OCP)
- **EmailTemplateService**: Criação de templates de email (SRP)
- **EmailLoggerService**: Logs específicos por ambiente (SRP)
- **EnvironmentService**: Detecção de ambiente (SRP)

## Configuração

### **Pré-requisitos**
1. **Arquivo .env** deve existir com `NODE_ENV=development`
2. **Sem credenciais SMTP** configuradas (para usar MailHog automaticamente)

### **1. Instalação via Docker (Recomendado - Todas as Plataformas)**

**Windows (PowerShell):**
```powershell
# Executar MailHog
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

**Linux/macOS (bash):**
```bash
# Executar MailHog
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

### **2. Instalação por Gerenciadores de Pacote**

**Windows:**
```powershell
# Chocolatey
choco install mailhog

# Scoop
scoop install mailhog
```

**macOS:**
```bash
# Homebrew
brew install mailhog
```

**Linux (Ubuntu/Debian):**
```bash
# Via Go (se tiver instalado)
go install github.com/mailhog/MailHog@latest

# Ou baixar binário
wget https://github.com/mailhog/MailHog/releases/download/v1.0.1/MailHog_linux_amd64
chmod +x MailHog_linux_amd64
./MailHog_linux_amd64
```

### **3. Download Direto**

**Windows:**
1. Acesse: https://github.com/mailhog/MailHog/releases
2. Baixe: `MailHog_windows_amd64.exe`
3. Execute: `.\MailHog_windows_amd64.exe`

**Linux:**
1. Acesse: https://github.com/mailhog/MailHog/releases
2. Baixe: `MailHog_linux_amd64`
3. Execute: `chmod +x MailHog_linux_amd64 && ./MailHog_linux_amd64`

**macOS:**
1. Acesse: https://github.com/mailhog/MailHog/releases
2. Baixe: `MailHog_darwin_amd64`
3. Execute: `chmod +x MailHog_darwin_amd64 && ./MailHog_darwin_amd64`

## Como Funciona (Arquitetura SOLID)

### **Detecção Automática via Factory Pattern**
```typescript
// EmailProviderFactory decide automaticamente:
if (isDevelopment() && !hasSmtpCredentials()) {
  return new MailHogProvider(); // localhost:1025
} else {
  return new SmtpProvider();    // SMTP real
}
```

### **Configuração por Ambiente**

#### **MailHogProvider (Desenvolvimento):**
```typescript
{
  host: "localhost",
  port: 1025,
  secure: false,
  // sem autenticação
}
```

#### **SmtpProvider (Produção):**
```typescript
{
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}
```

## Como Testar

### **Testes Manuais (Passo a Passo)**

#### **1. Verificar Status do Sistema**

**PowerShell (Windows):**
```powershell
# Informações sobre testes disponíveis
Invoke-RestMethod -Uri "http://localhost:3000/test"

# Teste específico do MailHog
Invoke-RestMethod -Uri "http://localhost:3000/test/mailhog"
```

**Linux/macOS (curl):**
```bash
# Informações sobre testes disponíveis
curl http://localhost:3000/test

# Teste específico do MailHog
curl http://localhost:3000/test/mailhog
```

#### **2. Solicitar Código de Autenticação**

**PowerShell (Windows):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/method/email/send" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"identifier": "teste@example.com"}'
```

**Linux/macOS (curl):**
```bash
curl -X POST http://localhost:3000/method/email/send \
  -H "Content-Type: application/json" \
  -d '{"identifier": "teste@example.com"}'
```

#### **3. Verificar Logs do Servidor**
```
[DEV] Using MailHog for email testing (http://localhost:8025)
[DEV] Email sent via MailHog for teste@example.com
[DEV] Code: 596411 (expires in 300s)
[DEV] Check MailHog interface: http://localhost:8025
```

#### **4. Autenticar com Código**

**PowerShell (Windows):**
```powershell
# Use o código que apareceu no console (ex: 596411)
Invoke-RestMethod -Uri "http://localhost:3000/method/email" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"identifier": "teste@example.com", "params": {"code": "596411"}}'
```

**Linux/macOS (curl):**
```bash
# Use o código que apareceu no console (ex: 596411)
curl -X POST http://localhost:3000/method/email \
  -H "Content-Type: application/json" \
  -d '{"identifier": "teste@example.com", "params": {"code": "596411"}}'
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Fluxo Completo Resumido**

**PowerShell (Windows):**
```powershell
# 1. Iniciar servidor
yarn run dev

# 2. Solicitar código
Invoke-RestMethod -Uri "http://localhost:3000/method/email/send" -Method POST -ContentType "application/json" -Body '{"identifier": "teste@example.com"}'

# 3. Pegar código do console do servidor (ex: 596411)

# 4. Autenticar
Invoke-RestMethod -Uri "http://localhost:3000/method/email" -Method POST -ContentType "application/json" -Body '{"identifier": "teste@example.com", "params": {"code": "596411"}}'
```

**Linux/macOS (bash):**
```bash
# 1. Iniciar servidor
yarn run dev

# 2. Solicitar código
curl -X POST http://localhost:3000/method/email/send \
  -H "Content-Type: application/json" \
  -d '{"identifier": "teste@example.com"}'

# 3. Pegar código do console do servidor (ex: 596411)

# 4. Autenticar
curl -X POST http://localhost:3000/method/email \
  -H "Content-Type: application/json" \
  -d '{"identifier": "teste@example.com", "params": {"code": "596411"}}'
```

### **Interface Web do MailHog (Opcional)**
1. **Inicie o MailHog** (qualquer método acima)
2. **Acesse**: http://localhost:8025
3. **Envie emails** via API
4. **Visualize emails** capturados na interface

## Interfaces Disponíveis

### **SMTP Server**
- **Host:** localhost
- **Porta:** 1025
- **Segurança:** Nenhuma (secure: false)
- **Autenticação:** Não requerida

### **Web Interface**
- **URL:** http://localhost:8025
- **Funcionalidades:**
  - Visualizar emails capturados
  - Ver conteúdo HTML/texto
  - Baixar anexos
  - Limpar inbox
  - API REST para automação

### **API REST do MailHog**
```bash
# Listar emails
curl http://localhost:8025/api/v1/messages

# Ver email específico
curl http://localhost:8025/api/v1/messages/{id}

# Deletar email
curl -X DELETE http://localhost:8025/api/v1/messages/{id}
```

## Logs do Sistema

### **Em Desenvolvimento (com MailHog):**
```
[DEV] Using MailHog for email testing (http://localhost:8025)
[DEV] Email sent via MailHog for teste@example.com
[DEV] Code: 123456 (expires in 300s)
[DEV] Check MailHog interface: http://localhost:8025
```

### **Em Desenvolvimento (sem MailHog rodando):**
```
[DEV] Using MailHog for email testing (http://localhost:8025)
Error sending email via MailHog: Error: connect ECONNREFUSED 127.0.0.1:1025
Make sure MailHog is running: docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

### **Em Produção (com SMTP):**
```
Email sent to user@example.com
```

## Troubleshooting

### **1. Erro: Connection Refused (ECONNREFUSED)**
```bash
# Problema: MailHog não está rodando
# Solução: Iniciar MailHog
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

### **2. Porta em Uso**

**Windows:**
```powershell
# Verificar quem está usando as portas
netstat -an | findstr :1025
netstat -an | findstr :8025

# Usar portas diferentes se necessário
docker run -p 2025:1025 -p 9025:8025 mailhog/mailhog
```

**Linux/macOS:**
```bash
# Verificar quem está usando as portas
netstat -an | grep :1025
netstat -an | grep :8025

# Ou usar lsof
lsof -i :1025
lsof -i :8025

# Usar portas diferentes se necessário
docker run -p 2025:1025 -p 9025:8025 mailhog/mailhog
```

### **3. NODE_ENV não detectado**

**Windows (PowerShell):**
```powershell
# Verificar variável
echo $env:NODE_ENV

# Definir se necessário
$env:NODE_ENV = "development"

# Ou criar arquivo .env
NODE_ENV=development
```

**Linux/macOS (bash):**
```bash
# Verificar variável
echo $NODE_ENV

# Definir se necessário
export NODE_ENV=development

# Ou criar arquivo .env
echo "NODE_ENV=development" > .env
```

### **4. Emails não aparecem no MailHog**
1. Verifique se `NODE_ENV=development`
2. Confirme que **não há** `SMTP_USER` e `SMTP_PASS` no .env
3. Verifique se MailHog está rodando
4. Acesse http://localhost:8025
5. Verifique logs do servidor

### **5. TypeScript/Import Errors**

**Windows (PowerShell):**
```powershell
# Limpar cache e reinstalar
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
yarn install
yarn run dev
```

**Linux/macOS (bash):**
```bash
# Limpar cache e reinstalar
rm -rf node_modules/.cache
yarn install
yarn run dev
```

## Configurações Avançadas

### **Para Usar SMTP Real em Desenvolvimento**
```ini
# .env
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
SMTP_FROM=seu-email@gmail.com
```

### **Para Forçar MailHog Mesmo com Credenciais**
Se quiser sempre usar MailHog em desenvolvimento (mesmo com SMTP configurado):
```typescript
// Modifique EmailProviderFactory
if (this.environmentService.isDevelopment()) {
  return new MailHogProvider(); // Sempre MailHog em dev
} 
```

## Dicas Práticas

### **Fluxo de Trabalho Recomendado**
1. **Desenvolvimento**: Use MailHog (sem SMTP no .env)
2. **Staging**: Configure SMTP real para testes
3. **Produção**: SMTP configurado + NODE_ENV=production

### **Debugging**
- **Códigos sempre aparecem no console** (mesmo sem MailHog)
- **Logs mostram qual provedor** está sendo usado
- **Endpoints /test** ajudam a verificar configuração

### **Performance**
- **MailHog é mais rápido** que SMTP real
- **Não há limites de rate** como Gmail/Outlook
- **Ideal para testes automatizados**

## Exemplo de Email Capturado

### **Template Gerado:**
```html
<h2>Código de Autenticação</h2>
<p>Seu código de autenticação é: <strong>123456</strong></p>
<p>Este código expira em 300 segundos.</p>
<p><em>Este email foi capturado pelo MailHog em desenvolvimento.</em></p>
```

### **Headers do Email:**
```
From: noreply@example.com
To: teste@example.com
Subject: Código de Autenticação
Content-Type: text/html; charset=utf-8
```

## 🚀 Próximos Passos

### **Extensibilidade (OCP)**
- Adicionar **SendGridProvider**
- Adicionar **AWSESProvider**
- Criar **SMSProvider** para códigos via SMS

### **Melhorias**
- Templates mais elaborados
- Suporte a anexos
- Emails em múltiplos idiomas
- Rate limiting por provedor

### **Monitoramento**
- Métricas de emails enviados
- Dashboard de status dos provedores
- Alertas para falhas de envio

---

**MailHog configurado com arquitetura SOLID - Pronto para desenvolvimento e produção!**
