import type { AuthResponse } from "../types/auth";

export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  resetFailedAttempts(userId: number): Promise<void>;
  incrementFailedAttempts(userId: number): Promise<void>;
  updateEmailCode(email: string, code: string, expiresAt: Date): Promise<void>;
}

export interface ITokenService {
  generateToken(payload: any): string;
  updateTokenWithMethod(existingToken: string, method: string, timestamp: number): string;
  createTokenPayload(userId: string, method: string, timestamp: number): any;
}

export interface IEmailService {
  sendCode(email: string, code: string): Promise<void>;
}

export interface ICryptoService {
  comparePassword(password: string, hash: string): boolean;
  generateEmailCode(): string;
  isEmailCodeExpired(expiresAt: Date): boolean;
}

export interface IAuthenticationStrategy {
  authenticate(identifier: string, params: any, existingToken?: string): Promise<AuthResponse>;
}

export interface IUserValidator {
  validateUserAccess(user: any): void;
  validatePasswordAttempts(user: any): void;
  validateEmailCode(user: any, code: string): void;
  validatePassword(user: any): void;
}

export interface IAuthConfig {
  getMaxLoginAttempts(): number;
  getEmailCodeExpiration(): number;
}

export interface ITimingSafeService {
  safeComparePassword(password: string, userHash: string | null, userExists: boolean): Promise<boolean>;
  safeCompareEmailCode(inputCode: string, storedCode: string | null, userExists: boolean): Promise<boolean>;
}
