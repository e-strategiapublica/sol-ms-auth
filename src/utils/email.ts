import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

/**
 * Detecta se estamos em ambiente de desenvolvimento
 * Usa a variável NODE_ENV já definida no projeto
 */
const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

/**
 * Cria o transporter do Nodemailer baseado no ambiente
 * - Desenvolvimento: usa MailHog (localhost:1025, sem autenticação)
 * - Outros ambientes: usa configuração SMTP existente
 */
const createTransporter = () => {
  let config: EmailConfig;

  if (isDevelopment() && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
    // Configuração para MailHog em desenvolvimento (quando não há credenciais SMTP)
    // MailHog captura emails em localhost:1025 (SMTP)
    // Interface web disponível em http://localhost:8025
    config = {
      host: "localhost",
      port: 1025,
      secure: false, // MailHog não usa TLS
      // Sem autenticação para MailHog
    };
    console.log("📧 [DEV] Using MailHog for email testing (http://localhost:8025)");
  } else {
    // Configuração SMTP para produção/staging (mantém comportamento existente)
    config = {
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
  }

  return nodemailer.createTransport(config);
};

/**
 * Envia código de autenticação por email
 * - Desenvolvimento: envia via MailHog + log no console
 * - Outros ambientes: envia via SMTP configurado
 */
export const sendEmailCode = async (email: string, code: string): Promise<void> => {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || "noreply@example.com";

  const mailOptions = {
    from,
    to: email,
    subject: "Código de Autenticação",
    html: `
      <h2>Código de Autenticação</h2>
      <p>Seu código de autenticação é: <strong>${code}</strong></p>
      <p>Este código expira em ${process.env.EMAIL_CODE_EXPIRATION || 300} segundos.</p>
      ${isDevelopment() ? '<p><em>Este email foi capturado pelo MailHog em desenvolvimento.</em></p>' : ''}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    
    if (isDevelopment()) {
      // Em desenvolvimento: log no console + MailHog
      console.log(`📧 [DEV] Email sent to MailHog for ${email}`);
      console.log(`📧 [DEV] Code: ${code} (expires in ${process.env.EMAIL_CODE_EXPIRATION || 300}s)`);
      console.log(`📧 [DEV] Check MailHog interface: http://localhost:8025`);
    } else {
      // Em outros ambientes: apenas log básico
      console.log(`📧 Email code sent to ${email}`);
    }
  } catch (error) {
    console.error("Error sending email:", error);
    if (isDevelopment()) {
      console.error("💡 Make sure MailHog is running: docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog");
    }
    throw new Error("Failed to send email");
  }
};
