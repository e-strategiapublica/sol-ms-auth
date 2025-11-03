import type { IEmailProvider, IEnvironmentDetector } from "../interfaces/email.interfaces";
import { MailHogProvider } from "../providers/mailhog.provider";
import { SmtpProvider } from "../providers/smtp.provider";

// OCP + Factory Pattern: Extensível para novos provedores
export class EmailProviderFactory {
  constructor(private environmentService: IEnvironmentDetector) {}

  createProvider(): IEmailProvider {
    // Em desenvolvimento sem credenciais SMTP: usa MailHog
    if (this.environmentService.isDevelopment() && !this.hasSmtpCredentials()) {
      return new MailHogProvider();
    }
    
    // Em outros casos: usa SMTP
    return new SmtpProvider();
  }

  private hasSmtpCredentials(): boolean {
    return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  }
}
