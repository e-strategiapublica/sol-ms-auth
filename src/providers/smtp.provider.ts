import nodemailer from "nodemailer";
import type { IEmailProvider, IEmailTransporter, EmailConfig } from "../interfaces/email.interfaces";

// SRP: Responsabilidade única - provedor SMTP
export class SmtpProvider implements IEmailProvider {
  createTransporter(): IEmailTransporter {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || "localhost",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465", // true para porta 465, false para outras
    };

    // Adiciona autenticação apenas se credenciais estiverem disponíveis
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      config.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      };
    }

    return nodemailer.createTransport(config);
  }

  getName(): string {
    return "SMTP";
  }
}
