import type { Request } from "express";

export interface ISecurityLogger {
  logFailedAuth(ip: string, email: string, reason: string): void;
  logSuspiciousActivity(ip: string, activity: string): void;
  logRateLimitExceeded(ip: string, endpoint: string): void;
}

export class SecurityLoggerService implements ISecurityLogger {
  logFailedAuth(ip: string, email: string, reason: string): void {
    const timestamp = new Date().toISOString();
    console.warn(`[SECURITY] ${timestamp} Failed auth attempt from ${ip} for ${this.maskEmail(email)}: ${reason}`);
  }

  logSuspiciousActivity(ip: string, activity: string): void {
    const timestamp = new Date().toISOString();
    console.error(`[SECURITY] ${timestamp} Suspicious activity from ${ip}: ${activity}`);
  }

  logRateLimitExceeded(ip: string, endpoint: string): void {
    const timestamp = new Date().toISOString();
    console.warn(`[SECURITY] ${timestamp} Rate limit exceeded from ${ip} on ${endpoint}`);
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return '***@***.***';
    
    const maskedLocal = local.length > 2 
      ? `${local[0]}***${local[local.length - 1]}`
      : '***';
    
    return `${maskedLocal}@${domain}`;
  }

  static getClientIP(req: Request): string {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0] 
      || req.connection.remoteAddress 
      || req.socket.remoteAddress 
      || 'unknown';
  }
}
