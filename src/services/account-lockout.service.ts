export interface IAccountLockoutService {
  calculateLockoutDuration(attempts: number): number;
  isAccountLocked(attempts: number, lastAttempt?: Date): boolean;
  shouldBlockUser(attempts: number): boolean;
  getRemainingLockoutTime(attempts: number, lastAttempt?: Date): number;
}

export class AccountLockoutService implements IAccountLockoutService {
  private static readonly LOCKOUT_DURATIONS = [
    5 * 60 * 1000,      // 5 minutes after 5 attempts
    15 * 60 * 1000,     // 15 minutes after 10 attempts  
    60 * 60 * 1000,     // 1 hour after 15 attempts
    6 * 60 * 60 * 1000, // 6 hours after 20 attempts
    24 * 60 * 60 * 1000 // 24 hours after 25+ attempts
  ];

  private static readonly ATTEMPT_THRESHOLDS = [5, 10, 15, 20, 25];

  calculateLockoutDuration(attempts: number): number {
    const thresholds = AccountLockoutService.ATTEMPT_THRESHOLDS;
    const durations = AccountLockoutService.LOCKOUT_DURATIONS;
    
    if (attempts < thresholds[0]!) {
      return 0; // No lockout
    }

    // Find the appropriate lockout duration based on attempts
    let index = 0;
    for (let i = 0; i < thresholds.length; i++) {
      if (attempts >= thresholds[i]!) {
        index = i;
      } else {
        break;
      }
    }

    return durations[index] || durations[durations.length - 1]!;
  }

  isAccountLocked(attempts: number, lastAttempt?: Date): boolean {
    const thresholds = AccountLockoutService.ATTEMPT_THRESHOLDS;
    
    if (attempts < thresholds[0]!) {
      return false;
    }

    if (!lastAttempt) {
      return false;
    }

    const lockoutDuration = this.calculateLockoutDuration(attempts);
    const lockoutExpiry = new Date(lastAttempt.getTime() + lockoutDuration);
    
    return new Date() < lockoutExpiry;
  }

  shouldBlockUser(attempts: number): boolean {
    // Permanently block after excessive attempts (configurable)
    const PERMANENT_BLOCK_THRESHOLD = 50;
    return attempts >= PERMANENT_BLOCK_THRESHOLD;
  }

  getRemainingLockoutTime(attempts: number, lastAttempt?: Date): number {
    if (!this.isAccountLocked(attempts, lastAttempt) || !lastAttempt) {
      return 0;
    }

    const lockoutDuration = this.calculateLockoutDuration(attempts);
    const lockoutExpiry = new Date(lastAttempt.getTime() + lockoutDuration);
    
    return Math.max(0, lockoutExpiry.getTime() - Date.now());
  }
}
