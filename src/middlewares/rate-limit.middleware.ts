import type { Request, Response, NextFunction } from "express";
import { SecurityLoggerService } from "../services/security-logger.service";

export interface IRateLimitService {
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean;
  getAttempts(key: string): number;
  reset(key: string): void;
  cleanup?(): void;
}

export class InMemoryRateLimitService implements IRateLimitService {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      // First attempt or window expired
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  getAttempts(key: string): number {
    const record = this.attempts.get(key);
    return record ? record.count : 0;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  // Cleanup expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

export class RateLimitMiddleware {
  private rateLimitService: IRateLimitService;
  private securityLogger: SecurityLoggerService;

  constructor(rateLimitService?: IRateLimitService) {
    this.rateLimitService = rateLimitService || new InMemoryRateLimitService();
    this.securityLogger = new SecurityLoggerService();

    // Cleanup expired entries every 5 minutes
    if (this.rateLimitService instanceof InMemoryRateLimitService) {
      setInterval(() => {
        this.rateLimitService.cleanup?.();
      }, 5 * 60 * 1000);
    }
  }

  createAuthLimiter(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const clientIP = SecurityLoggerService.getClientIP(req);
      const key = `auth:${clientIP}`;

      if (!this.rateLimitService.isAllowed(key, maxAttempts, windowMs)) {
        this.securityLogger.logRateLimitExceeded(clientIP, req.path);

        res.status(429).json({
          error: "Too Many Requests",
          message: "Too many authentication attempts. Please try again later.",
          statusCode: 429,
          retryAfter: Math.ceil(windowMs / 1000),
        });
        return;
      }

      next();
    };
  }

  createEmailLimiter(maxAttempts: number = 3, windowMs: number = 5 * 60 * 1000) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const clientIP = SecurityLoggerService.getClientIP(req);
      const email = req.body?.identifier;
      
      // Rate limit by IP and by email
      const ipKey = `email:ip:${clientIP}`;
      const emailKey = email ? `email:addr:${email}` : null;

      if (!this.rateLimitService.isAllowed(ipKey, maxAttempts, windowMs)) {
        this.securityLogger.logRateLimitExceeded(clientIP, `${req.path} (IP)`);
        
        res.status(429).json({
          error: "Too Many Requests",
          message: "Too many email requests from this IP. Please try again later.",
          statusCode: 429,
          retryAfter: Math.ceil(windowMs / 1000),
        });
        return;
      }

      if (emailKey && !this.rateLimitService.isAllowed(emailKey, maxAttempts, windowMs)) {
        this.securityLogger.logRateLimitExceeded(clientIP, `${req.path} (Email: ${email})`);
        
        res.status(429).json({
          error: "Too Many Requests", 
          message: "Too many email requests for this address. Please try again later.",
          statusCode: 429,
          retryAfter: Math.ceil(windowMs / 1000),
        });
        return;
      }

      next();
    };
  }
}

// Singleton instance
const rateLimitMiddleware = new RateLimitMiddleware();

export const authRateLimit = rateLimitMiddleware.createAuthLimiter();
export const emailRateLimit = rateLimitMiddleware.createEmailLimiter();
export const strictAuthRateLimit = rateLimitMiddleware.createAuthLimiter(3, 10 * 60 * 1000); // 3 attempts per 10 minutes
