import type { 
  IAuthenticationStrategy, 
  IUserRepository, 
  ITokenService, 
  ICryptoService, 
  IUserValidator 
} from "../interfaces/auth.interfaces";
import type { AuthResponse } from "../types/auth";

export class EmailAuthStrategy implements IAuthenticationStrategy {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
    private cryptoService: ICryptoService,
    private userValidator: IUserValidator
  ) {}

  async authenticate(identifier: string, params: any, existingToken?: string): Promise<AuthResponse> {
    const { code } = params;
    const user = await this.userRepository.findByEmail(identifier);
    
    this.userValidator.validateUserAccess(user);
    this.userValidator.validateEmailCode(user, code);

    if (this.cryptoService.isEmailCodeExpired(new Date(user.email_code_expires_at))) {
      throw new Error("Email code expired");
    }

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
