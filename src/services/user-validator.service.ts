import type { IUserValidator, IAuthConfig } from "../interfaces/auth.interfaces";

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class UserNotFoundError extends Error {
  constructor(message: string = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

export class UserValidator implements IUserValidator {
  constructor(private config: IAuthConfig) {}

  validateUserAccess(user: any): void {
    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.is_blocked) {
      throw new AuthenticationError("User is blocked");
    }
  }

  validatePasswordAttempts(user: any): void {
    const maxAttempts = this.config.getMaxLoginAttempts();
    if (user.failed_login_attempts >= maxAttempts) {
      throw new AuthenticationError("Too many failed attempts. User is temporarily blocked");
    }
  }

  validateEmailCode(user: any, code: string): void {
    if (!user.email_code || !user.email_code_expires_at) {
      throw new AuthenticationError("No active email code");
    }

    if (user.email_code !== code) {
      throw new AuthenticationError("Invalid email code");
    }
  }

  validatePassword(user: any): void {
    if (!user.password_hash || !user.password_salt) {
      throw new AuthenticationError("Password not set for this user");
    }
  }
}
