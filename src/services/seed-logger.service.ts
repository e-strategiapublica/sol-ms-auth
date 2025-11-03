import type { ISeedLogger } from "../interfaces/seed.interfaces.js";

export class SeedLoggerService implements ISeedLogger {
  logStart(seedName: string): void {
    console.log(`🌱 Executando seed: ${seedName}...`);
  }

  logSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  logError(error: Error): void {
    console.error("❌ Erro ao executar seed:", error);
  }

  logTestCommands(): void {
    console.log("\n🧪 Comandos de teste:");
    
    console.log("\n📧 Fluxo completo de autenticação por EMAIL:");
    console.log("# 1. Enviar código por email:");
    console.log("🪟 PowerShell/Windows:");
    console.log('Invoke-RestMethod -Uri "http://localhost:3000/method/email/send" -Method POST -Body \'{"identifier":"test@example.com"}\' -ContentType "application/json"');
    console.log("🐧 Linux/macOS (curl):");
    console.log('curl -X POST http://localhost:3000/method/email/send \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"identifier":"test@example.com"}\'');
    
    console.log("\n# 2. Autenticar com o código recebido (substitua CODIGO pelo código do email/MailHog):");
    console.log("🪟 PowerShell/Windows:");
    console.log('Invoke-RestMethod -Uri "http://localhost:3000/method/email" -Method POST -Body \'{"identifier":"test@example.com","params":{"code":"CODIGO"}}\' -ContentType "application/json"');
    console.log("🐧 Linux/macOS (curl):");
    console.log('curl -X POST http://localhost:3000/method/email \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"identifier":"test@example.com","params":{"code":"CODIGO"}}\'');
    
    console.log("\n🔐 Autenticação por SENHA:");
    console.log("🪟 PowerShell/Windows:");
    console.log('Invoke-RestMethod -Uri "http://localhost:3000/method/pass" -Method POST -Body \'{"identifier":"test@example.com","params":{"password":"123456"}}\' -ContentType "application/json"');
    console.log("🐧 Linux/macOS (curl):");
    console.log('curl -X POST http://localhost:3000/method/pass \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"identifier":"test@example.com","params":{"password":"123456"}}\'');
    
    console.log("\n💡 Dica: Após executar o primeiro comando, verifique o MailHog em http://localhost:8025 para ver o código enviado!");
  }

  logSeedSummary(): void {
    console.log("\n🎉 Todos os seeds executados com sucesso!");
    console.log("\n📋 Usuário disponível para teste:");
    console.log("┌─────────────────────┬──────────────────────┬─────────────────────┐");
    console.log("│ Email               │ Métodos Disponíveis  │ Senha               │");
    console.log("├─────────────────────┼──────────────────────┼─────────────────────┤");
    console.log("│ test@example.com    │ Todas as rotas       │ 123456              │");
    console.log("└─────────────────────┴──────────────────────┴─────────────────────┘");
  }
}
