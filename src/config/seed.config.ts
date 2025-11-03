import type { ISeedConfig } from "../interfaces/seed.interfaces.js";

// ISP: Interface específica para configuração de seeds
export class SeedConfig implements ISeedConfig {
  getTestPassword(): string {
    return process.env.TEST_PASSWORD || "123456";
  }

  getTestEmails(): string[] {
    return ["test@example.com"];
  }

  getTestUserName(): string {
    return "Test User";
  }
}
