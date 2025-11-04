import type { Request, Response, NextFunction } from "express";

// Simple email validation utility (avoiding external dependency)
const emailValidator = {
  isEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  },
  
  normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
};

export interface IInputSanitizer {
  sanitizeEmail(email: string): string;
  sanitizeCode(code: string): string;
  sanitizePassword(password: string): string;
}

export class InputSanitizerService implements IInputSanitizer {
  sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email input');
    }

    // Normalize and sanitize email
    const trimmed = email.trim().toLowerCase();
    
    if (!emailValidator.isEmail(trimmed)) {
      throw new Error('Invalid email format');
    }

    // Additional length check
    if (trimmed.length > 254) {
      throw new Error('Email too long');
    }

    return emailValidator.normalizeEmail(trimmed);
  }

  sanitizeCode(code: string): string {
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid code input');
    }

    // Remove any non-numeric characters
    const sanitized = code.replace(/\D/g, '');
    
    if (sanitized.length !== 6) {
      throw new Error('Code must be exactly 6 digits');
    }

    return sanitized;
  }

  sanitizePassword(password: string): string {
    if (!password || typeof password !== 'string') {
      throw new Error('Invalid password input');
    }

    // Basic length validation
    if (password.length < 6 || password.length > 128) {
      throw new Error('Password must be between 6 and 128 characters');
    }

    // No sanitization for passwords to preserve original input
    return password;
  }
}

export class EnhancedValidationMiddleware {
  private sanitizer: IInputSanitizer;

  constructor(sanitizer?: IInputSanitizer) {
    this.sanitizer = sanitizer || new InputSanitizerService();
  }

  validateEmailAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { identifier, params } = req.body;

      // Validate required fields
      if (!identifier) {
        res.status(400).json({
          error: "Bad Request",
          message: "Missing required field: identifier",
          statusCode: 400,
        });
        return;
      }

      if (!params || !params.code) {
        res.status(400).json({
          error: "Bad Request",
          message: "Missing required field: params.code",
          statusCode: 400,
        });
        return;
      }

      // Sanitize and validate inputs
      const sanitizedEmail = this.sanitizer.sanitizeEmail(identifier);
      const sanitizedCode = this.sanitizer.sanitizeCode(params.code);

      // Update request body with sanitized values
      req.body.identifier = sanitizedEmail;
      req.body.params.code = sanitizedCode;

      next();
    } catch (error) {
      res.status(400).json({
        error: "Bad Request",
        message: error instanceof Error ? error.message : "Invalid input",
        statusCode: 400,
      });
    }
  };

  validatePasswordAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { identifier, params } = req.body;

      // Validate required fields
      if (!identifier) {
        res.status(400).json({
          error: "Bad Request",
          message: "Missing required field: identifier",
          statusCode: 400,
        });
        return;
      }

      if (!params || !params.password) {
        res.status(400).json({
          error: "Bad Request",
          message: "Missing required field: params.password",
          statusCode: 400,
        });
        return;
      }

      // Sanitize and validate inputs
      const sanitizedEmail = this.sanitizer.sanitizeEmail(identifier);
      const sanitizedPassword = this.sanitizer.sanitizePassword(params.password);

      // Update request body with sanitized values
      req.body.identifier = sanitizedEmail;
      req.body.params.password = sanitizedPassword;

      next();
    } catch (error) {
      res.status(400).json({
        error: "Bad Request",
        message: error instanceof Error ? error.message : "Invalid input",
        statusCode: 400,
      });
    }
  };

  validateEmailSend = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { identifier } = req.body;

      // Validate required fields
      if (!identifier) {
        res.status(400).json({
          error: "Bad Request",
          message: "Missing required field: identifier",
          statusCode: 400,
        });
        return;
      }

      // Sanitize and validate email
      const sanitizedEmail = this.sanitizer.sanitizeEmail(identifier);

      // Update request body with sanitized value
      req.body.identifier = sanitizedEmail;

      next();
    } catch (error) {
      res.status(400).json({
        error: "Bad Request",
        message: error instanceof Error ? error.message : "Invalid input",
        statusCode: 400,
      });
    }
  };
}

// Singleton instance
const enhancedValidation = new EnhancedValidationMiddleware();

export const validateEmailAuthEnhanced = enhancedValidation.validateEmailAuth;
export const validatePasswordAuthEnhanced = enhancedValidation.validatePasswordAuth;
export const validateEmailSendEnhanced = enhancedValidation.validateEmailSend;
