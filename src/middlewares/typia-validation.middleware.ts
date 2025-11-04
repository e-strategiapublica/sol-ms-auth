import type { Request, Response, NextFunction } from "express";

// Use manual validation in development (tsx compatibility)
// Production build will use Typia with proper transformers
const isDevelopment = process.env.NODE_ENV === "development";

let validateEmailAuth: any;
let validatePasswordAuth: any; 
let validateEmailSend: any;
let EmailAuthRequest: any;
let PasswordAuthRequest: any;
let EmailSendRequest: any;

if (isDevelopment) {
  const manualValidation = require("../types/manual-validation");
  validateEmailAuth = manualValidation.validateEmailAuth;
  validatePasswordAuth = manualValidation.validatePasswordAuth;
  validateEmailSend = manualValidation.validateEmailSend;
  EmailAuthRequest = manualValidation.EmailAuthRequest;
  PasswordAuthRequest = manualValidation.PasswordAuthRequest;
  EmailSendRequest = manualValidation.EmailSendRequest;
} else {
  const typiaValidation = require("../types/validation");
  validateEmailAuth = typiaValidation.validateEmailAuth;
  validatePasswordAuth = typiaValidation.validatePasswordAuth;
  validateEmailSend = typiaValidation.validateEmailSend;
  EmailAuthRequest = typiaValidation.EmailAuthRequest;
  PasswordAuthRequest = typiaValidation.PasswordAuthRequest;
  EmailSendRequest = typiaValidation.EmailSendRequest;
}

export interface IValidationMiddleware {
  validateEmailAuth(req: Request, res: Response, next: NextFunction): void;
  validatePasswordAuth(req: Request, res: Response, next: NextFunction): void;
  validateEmailSend(req: Request, res: Response, next: NextFunction): void;
}

export interface ISecurityLogger {
  logValidationError(ip: string, endpoint: string, errors: string[]): void;
}

export class TypiaValidationMiddleware implements IValidationMiddleware {
  constructor(private securityLogger?: ISecurityLogger) {}

  validateEmailAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = validateEmailAuth(req.body);
      
      if (!result.success) {
        const errors = this.formatValidationErrors(result.errors);
        
        if (this.securityLogger) {
          this.securityLogger.logValidationError(
            req.ip || 'unknown', 
            '/method/email', 
            errors
          );
        }
        
        res.status(400).json({
          error: "Invalid request format",
          message: "Please check your request data"
        });
        return;
      }

      // Sanitize and attach validated data
      req.body = this.sanitizeEmailAuthRequest(result.data);
      next();
    } catch (error) {
      if (this.securityLogger) {
        this.securityLogger.logValidationError(
          req.ip || 'unknown', 
          '/method/email', 
          ['Validation error: ' + (error as Error).message]
        );
      }
      
      res.status(400).json({
        error: "Invalid request format",
        message: "Please check your request data"
      });
    }
  };

  validatePasswordAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = validatePasswordAuth(req.body);
      
      if (!result.success) {
        const errors = this.formatValidationErrors(result.errors);
        
        if (this.securityLogger) {
          this.securityLogger.logValidationError(
            req.ip || 'unknown', 
            '/method/pass', 
            errors
          );
        }
        
        res.status(400).json({
          error: "Invalid request format",
          message: "Please check your request data"
        });
        return;
      }

      // Sanitize and attach validated data
      req.body = this.sanitizePasswordAuthRequest(result.data);
      next();
    } catch (error) {
      if (this.securityLogger) {
        this.securityLogger.logValidationError(
          req.ip || 'unknown', 
          '/method/pass', 
          ['Validation error: ' + (error as Error).message]
        );
      }
      
      res.status(400).json({
        error: "Invalid request format",
        message: "Please check your request data"
      });
    }
  };

  validateEmailSend = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = validateEmailSend(req.body);
      
      if (!result.success) {
        const errors = this.formatValidationErrors(result.errors);
        
        if (this.securityLogger) {
          this.securityLogger.logValidationError(
            req.ip || 'unknown', 
            '/method/email/send', 
            errors
          );
        }
        
        res.status(400).json({
          error: "Invalid request format",
          message: "Please check your request data"
        });
        return;
      }

      // Sanitize and attach validated data
      req.body = this.sanitizeEmailSendRequest(result.data);
      next();
    } catch (error) {
      if (this.securityLogger) {
        this.securityLogger.logValidationError(
          req.ip || 'unknown', 
          '/method/email/send', 
          ['Validation error: ' + (error as Error).message]
        );
      }
      
      res.status(400).json({
        error: "Invalid request format",
        message: "Please check your request data"
      });
    }
  };

  private formatValidationErrors(errors: any[]): string[] {
    if (!Array.isArray(errors)) {
      return ['Validation failed'];
    }
    
    return errors.map(error => {
      if (typeof error === 'string') return error;
      
      if (error && typeof error === 'object') {
        if (error.path && error.message) {
          return `${error.path}: ${error.message}`;
        }
        if (error.message) {
          return error.message;
        }
        if (error.expected && error.value !== undefined) {
          return `Expected ${error.expected}, got ${typeof error.value}`;
        }
      }
      
      return 'Unknown validation error';
    });
  }

  private sanitizeEmailAuthRequest(data: any): any {
    const sanitizedCode = data.params.code.replace(/[^0-9]/g, '');
    
    return {
      identifier: data.identifier.toLowerCase().trim(),
      params: {
        code: sanitizedCode.length === 6 ? sanitizedCode : sanitizedCode.slice(0, 6)
      }
    };
  }

  private sanitizePasswordAuthRequest(data: any): any {
    const sanitizedPassword = data.params.password.slice(0, 128);
    
    return {
      identifier: data.identifier.toLowerCase().trim(),
      params: {
        password: sanitizedPassword.length >= 8 ? sanitizedPassword : sanitizedPassword
      }
    };
  }

  private sanitizeEmailSendRequest(data: any): any {
    return {
      identifier: data.identifier.toLowerCase().trim()
    };
  }
}

// Factory for dependency injection
export const createTypiaValidationMiddleware = (securityLogger?: ISecurityLogger): TypiaValidationMiddleware => {
  return new TypiaValidationMiddleware(securityLogger);
};

// Default instance for compatibility
const defaultMiddleware = createTypiaValidationMiddleware();

export default {
  validateEmailAuth: defaultMiddleware.validateEmailAuth,
  validatePasswordAuth: defaultMiddleware.validatePasswordAuth,
  validateEmailSend: defaultMiddleware.validateEmailSend,
};
