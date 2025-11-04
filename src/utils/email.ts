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

const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

const createTransporter = () => {
  let config: EmailConfig;

  if (isDevelopment() && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
    config = {
      host: "localhost",
      port: 1025,
      secure: false,
    };
    console.log("📧 [DEV] Using MailHog for email testing (http://localhost:8025)");
  } else {
    config = {
      host: process.env.SMTP_HOST || "localhost",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
    };
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      config.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      };
    }
  }

  return nodemailer.createTransport(config);
};

export const sendEmailCode = async (email: string, code: string): Promise<void> => {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || "noreply@example.com";

  const mailOptions = {
    from,
    to: email,
    subject: "Authentication Code",
    html: `
      <h2>Authentication Code</h2>
      <p>Your authentication code is: <strong>${code}</strong></p>
      <p>This code expires in ${process.env.EMAIL_CODE_EXPIRATION || 300} seconds.</p>
      ${isDevelopment() ? '<p><em>This email was captured by MailHog in development.</em></p>' : ''}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    
    if (isDevelopment()) {
      console.log(`📧 [DEV] Email sent to MailHog for ${email}`);
      console.log(`📧 [DEV] Code: ${code} (expires in ${process.env.EMAIL_CODE_EXPIRATION || 300}s)`);
      console.log(`📧 [DEV] Check MailHog interface: http://localhost:8025`);
    } else {
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
