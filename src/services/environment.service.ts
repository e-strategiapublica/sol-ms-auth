import type { IEnvironmentDetector } from "../interfaces/email.interfaces";

// SRP: Responsabilidade única - detectar ambiente
export class EnvironmentService implements IEnvironmentDetector {
  isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }

  hasSmtpCredentials(): boolean {
    return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  }
}
