import type { 
  IAuthenticationStrategy, 
  IUserRepository, 
  ITokenService, 
  ICryptoService, 
  IUserValidator,
  ITimingSafeService
} from "../interfaces/auth.interfaces";
import type { AuthResponse, EmailAuthParams } from "../types/auth";
import { AuthenticationError } from "../services/user-validator.service";

export class EmailAuthStrategy implements IAuthenticationStrategy<EmailAuthParams> {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
    private cryptoService: ICryptoService,
    private userValidator: IUserValidator,
    private timingSafeService: ITimingSafeService
  ) {}

  async authenticate(identifier: string, params: EmailAuthParams, existingToken?: string): Promise<AuthResponse> {
    const { code } = params;
    const user = await this.userRepository.findByEmail(identifier);
    const userExists = !!user;

    // Always increment attempts first to prevent bypass
    if (userExists) {
      await this.userRepository.incrementFailedAttempts(user.id);
    }

    // Perform timing-safe code comparison
    const isValidCode = await this.timingSafeService.safeCompareEmailCode(
      code,
      user?.email_code || null,
      userExists
    );

    // Validate user access and code requirements only if user exists
    if (userExists) {
      try {
        this.userValidator.validateUserAccess(user);
        
        // Check if code exists and is not expired
        if (!user.email_code || !user.email_code_expires_at) {
          throw new AuthenticationError("No active email code");
        }

        if (this.cryptoService.isEmailCodeExpired(new Date(user.email_code_expires_at))) {
          throw new AuthenticationError("Email code expired");
        }
      } catch (error) {
        // User validation failed, but we already incremented attempts
        throw error;
      }
    }

    if (!isValidCode || !userExists) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Reset attempts only on successful authentication
    await this.userRepository.resetFailedAttempts(user.id);

    const timestamp = Math.floor(Date.now() / 1000);
    let token: string;

    if (existingToken) {
      try {
        token = this.tokenService.updateTokenWithMethod(existingToken, "email", timestamp);
      } catch (error) {
        const payload = this.tokenService.createTokenPayload(user.id.toString(), "email", timestamp);
        token = this.tokenService.generateToken(payload);
      }
    } else {
      const payload = this.tokenService.createTokenPayload(user.id.toString(), "email", timestamp);
      token = this.tokenService.generateToken(payload);
    }

    return {
      token,
      user_id: user.id.toString(),
    };
  }
}
