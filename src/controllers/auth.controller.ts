import type { Request, Response } from "express";
import authService from "../services/auth.service";
import type { AuthRequest, EmailSendRequest, EmailAuthParams, PasswordAuthParams } from "../types/auth";

const authenticateWithEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, params }: AuthRequest = req.body;
    const { code }: EmailAuthParams = params;

    const existingToken = req.headers.authorization?.replace("Bearer ", "");
    const result = await authService.authenticateWithEmail(identifier, code, existingToken);

    res.set("Link", `</users/${result.user_id}>; rel="related"`);
    res.status(200).json({ token: result.token });
  } catch (error) {
    if (error instanceof authService.UserNotFoundError) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
        statusCode: 401,
      });
    } else if (error instanceof authService.AuthenticationError) {
      res.status(401).json({
        error: "Unauthorized",
        message: error.message,
        statusCode: 401,
      });
    } else {
      console.error("Authentication error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
        statusCode: 500,
      });
    }
  }
};

const sendEmailCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier }: EmailSendRequest = req.body;

    await authService.sendEmailAuthCode(identifier);

    res.status(200).json({
      message: "Email code sent successfully",
    });
  } catch (error) {
    if (error instanceof authService.UserNotFoundError) {
      res.status(404).json({
        error: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    } else if (error instanceof authService.AuthenticationError) {
      res.status(401).json({
        error: "Unauthorized",
        message: error.message,
        statusCode: 401,
      });
    } else {
      console.error("Send email code error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to send email code",
        statusCode: 500,
      });
    }
  }
};

const authenticateWithPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, params }: AuthRequest = req.body;
    const { password }: PasswordAuthParams = params;

    const existingToken = req.headers.authorization?.replace("Bearer ", "");
    const result = await authService.authenticateWithPassword(identifier, password, existingToken);

    res.set("Link", `</users/${result.user_id}>; rel="related"`);
    res.status(200).json({ token: result.token });
  } catch (error) {
    if (error instanceof authService.UserNotFoundError) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
        statusCode: 401,
      });
    } else if (error instanceof authService.AuthenticationError) {
      res.status(401).json({
        error: "Unauthorized",
        message: error.message,
        statusCode: 401,
      });
    } else {
      console.error("Password authentication error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
        statusCode: 500,
      });
    }
  }
};

const authController = {
  authenticateWithEmail,
  sendEmailCode,
  authenticateWithPassword,
};

export default authController;