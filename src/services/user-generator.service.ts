import type { IUserGenerator } from "../interfaces/seed.interfaces.js";
import { generateSalt, hashPassword } from "../utils/crypto.js";

export class UserGeneratorService implements IUserGenerator {
  async generateTestUser(email: string, name: string, password: string): Promise<any> {
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    return {
      email,
      name,
      password_hash: passwordHash,
      password_salt: salt,
      failed_login_attempts: 0,
      is_blocked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}
