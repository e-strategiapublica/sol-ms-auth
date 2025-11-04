import type { ISeedRunner, ISeed, ISeedLogger } from "../interfaces/seed.interfaces.js";

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
    console.log("🌱 Starting seeds execution...\n");

    try {
      for (const seed of this.seeds) {
        await this.runSeed(seed);
      }

      this.logger.logSeedSummary();
      this.logger.logTestCommands();
      
    } catch (error) {
      console.error("💥 Error during seeds execution:", error);
      throw error;
    }
  }
}
