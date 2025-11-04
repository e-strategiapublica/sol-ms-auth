import type { ISeedLogger } from "../interfaces/seed.interfaces.js";

export class SeedLoggerService implements ISeedLogger {
  logStart(seedName: string): void {
    console.log(`🌱 Executing seed: ${seedName}...`);
  }

  logSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  logError(error: Error): void {
    console.error("❌ Error executing seed:", error);
  }

  logTestCommands(): void {
    console.log("\n🧪 Test commands:");
    
    console.log("\n📧 Complete EMAIL authentication flow:");
    console.log("# 1. Send email code:");
    console.log("🪟 PowerShell/Windows:");
    console.log('Invoke-RestMethod -Uri "http://localhost:3000/method/email/send" -Method POST -Body \'{"identifier":"test@example.com"}\' -ContentType "application/json"');
    console.log("🐧 Linux/macOS (curl):");
    console.log('curl -X POST http://localhost:3000/method/email/send \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"identifier":"test@example.com"}\'');
    
    console.log("\n# 2. Authenticate with received code (replace CODE with the code from email/MailHog):");
    console.log("🪟 PowerShell/Windows:");
    console.log('Invoke-RestMethod -Uri "http://localhost:3000/method/email" -Method POST -Body \'{"identifier":"test@example.com","params":{"code":"CODE"}}\' -ContentType "application/json"');
    console.log("🐧 Linux/macOS (curl):");
    console.log('curl -X POST http://localhost:3000/method/email \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"identifier":"test@example.com","params":{"code":"CODE"}}\'');
    
    console.log("\n🔐 PASSWORD authentication:");
    console.log("🪟 PowerShell/Windows:");
    console.log('Invoke-RestMethod -Uri "http://localhost:3000/method/pass" -Method POST -Body \'{"identifier":"test@example.com","params":{"password":"123456"}}\' -ContentType "application/json"');
    console.log("🐧 Linux/macOS (curl):");
    console.log('curl -X POST http://localhost:3000/method/pass \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"identifier":"test@example.com","params":{"password":"123456"}}\'');
    
    console.log("\n💡 Tip: After running the first command, check MailHog at http://localhost:8025 to see the sent code!");
  }

  logSeedSummary(): void {
    console.log("\n🎉 All seeds executed successfully!");
    console.log("\n📋 Available test user:");
    console.log("┌─────────────────────┬──────────────────────┬─────────────────────┐");
    console.log("│ Email               │ Available Methods    │ Password            │");
    console.log("├─────────────────────┼──────────────────────┼─────────────────────┤");
    console.log("│ test@example.com    │ All routes           │ 123456              │");
    console.log("└─────────────────────┴──────────────────────┴─────────────────────┘");
  }
}
