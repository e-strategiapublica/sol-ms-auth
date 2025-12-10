import type { IUserValidator, IAuthConfig } from "../interfaces/auth.interfaces";
import { AccountLockoutService, type IAccountLockoutService } from "./account-lockout.service";

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

export class AccountLockedError extends Error {
  constructor(message: string, public remainingTime?: number) {
    super(message);
    this.name = "AccountLockedError";
  }
}

export class UserValidator implements IUserValidator {
  private lockoutService: IAccountLockoutService;

  constructor(
    private config: IAuthConfig,
    lockoutService?: IAccountLockoutService
  ) {
    this.lockoutService = lockoutService || new AccountLockoutService();
  }

  validateUserAccess(user: any): void {
    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.is_blocked) {
      throw new AuthenticationError("Account has been permanently blocked");
    }

    // Check if user should be permanently blocked due to excessive attempts
    if (this.lockoutService.shouldBlockUser(user.failed_login_attempts)) {
      throw new AuthenticationError("Account has been permanently blocked due to excessive failed attempts");
    }

    // Check temporary lockout
    const lastAttempt = user.updated_at ? new Date(user.updated_at) : undefined;
    if (this.lockoutService.isAccountLocked(user.failed_login_attempts, lastAttempt)) {
      const remainingTime = this.lockoutService.getRemainingLockoutTime(user.failed_login_attempts, lastAttempt);
      const minutes = Math.ceil(remainingTime / (60 * 1000));
      
      throw new AccountLockedError(
        `Account is temporarily locked. Try again in ${minutes} minutes.`,
        remainingTime
      );
    }
  }

  validatePasswordAttempts(user: any): void {
    // This is now handled in validateUserAccess with progressive lockout
    // Keeping for backward compatibility but delegating to lockout service
    const lastAttempt = user.updated_at ? new Date(user.updated_at) : undefined;
    
    if (this.lockoutService.isAccountLocked(user.failed_login_attempts, lastAttempt)) {
      const remainingTime = this.lockoutService.getRemainingLockoutTime(user.failed_login_attempts, lastAttempt);
      const minutes = Math.ceil(remainingTime / (60 * 1000));
      
      throw new AccountLockedError(
        `Too many failed attempts. Account is locked for ${minutes} minutes.`,
        remainingTime
      );
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
