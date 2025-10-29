import { Router } from "express";
import authController from "../controllers/auth.controller";
import { validateEmailAuth, validatePasswordAuth, validateEmailSend } from "../middlewares/validation.middleware";

const authRouter = Router();

// POST /method/email - Authenticate with email code
authRouter.post("/method/email", validateEmailAuth, authController.authenticateWithEmail);

// POST /method/email/send - Send email authentication code
authRouter.post("/method/email/send", validateEmailSend, authController.sendEmailCode);

// POST /method/pass - Authenticate with password
authRouter.post("/method/pass", validatePasswordAuth, authController.authenticateWithPassword);

export default authRouter;