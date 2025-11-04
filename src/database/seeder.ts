import { createAuthTestUsersSeed } from "./seeds/001_auth_test_users.js";
import { SeedRunnerService } from "../services/seed-runner.service.js";
import { SeedLoggerService } from "../services/seed-logger.service.js";

const createSeedRunner = (): SeedRunnerService => {
  const logger = new SeedLoggerService();
  const runner = new SeedRunnerService(logger);
  
  runner.addSeed(createAuthTestUsersSeed());
  
  return runner;
};

const runSeeds = async () => {
  try {
    const seedRunner = createSeedRunner();
    await seedRunner.runAll();
    
  } catch (error) {
    console.error("💥 Error during seeds execution:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeeds()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("💥 Execution failed:", error);
      process.exit(1);
    });
}

export { runSeeds };
