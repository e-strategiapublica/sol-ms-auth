import type { ISeed, IUserGenerator, IDataCleaner, ISeedLogger, ISeedConfig } from "../../interfaces/seed.interfaces.js";
import { db } from "../../config/db.js";

/**
 * Seed para criar usuário de teste para as rotas de autenticação
 */

export class AuthTestUsersSeed implements ISeed {
  public readonly name = "Auth Test Users";

  constructor(
    private userGenerator: IUserGenerator,
    private dataCleaner: IDataCleaner,
    private logger: ISeedLogger,
    private config: ISeedConfig
  ) {}

  async execute(): Promise<void> {
    this.logger.logStart(this.name);

    try {
      // Limpar dados existentes (SRP)
      const emails = this.config.getTestEmails();
      await this.dataCleaner.cleanTestUsers(emails);

      // Gerar usuário de teste (SRP)
      const email = emails[0];
      if (!email) {
        throw new Error("Email de teste não configurado");
      }
      
      const testUser = await this.userGenerator.generateTestUser(
        email,
        "Test User",
        this.config.getTestPassword()
      );

      // Inserir no banco
      await db
        .insertInto("user")
        .values(testUser)
        .execute();

      this.logger.logSuccess(`Usuário de teste criado: ${emails[0]} (senha: ${this.config.getTestPassword()})`);
      
    } catch (error) {
      this.logger.logError(error as Error);
      throw error;
    }
  }
}

// Factory para compatibilidade (DIP)
export const createAuthTestUsersSeed = (): AuthTestUsersSeed => {
  const { UserGeneratorService } = require("../../services/user-generator.service");
  const { DataCleanerService } = require("../../services/data-cleaner.service");
  const { SeedLoggerService } = require("../../services/seed-logger.service");
  const { SeedConfig } = require("../../config/seed.config");

  return new AuthTestUsersSeed(
    new UserGeneratorService(),
    new DataCleanerService(),
    new SeedLoggerService(),
    new SeedConfig()
  );
};

// Função legacy para compatibilidade
export const seedAuthTestUsers = async () => {
  const seed = createAuthTestUsersSeed();
  await seed.execute();
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
