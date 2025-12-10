import { Router } from "express";
import authController from "../controllers/auth.controller";
import { createTypiaValidationMiddleware } from "../middlewares/typia-validation.middleware";
import { createTypiaSecurityLogger } from "../services/typia-security-logger.service";
import { 
  emailRateLimit, 
  strictAuthRateLimit 
} from "../middlewares/rate-limit.middleware";

const authRouter = Router();

// Create validation middleware with security logging
const securityLogger = createTypiaSecurityLogger();
const typiaValidation = createTypiaValidationMiddleware(securityLogger);

// POST /method/email - Authenticate with email code
authRouter.post("/method/email", 
  strictAuthRateLimit,                    // Strict rate limiting for auth
  typiaValidation.validateEmailAuth,      // Typia validation & sanitization
  authController.authenticateWithEmail
);

// POST /method/email/send - Send email authentication code  
authRouter.post("/method/email/send",
  emailRateLimit,                        // Email-specific rate limiting
  typiaValidation.validateEmailSend,     // Typia validation & sanitization
  authController.sendEmailCode
);

// POST /method/pass - Authenticate with password
authRouter.post("/method/pass",
  strictAuthRateLimit,                   // Strict rate limiting for auth
  typiaValidation.validatePasswordAuth,  // Typia validation & sanitization
  authController.authenticateWithPassword
);

export default authRouter;