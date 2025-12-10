import type { IAuthConfig } from "../interfaces/auth.interfaces";

export class AuthConfig implements IAuthConfig {
  getMaxLoginAttempts(): number {
    return parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5");
  }

  getEmailCodeExpiration(): number {
    return parseInt(process.env.EMAIL_CODE_EXPIRATION || "300");
  }
}
