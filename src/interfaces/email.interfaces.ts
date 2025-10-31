// ISP: Interfaces segregadas para email
export interface IEmailTransporter {
  sendMail(options: any): Promise<any>;
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

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}
