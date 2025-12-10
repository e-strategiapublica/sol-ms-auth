import type { Request, Response } from "express";
import { AuthenticationError, UserNotFoundError } from "../services/user-validator.service";
import { SecurityLoggerService } from "../services/security-logger.service";

export class ErrorHandler {
  private static securityLogger = new SecurityLoggerService();

  static handleAuthError(error: unknown, res: Response, req?: Request): void {
    const clientIP = req ? SecurityLoggerService.getClientIP(req) : 'unknown';
    
    if (error instanceof UserNotFoundError || error instanceof AuthenticationError) {
      // Log security event
      if (req?.body?.identifier) {
        this.securityLogger.logFailedAuth(clientIP, req.body.identifier, error.message);
      }
      
      // Always return same generic message to prevent user enumeration
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
        statusCode: 401,
      });
    } else {
      console.error("Authentication error:", error);
      this.securityLogger.logSuspiciousActivity(clientIP, `Unexpected auth error: ${error}`);
      
      res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
        statusCode: 500,
      });
    }
  }

  static handleEmailSendError(error: unknown, res: Response, req?: Request): void {
    const clientIP = req ? SecurityLoggerService.getClientIP(req) : 'unknown';
    
    // SECURITY: Always return success to prevent user enumeration
    // Log actual error for monitoring but don't expose to client
    if (error instanceof UserNotFoundError) {
      if (req?.body?.identifier) {
        this.securityLogger.logFailedAuth(clientIP, req.body.identifier, "Email send attempt for non-existent user");
      }
    } else if (error instanceof AuthenticationError) {
      if (req?.body?.identifier) {
        this.securityLogger.logFailedAuth(clientIP, req.body.identifier, error.message);
      }
    } else {
      console.error("Send email code error:", error);
      this.securityLogger.logSuspiciousActivity(clientIP, `Email send error: ${error}`);
    }

    // Always return success response to prevent user enumeration
    res.status(200).json({
      message: "If the email exists in our system, a verification code has been sent",
    });
  }
}
