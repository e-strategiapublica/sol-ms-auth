import { seedAuthTestUsers } from "./seeds/001_auth_test_users.js";

/**
 * Script principal para executar todos os seeds
 * 
 * Uso:
 * npm run seeds
 * ou
 * tsx src/database/seeder.ts
 */

const runSeeds = async () => {
  console.log("🌱 Iniciando execução de seeds...\n");

  try {
    // Executar seeds em ordem
    await seedAuthTestUsers();
    
    console.log("\n🎉 Todos os seeds executados com sucesso!");
    console.log("\n📋 Usuário disponível para teste:");
    console.log("┌─────────────────────┬──────────────────────┬─────────────────────┐");
    console.log("│ Email               │ Métodos Disponíveis  │ Senha               │");
    console.log("├─────────────────────┼──────────────────────┼─────────────────────┤");
    console.log("│ test@example.com    │ Todas as rotas       │ 123456              │");
    console.log("└─────────────────────┴──────────────────────┴─────────────────────┘");
    
    console.log("\n🧪 Comandos de teste:");
    
    console.log("\n📧 Fluxo completo de autenticação por EMAIL:");
    console.log("# 1. Enviar código por email:");
    console.log('Invoke-RestMethod -Uri "http://localhost:3000/method/email/send" -Method POST -Body \'{"identifier":"test@example.com"}\' -ContentType "application/json"');
    
    console.log("\n# 2. Autenticar com o código recebido (substitua CODIGO pelo código do email/MailHog):");
    console.log('Invoke-RestMethod -Uri "http://localhost:3000/method/email" -Method POST -Body \'{"identifier":"test@example.com","params":{"code":"CODIGO"}}\' -ContentType "application/json"');
    
    console.log("\n🔐 Autenticação por SENHA:");
    console.log('Invoke-RestMethod -Uri "http://localhost:3000/method/pass" -Method POST -Body \'{"identifier":"test@example.com","params":{"password":"123456"}}\' -ContentType "application/json"');
    
    console.log("\n💡 Dica: Após executar o primeiro comando, verifique o MailHog em http://localhost:8025 para ver o código enviado!");
    
  } catch (error) {
    console.error("💥 Erro durante execução dos seeds:", error);
    process.exit(1);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  runSeeds()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("💥 Falha na execução:", error);
      process.exit(1);
    });
}

export { runSeeds };
