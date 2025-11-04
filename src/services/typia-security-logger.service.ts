import type { ISecurityLogger } from "../middlewares/typia-validation.middleware";

export class TypiaSecurityLoggerService implements ISecurityLogger {
  logValidationError(ip: string, endpoint: string, errors: string[]): void {
    const timestamp = new Date().toISOString();
    const maskedIp = this.maskIpAddress(ip);
    const errorSummary = errors.slice(0, 3).join(", ");
    
    console.log(`[SECURITY] ${timestamp} Validation failed from ${maskedIp} on ${endpoint}: ${errorSummary}`);
    
    // Log detailed errors in development (but mask sensitive data)
    if (process.env.NODE_ENV === "development") {
      const sanitizedErrors = this.sanitizeErrorsForLogging(errors);
      console.log(`[DEBUG] Validation errors:`, sanitizedErrors);
    }
  }

  private sanitizeErrorsForLogging(errors: string[]): string[] {
    return errors.map(error => {
      // Remove potential sensitive data from error messages
      return error
        .replace(/password.*?:/gi, 'password: [HIDDEN]')
        .replace(/\b[\w._%+-]+@[\w.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
        .replace(/\b\d{6}\b/g, '[CODE]');
    });
  }

  private maskIpAddress(ip: string): string {
    if (ip === "unknown" || ip === "::1" || ip === "127.0.0.1") {
      return ip;
    }
    
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***.`;
    }
    
    // IPv6 masking
    if (ip.includes(":")) {
      const parts = ip.split(":");
      return `${parts[0]}:${parts[1]}:***:***`;
    }
    
    return "***";
  }
}

// Factory for dependency injection
export const createTypiaSecurityLogger = (): TypiaSecurityLoggerService => {
  return new TypiaSecurityLoggerService();
};
