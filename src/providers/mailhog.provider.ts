import nodemailer from "nodemailer";
import type { IEmailProvider, IEmailTransporter, EmailConfig } from "../interfaces/email.interfaces";

export class MailHogProvider implements IEmailProvider {
  createTransporter(): IEmailTransporter {
    const config: EmailConfig = {
      host: "localhost",
      port: 1025,
      secure: false, // MailHog não usa TLS
      // Sem autenticação para MailHog
    };

    const transporter = nodemailer.createTransport(config);
    
    console.log("📧 [DEV] Using MailHog for email testing (http://localhost:8025)");
    
    return transporter;
  }

  getName(): string {
    return "MailHog";
  }
}
