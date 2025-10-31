import type { IEmailLogger, IEnvironmentDetector } from "../interfaces/email.interfaces";

// SRP: Responsabilidade única - logs de email
export class EmailLoggerService implements IEmailLogger {
  constructor(private environmentService: IEnvironmentDetector) {}

  logEmailSent(email: string, provider: string): void {
    if (this.environmentService.isDevelopment()) {
      console.log(`📧 [DEV] Email sent via ${provider} for ${email}`);
      if (provider === "MailHog") {
        console.log(`📧 [DEV] Check MailHog interface: http://localhost:8025`);
      }
    } else {
      console.log(`📧 Email sent to ${email}`);
    }
  }

  logEmailError(error: Error, provider: string): void {
    console.error(`Error sending email via ${provider}:`, error);
    
    if (this.environmentService.isDevelopment() && provider === "MailHog") {
      console.error("💡 Make sure MailHog is running: docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog");
    }
  }

  logCodeGenerated(email: string, code: string): void {
    if (this.environmentService.isDevelopment()) {
      console.log(`📧 [DEV] Code: ${code} (expires in ${process.env.EMAIL_CODE_EXPIRATION || 300}s)`);
    }
  }
}
