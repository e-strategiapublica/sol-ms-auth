// Interface para seeds (DIP)
export interface ISeed {
  name: string;
  execute(): Promise<void>;
}

// Interface para geração de usuários (SRP)
export interface IUserGenerator {
  generateTestUser(email: string, name: string, password: string): Promise<any>;
}

// Interface para limpeza de dados (SRP)
export interface IDataCleaner {
  cleanTestUsers(emails: string[]): Promise<void>;
}

// Interface para logging de seeds (SRP)
export interface ISeedLogger {
  logStart(seedName: string): void;
  logSuccess(message: string): void;
  logError(error: Error): void;
  logTestCommands(): void;
  logSeedSummary(): void;
}

// Interface para configuração de seeds (ISP)
export interface ISeedConfig {
  getTestPassword(): string;
  getTestEmails(): string[];
}

// Interface para execução de seeds (SRP)
export interface ISeedRunner {
  runAll(): Promise<void>;
  runSeed(seed: ISeed): Promise<void>;
}
