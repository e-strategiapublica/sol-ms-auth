import type { ISeedRunner, ISeed, ISeedLogger } from "../interfaces/seed.interfaces.js";

// SRP: Responsabilidade única - execução de seeds
export class SeedRunnerService implements ISeedRunner {
  constructor(
    private logger: ISeedLogger,
    private seeds: ISeed[] = []
  ) {}

  addSeed(seed: ISeed): void {
    this.seeds.push(seed);
  }

  async runSeed(seed: ISeed): Promise<void> {
    await seed.execute();
  }

  async runAll(): Promise<void> {
    console.log("🌱 Iniciando execução de seeds...\n");

    try {
      // Executar todos os seeds em sequência
      for (const seed of this.seeds) {
        await this.runSeed(seed);
      }

      // Log final com resumo e comandos
      this.logger.logSeedSummary();
      this.logger.logTestCommands();
      
    } catch (error) {
      console.error("💥 Erro durante execução dos seeds:", error);
      throw error;
    }
  }
}
