export interface ISeed {
  name: string;
  execute(): Promise<void>;
}

export interface IUserGenerator {
  generateTestUser(email: string, name: string, password: string): Promise<any>;
}

export interface IDataCleaner {
  cleanTestUsers(emails: string[]): Promise<void>;
}

export interface ISeedLogger {
  logStart(seedName: string): void;
  logSuccess(message: string): void;
  logError(error: Error): void;
  logTestCommands(): void;
  logSeedSummary(): void;
}

export interface ISeedConfig {
  getTestPassword(): string;
  getTestEmails(): string[];
}

export interface ISeedRunner {
  runAll(): Promise<void>;
  runSeed(seed: ISeed): Promise<void>;
}
