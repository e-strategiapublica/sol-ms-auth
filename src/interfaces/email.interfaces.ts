import type { SendMailOptions } from "nodemailer";

export interface IEmailTransporter {
  sendMail(options: EmailOptions): Promise<unknown>;
}

export interface IEmailProvider {
  createTransporter(): IEmailTransporter;
  getName(): string;
}

export interface IEnvironmentDetector {
  isDevelopment(): boolean;
  isProduction(): boolean;
}

export interface IEmailLogger {
  logEmailSent(email: string, provider: string): void;
  logEmailError(error: Error, provider: string): void;
  logCodeGenerated(email: string, code: string): void;
}

export type EmailOptions = SendMailOptions;

export interface EmailConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}
