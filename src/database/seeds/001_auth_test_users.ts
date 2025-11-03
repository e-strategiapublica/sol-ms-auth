import { db } from "../../config/db.js";
import { generateSalt, hashPassword } from "../../utils/crypto.js";

/**
 * Seed para criar usuário de teste para as rotas de autenticação
 * 
 * Usuário criado:
 * - test@example.com - Para testar todas as rotas de autenticação
 */

export const seedAuthTestUsers = async () => {
  console.log("🌱 Executando seed: Auth Test Users...");

  try {
    // Limpar usuário de teste existente
    await db
      .deleteFrom("user")
      .where("email", "=", "test@example.com")
      .execute();

    // Gerar hashes de senha
    const testPassword = "123456";
    const salt = generateSalt();
    const passwordHash = hashPassword(testPassword, salt);

    // Usuário de teste único
    const testUser = {
      email: "test@example.com",
      name: "Test User", 
      password_hash: passwordHash,
      password_salt: salt,
      failed_login_attempts: 0,
      is_blocked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Inserir usuário
    await db
      .insertInto("user")
      .values(testUser)
      .execute();

    console.log("✅ Usuário de teste criado:");
    console.log("   👤 test@example.com - Para todas as rotas (senha: 123456)");
    
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    throw error;
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  seedAuthTestUsers()
    .then(() => {
      console.log("🎉 Seed executado com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Falha na execução do seed:", error);
      process.exit(1);
    });
}
