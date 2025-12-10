import type { 
  IAuthenticationStrategy, 
  IUserRepository, 
  ITokenService, 
  ICryptoService, 
  IUserValidator,
  ITimingSafeService
} from "../interfaces/auth.interfaces";
import type { AuthResponse, PasswordAuthParams } from "../types/auth";
import { AuthenticationError } from "../services/user-validator.service";

export class PasswordAuthStrategy implements IAuthenticationStrategy<PasswordAuthParams> {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
    private cryptoService: ICryptoService,
    private userValidator: IUserValidator,
    private timingSafeService: ITimingSafeService
  ) {}

  async authenticate(identifier: string, params: PasswordAuthParams, existingToken?: string): Promise<AuthResponse> {
    const { password } = params;
    const user = await this.userRepository.findByEmail(identifier);
    const userExists = !!user;

    // Always increment attempts first to prevent bypass
    if (userExists) {
      await this.userRepository.incrementFailedAttempts(user.id);
    }

    // Perform timing-safe password comparison
    const isValidPassword = await this.timingSafeService.safeComparePassword(
      password, 
      user?.password_hash || null, 
      userExists
    );

    // Validate user access and password requirements only if user exists
    if (userExists) {
      try {
        this.userValidator.validateUserAccess(user);
        this.userValidator.validatePassword(user);
        this.userValidator.validatePasswordAttempts(user);
      } catch (error) {
        // User validation failed, but we already incremented attempts
        throw error;
      }
    }

    if (!isValidPassword || !userExists) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Reset attempts only on successful authentication
    await this.userRepository.resetFailedAttempts(user.id);

    const timestamp = Math.floor(Date.now() / 1000);
    let token: string;

    if (existingToken) {
      try {
        token = this.tokenService.updateTokenWithMethod(existingToken, "pass", timestamp);
      } catch (error) {
        const payload = this.tokenService.createTokenPayload(user.id.toString(), "pass", timestamp);
        token = this.tokenService.generateToken(payload);
      }
    } else {
      const payload = this.tokenService.createTokenPayload(user.id.toString(), "pass", timestamp);
      token = this.tokenService.generateToken(payload);
    }

    return {
      token,
      user_id: user.id.toString(),
    };
  }
}
