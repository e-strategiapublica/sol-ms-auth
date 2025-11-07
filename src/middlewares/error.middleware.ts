import type { ErrorRequestHandler } from "express";
import { TypeGuardError } from "typia";
import { ValidationError } from "../types/errors.js";

export const ErrorHandlingMiddleware: ErrorRequestHandler = (
  originalErr: Error,
  req,
  res,
  next
) => {
  let err = originalErr;
  console.log(err, err instanceof ValidationError);
  if (err instanceof TypeGuardError) {
    const { expected, value, path } = err;
    err = new ValidationError([{ expected, value, path: path || "" }]);
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: "ValidationError",
      details: err.errors,
    });
  }

  return res.status(400).json({ error: "Error", message: err.message });
};
