import userRepository from "../repositories/user.repository";
import type { IUserRepository } from "../interfaces/auth.interfaces";

export class UserRepositoryAdapter implements IUserRepository {
  async findByEmail(email: string): Promise<any> {
    return await userRepository.findByEmail(email);
  }

  async resetFailedAttempts(userId: number): Promise<void> {
    await userRepository.resetFailedAttempts(userId);
  }

  async incrementFailedAttempts(userId: number): Promise<void> {
    await userRepository.incrementFailedAttempts(userId);
  }

  async updateEmailCode(email: string, code: string, expiresAt: Date): Promise<void> {
    await userRepository.updateEmailCode(email, code, expiresAt);
  }
}
