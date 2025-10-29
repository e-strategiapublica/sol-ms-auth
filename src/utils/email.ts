import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  auth?: {
    user: string;
    pass: string;
  };
}

const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "587"),
  };

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    config.auth = {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    };
  }

  return nodemailer.createTransport(config);
};

export const sendEmailCode = async (email: string, code: string): Promise<void> => {
  // Em desenvolvimento, apenas loga o código sem enviar email real
  if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST || process.env.SMTP_HOST === "localhost") {
    console.log(`📧 [DEV MODE] Email code for ${email}: ${code}`);
    console.log(`📧 Code expires in ${process.env.EMAIL_CODE_EXPIRATION || 300} seconds`);
    return;
  }

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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email code sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
