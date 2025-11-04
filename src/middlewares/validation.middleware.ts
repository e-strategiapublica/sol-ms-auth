import type { Request, Response, NextFunction } from "express";

export const validateEmailAuth = (req: Request, res: Response, next: NextFunction): void => {
  const { identifier, params } = req.body;

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

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(identifier)) {
    res.status(400).json({
      error: "Bad Request",
      message: "Invalid email format",
      statusCode: 400,
    });
    return;
  }

  next();
};

export const validatePasswordAuth = (req: Request, res: Response, next: NextFunction): void => {
  const { identifier, params } = req.body;

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

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(identifier)) {
    res.status(400).json({
      error: "Bad Request",
      message: "Invalid email format",
      statusCode: 400,
    });
    return;
  }

  next();
};

export const validateEmailSend = (req: Request, res: Response, next: NextFunction): void => {
  const { identifier } = req.body;

  if (!identifier) {
    res.status(400).json({
      error: "Bad Request",
      message: "Missing required field: identifier",
      statusCode: 400,
    });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(identifier)) {
    res.status(400).json({
      error: "Bad Request",
      message: "Invalid email format",
      statusCode: 400,
    });
    return;
  }

  next();
};
