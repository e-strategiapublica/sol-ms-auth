import { createAuthTestUsersSeed } from "./seeds/001_auth_test_users.js";
import { SeedRunnerService } from "../services/seed-runner.service.js";
import { SeedLoggerService } from "../services/seed-logger.service.js";

// Factory para criar o runner com dependências (DIP)
const createSeedRunner = (): SeedRunnerService => {
  const logger = new SeedLoggerService();
  const runner = new SeedRunnerService(logger);
  
  // Registrar seeds (OCP - facilmente extensível)
  runner.addSeed(createAuthTestUsersSeed());
  
  return runner;
};

const runSeeds = async () => {
  try {
    const seedRunner = createSeedRunner();
    await seedRunner.runAll();
    
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
