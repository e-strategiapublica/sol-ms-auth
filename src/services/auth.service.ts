import type { 
  IUserRepository, 
  IEmailService, 
  ICryptoService, 
  IAuthConfig,
  IAuthenticationStrategy,
  IUserValidator
} from "../interfaces/auth.interfaces";
import type { AuthResponse } from "../types/auth";
import { AuthenticationError, UserNotFoundError } from "./user-validator.service";

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private cryptoService: ICryptoService,
    private config: IAuthConfig,
    private userValidator: IUserValidator,
    private emailAuthStrategy: IAuthenticationStrategy,
    private passwordAuthStrategy: IAuthenticationStrategy
  ) {}

  async authenticateWithEmail(
    identifier: string,
    code: string,
    existingToken?: string
  ): Promise<AuthResponse> {
    return await this.emailAuthStrategy.authenticate(
      identifier, 
      { code }, 
      existingToken
    );
  }

  async authenticateWithPassword(
    identifier: string,
    password: string,
    existingToken?: string
  ): Promise<AuthResponse> {
    return await this.passwordAuthStrategy.authenticate(
      identifier, 
      { password }, 
      existingToken
    );
  }

  async sendEmailAuthCode(identifier: string): Promise<void> {
    const user = await this.userRepository.findByEmail(identifier);
    
    this.userValidator.validateUserAccess(user);

    const code = this.cryptoService.generateEmailCode();
    const expirationSeconds = this.config.getEmailCodeExpiration();
    const expiresAt = new Date(Date.now() + expirationSeconds * 1000);

    await this.userRepository.updateEmailCode(identifier, code, expiresAt);
    await this.emailService.sendCode(identifier, code);
  }
}

export const createAuthService = (): AuthService => {
  const { UserRepositoryAdapter } = require("../adapters/user-repository.adapter");
  const { EmailService } = require("./email.service");
  const { CryptoService } = require("./crypto.service");
  const { UserValidatorService } = require("./user-validator.service");
  const { AuthConfig } = require("../config/auth.config");
  const { TokenService } = require("./token.service");
  const { TimingSafeService } = require("./timing-safe.service");
  const { EmailAuthStrategy } = require("../strategies/email-auth.strategy");
  const { PasswordAuthStrategy } = require("../strategies/password-auth.strategy");

  const userRepository = new UserRepositoryAdapter();
  const emailService = new EmailService();
  const cryptoService = new CryptoService();
  const userValidator = new UserValidatorService();
  const config = new AuthConfig();
  const tokenService = new TokenService();
  const timingSafeService = new TimingSafeService(cryptoService);

  const emailAuthStrategy = new EmailAuthStrategy(
    userRepository,
    tokenService,
    cryptoService,
    userValidator,
    timingSafeService
  );

  const passwordAuthStrategy = new PasswordAuthStrategy(
    userRepository,
    tokenService,
    cryptoService,
    userValidator,
    timingSafeService
  );

  return new AuthService(
    userRepository,
    emailService,
    cryptoService,
    config,
    userValidator,
    emailAuthStrategy,
    passwordAuthStrategy
  );
};

const authService = createAuthService();
export { AuthenticationError, UserNotFoundError };
export default {
  authenticateWithEmail: authService.authenticateWithEmail.bind(authService),
  authenticateWithPassword: authService.authenticateWithPassword.bind(authService),
  sendEmailAuthCode: authService.sendEmailAuthCode.bind(authService),
  AuthenticationError,
  UserNotFoundError,
};