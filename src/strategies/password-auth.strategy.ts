import type { 
  IAuthenticationStrategy, 
  IUserRepository, 
  ITokenService, 
  ICryptoService, 
  IUserValidator 
} from "../interfaces/auth.interfaces";
import type { AuthResponse } from "../types/auth";
import { AuthenticationError } from "../services/user-validator.service";

export class PasswordAuthStrategy implements IAuthenticationStrategy {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
    private cryptoService: ICryptoService,
    private userValidator: IUserValidator
  ) {}

  async authenticate(identifier: string, params: any, existingToken?: string): Promise<AuthResponse> {
    const { password } = params;
    const user = await this.userRepository.findByEmail(identifier);
    
    this.userValidator.validateUserAccess(user);
    this.userValidator.validatePassword(user);
    this.userValidator.validatePasswordAttempts(user);

    const isValidPassword = this.cryptoService.comparePassword(password, user.password_hash);
    
    if (!isValidPassword) {
      await this.userRepository.incrementFailedAttempts(user.id);
      throw new AuthenticationError("Invalid password");
    }

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
