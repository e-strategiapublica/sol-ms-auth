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

// SRP + DIP: AuthService agora usa injeção de dependência e tem responsabilidades bem definidas
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

// Factory para criar instância com dependências
export const createAuthService = (): AuthService => {
  // Imports das implementações concretas
  const { UserRepositoryAdapter } = require("../adapters/user-repository.adapter");
  const { EmailService } = require("./email.service");
  const { CryptoService } = require("./crypto.service");
  const { AuthConfig } = require("../config/auth.config");
  const { UserValidator } = require("./user-validator.service");
  const { TokenService } = require("./token.service");
  const { EmailAuthStrategy } = require("../strategies/email-auth.strategy");
  const { PasswordAuthStrategy } = require("../strategies/password-auth.strategy");

  // Criação das dependências
  const userRepository = new UserRepositoryAdapter();
  const emailService = new EmailService();
  const cryptoService = new CryptoService();
  const config = new AuthConfig();
  const userValidator = new UserValidator(config);
  const tokenService = new TokenService();

  // Criação das estratégias
  const emailAuthStrategy = new EmailAuthStrategy(
    userRepository,
    tokenService,
    cryptoService,
    userValidator
  );

  const passwordAuthStrategy = new PasswordAuthStrategy(
    userRepository,
    tokenService,
    cryptoService,
    userValidator
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

// Instância singleton para compatibilidade com código existente
const authService = createAuthService();

// Exportações para compatibilidade
export { AuthenticationError, UserNotFoundError };
export default {
  authenticateWithEmail: authService.authenticateWithEmail.bind(authService),
  authenticateWithPassword: authService.authenticateWithPassword.bind(authService),
  sendEmailAuthCode: authService.sendEmailAuthCode.bind(authService),
  AuthenticationError,
  UserNotFoundError,
};