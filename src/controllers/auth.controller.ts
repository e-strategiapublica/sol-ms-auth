import type { Request, Response } from "express";
import { createAuthService } from "../services/auth.service";
import { ErrorHandler } from "../handlers/error.handler";

const authService = createAuthService();

class AuthController {
  async authenticateWithEmail(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, params } = req.body;
      const { code } = params;

      const existingToken = req.headers.authorization?.replace("Bearer ", "");
      const result = await authService.authenticateWithEmail(identifier, code, existingToken);

      res.set("Link", `</users/${result.user_id}>; rel="related"`);
      res.status(200).json({ token: result.token });
    } catch (error) {
      ErrorHandler.handleAuthError(error, res, req);
    }
  }

  async sendEmailCode(req: Request, res: Response): Promise<void> {
    try {
      const { identifier } = req.body;

      await authService.sendEmailAuthCode(identifier);

      res.status(200).json({
        message: "Email code sent successfully",
      });
    } catch (error) {
      ErrorHandler.handleEmailSendError(error, res, req);
    }
  }

  async authenticateWithPassword(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, params } = req.body;
      const { password } = params;

      const existingToken = req.headers.authorization?.replace("Bearer ", "");
      const result = await authService.authenticateWithPassword(identifier, password, existingToken);

      res.set("Link", `</users/${result.user_id}>; rel="related"`);
      res.status(200).json({ token: result.token });
    } catch (error) {
      ErrorHandler.handleAuthError(error, res, req);
    }
  }
}

// Instância singleton para exportação
const authController = new AuthController();

export default {
  authenticateWithEmail: authController.authenticateWithEmail.bind(authController),
  sendEmailCode: authController.sendEmailCode.bind(authController),
  authenticateWithPassword: authController.authenticateWithPassword.bind(authController),
};