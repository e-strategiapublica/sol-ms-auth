import type { IEmailProvider, IEnvironmentDetector } from "../interfaces/email.interfaces";
import { MailHogProvider } from "../providers/mailhog.provider";
import { SmtpProvider } from "../providers/smtp.provider";

export class EmailProviderFactory {
  constructor(private environmentService: IEnvironmentDetector) {}

  createProvider(): IEmailProvider {
    const isDev = this.environmentService.isDevelopment();
    const hasCredentials = this.hasSmtpCredentials();
    
    console.log(`📧 [DEBUG] Environment: ${process.env.NODE_ENV || 'undefined'}`);
    console.log(`📧 [DEBUG] isDevelopment: ${isDev}`);
    console.log(`📧 [DEBUG] hasSmtpCredentials: ${hasCredentials}`);
    
    if (isDev && !hasCredentials) {
      console.log("📧 [DEBUG] Using MailHogProvider");
      return new MailHogProvider();
    }
    
    console.log("📧 [DEBUG] Using SmtpProvider");
    return new SmtpProvider();
  }

  private hasSmtpCredentials(): boolean {
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();
    
    console.log(`📧 [DEBUG] SMTP_USER: "${user || 'undefined'}"`);
    console.log(`📧 [DEBUG] SMTP_PASS: "${pass ? '[HIDDEN]' : 'undefined'}"`);
    
    return !!(user && pass && user.length > 0 && pass.length > 0);
  }
}
