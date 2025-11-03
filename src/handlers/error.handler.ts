import type { Response } from "express";
import { AuthenticationError, UserNotFoundError } from "../services/user-validator.service";

export class ErrorHandler {
  static handleAuthError(error: unknown, res: Response): void {
    if (error instanceof UserNotFoundError) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
        statusCode: 401,
      });
    } else if (error instanceof AuthenticationError) {
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

  static handleEmailSendError(error: unknown, res: Response): void {
    if (error instanceof UserNotFoundError) {
      res.status(404).json({
        error: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    } else if (error instanceof AuthenticationError) {
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
}
