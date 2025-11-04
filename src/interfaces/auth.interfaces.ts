import type { AuthResponse } from "../types/auth";

// Interface para repositório de usuários (DIP)
export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  resetFailedAttempts(userId: number): Promise<void>;
  incrementFailedAttempts(userId: number): Promise<void>;
  updateEmailCode(email: string, code: string, expiresAt: Date): Promise<void>;
}

// Interface para serviço de token (SRP + DIP)
export interface ITokenService {
  generateToken(payload: any): string;
  updateTokenWithMethod(existingToken: string, method: string, timestamp: number): string;
  createTokenPayload(userId: string, method: string, timestamp: number): any;
}

// Interface para serviço de email (SRP + DIP)
export interface IEmailService {
  sendCode(email: string, code: string): Promise<void>;
}

// Interface para serviço de criptografia (SRP + DIP)
export interface ICryptoService {
  comparePassword(password: string, hash: string): boolean;
  generateEmailCode(): string;
  isEmailCodeExpired(expiresAt: Date): boolean;
}

// Interface base para estratégias de autenticação (OCP + SRP)
export interface IAuthenticationStrategy {
  authenticate(identifier: string, params: any, existingToken?: string): Promise<AuthResponse>;
}

// Interface para validação de usuário (SRP)
export interface IUserValidator {
  validateUserAccess(user: any): void;
  validatePasswordAttempts(user: any): void;
  validateEmailCode(user: any, code: string): void;
  validatePassword(user: any): void;
}

// Interface para configuração (ISP)
export interface IAuthConfig {
  getMaxLoginAttempts(): number;
  getEmailCodeExpiration(): number;
}

// Interface para proteção contra timing attacks (SRP)
export interface ITimingSafeService {
  safeComparePassword(password: string, userHash: string | null, userExists: boolean): Promise<boolean>;
  safeCompareEmailCode(inputCode: string, storedCode: string | null, userExists: boolean): Promise<boolean>;
}
