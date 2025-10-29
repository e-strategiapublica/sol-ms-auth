import { generateToken, updateTokenWithMethod, type JWTPayload } from "../config/jwt";
import type { ITokenService } from "../interfaces/auth.interfaces";

// SRP: Responsabilidade única - gerenciar tokens
export class TokenService implements ITokenService {
  generateToken(payload: JWTPayload): string {
    return generateToken(payload);
  }

  updateTokenWithMethod(existingToken: string, method: string, timestamp: number): string {
    return updateTokenWithMethod(existingToken, method, timestamp);
  }

  createTokenPayload(userId: string, method: string, timestamp: number): JWTPayload {
    return {
      sub: userId,
      nbf: timestamp,
      methods: { [method]: timestamp },
    };
  }
}
