import { sendEmailCode } from "../utils/email";
import type { IEmailService } from "../interfaces/auth.interfaces";

// SRP: Responsabilidade única - envio de emails
export class EmailService implements IEmailService {
  async sendCode(email: string, code: string): Promise<void> {
    await sendEmailCode(email, code);
  }
}
