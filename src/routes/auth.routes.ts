import { Router } from "express";
import authController from "../controllers/auth.controller";
import { 
  validateEmailAuthEnhanced, 
  validatePasswordAuthEnhanced, 
  validateEmailSendEnhanced 
} from "../middlewares/enhanced-validation.middleware";
import { 
  authRateLimit, 
  emailRateLimit, 
  strictAuthRateLimit 
} from "../middlewares/rate-limit.middleware";

const authRouter = Router();

// POST /method/email - Authenticate with email code
authRouter.post("/method/email", 
  strictAuthRateLimit,           // Strict rate limiting for auth
  validateEmailAuthEnhanced,     // Enhanced validation & sanitization
  authController.authenticateWithEmail
);

// POST /method/email/send - Send email authentication code  
authRouter.post("/method/email/send",
  emailRateLimit,               // Email-specific rate limiting
  validateEmailSendEnhanced,    // Enhanced validation & sanitization
  authController.sendEmailCode
);

// POST /method/pass - Authenticate with password
authRouter.post("/method/pass",
  strictAuthRateLimit,          // Strict rate limiting for auth
  validatePasswordAuthEnhanced, // Enhanced validation & sanitization
  authController.authenticateWithPassword
);

export default authRouter;