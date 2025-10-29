import { comparePassword, generateEmailCode, isEmailCodeExpired } from "../utils/crypto";
import type { ICryptoService } from "../interfaces/auth.interfaces";

// SRP: Responsabilidade única - operações criptográficas
export class CryptoService implements ICryptoService {
  comparePassword(password: string, hash: string): boolean {
    return comparePassword(password, hash);
  }

  generateEmailCode(): string {
    return generateEmailCode();
  }

  isEmailCodeExpired(expiresAt: Date): boolean {
    return isEmailCodeExpired(expiresAt);
  }
}
