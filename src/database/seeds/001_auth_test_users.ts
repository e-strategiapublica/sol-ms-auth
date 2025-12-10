import type { ISeed, IUserGenerator, IDataCleaner, ISeedLogger, ISeedConfig } from "../../interfaces/seed.interfaces.js";
import { db } from "../../config/db.js";

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
      const emails = this.config.getTestEmails();
      await this.dataCleaner.cleanTestUsers(emails);

      const email = emails[0];
      if (!email) {
        throw new Error("Test email not configured");
      }
      
      const testUser = await this.userGenerator.generateTestUser(
        email,
        "Test User",
        this.config.getTestPassword()
      );

      await db
        .insertInto("user")
        .values(testUser)
        .execute();

      this.logger.logSuccess(`Test user created: ${emails[0]} (password: ${this.config.getTestPassword()})`);
      
    } catch (error) {
      this.logger.logError(error as Error);
      throw error;
    }
  }
}

// Factory for compatibility
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

export const seedAuthTestUsers = async () => {
  const seed = createAuthTestUsersSeed();
  await seed.execute();
};

if (require.main === module) {
  seedAuthTestUsers()
    .then(() => {
      console.log("🎉 Seed executed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seed execution failed:", error);
      process.exit(1);
    });
}
