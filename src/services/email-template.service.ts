import type { EmailOptions, IEnvironmentDetector } from "../interfaces/email.interfaces";

export class EmailTemplateService {
  constructor(private environmentService: IEnvironmentDetector) {}

  createAuthCodeEmail(email: string, code: string): EmailOptions {
    const from = process.env.SMTP_FROM || "noreply@example.com";
    
    return {
      from,
      to: email,
      subject: "Código de Autenticação",
      html: this.buildAuthCodeTemplate(code),
    };
  }

  private buildAuthCodeTemplate(code: string): string {
    const developmentNote = this.environmentService.isDevelopment() 
      ? '<p><em>Este email foi capturado pelo MailHog em desenvolvimento.</em></p>' 
      : '';

    return `
      <h2>Código de Autenticação</h2>
      <p>Seu código de autenticação é: <strong>${code}</strong></p>
      <p>Este código expira em ${process.env.EMAIL_CODE_EXPIRATION || 300} segundos.</p>
      ${developmentNote}
    `;
  }
}
