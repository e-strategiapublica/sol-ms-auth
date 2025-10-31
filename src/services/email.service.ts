import type { IEmailService } from "../interfaces/auth.interfaces";
import type { IEmailProvider, IEmailLogger, IEnvironmentDetector } from "../interfaces/email.interfaces";
import { EmailProviderFactory } from "../factories/email-provider.factory";
import { EmailTemplateService } from "./email-template.service";
import { EmailLoggerService } from "./email-logger.service";
import { EnvironmentService } from "./environment.service";

// SRP + DIP: Responsabilidade única com injeção de dependência
export class EmailService implements IEmailService {
  private emailProvider: IEmailProvider;
  private templateService: EmailTemplateService;
  private logger: IEmailLogger;

  constructor(
    environmentService?: IEnvironmentDetector,
    logger?: IEmailLogger
  ) {
    // Dependency Injection com fallback para compatibilidade
    const envService = environmentService || new EnvironmentService();
    this.logger = logger || new EmailLoggerService(envService);
    this.templateService = new EmailTemplateService(envService);
    
    const factory = new EmailProviderFactory(envService);
    this.emailProvider = factory.createProvider();
  }

  async sendCode(email: string, code: string): Promise<void> {
    try {
      const transporter = this.emailProvider.createTransporter();
      const emailOptions = this.templateService.createAuthCodeEmail(email, code);

      await transporter.sendMail(emailOptions);
      
      this.logger.logEmailSent(email, this.emailProvider.getName());
      this.logger.logCodeGenerated(email, code);
      
    } catch (error) {
      this.logger.logEmailError(error as Error, this.emailProvider.getName());
      throw new Error("Failed to send email");
    }
  }
}
