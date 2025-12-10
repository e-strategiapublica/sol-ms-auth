import type { ICryptoService } from "../interfaces/auth.interfaces";

export interface ITimingSafeService {
  safeComparePassword(password: string, userHash: string | null, userExists: boolean): Promise<boolean>;
  safeCompareEmailCode(inputCode: string, storedCode: string | null, userExists: boolean): Promise<boolean>;
}

export class TimingSafeService implements ITimingSafeService {
  private readonly DUMMY_HASH = "$2b$12$dummyhashtopreventtimingattacksagainstnonexistentusers";
  private readonly DUMMY_CODE = "000000";

  constructor(private cryptoService: ICryptoService) {}

  async safeComparePassword(password: string, userHash: string | null, userExists: boolean): Promise<boolean> {
    // Always perform hash comparison to prevent timing attacks
    const hashToCompare = userExists && userHash ? userHash : this.DUMMY_HASH;
    const isValidPassword = this.cryptoService.comparePassword(password, hashToCompare);
    
    // Return false if user doesn't exist or password is invalid
    return userExists && isValidPassword;
  }

  async safeCompareEmailCode(inputCode: string, storedCode: string | null, userExists: boolean): Promise<boolean> {
    // Always perform string comparison to prevent timing attacks
    const codeToCompare = userExists && storedCode ? storedCode : this.DUMMY_CODE;
    const isValidCode = this.constantTimeStringCompare(inputCode, codeToCompare);
    
    // Return false if user doesn't exist or code is invalid
    return userExists && isValidCode;
  }

  private constantTimeStringCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}
