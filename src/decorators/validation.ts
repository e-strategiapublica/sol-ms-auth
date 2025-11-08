import { type IValidation } from "typia";
import type { Request } from "express";
import { ValidationError } from "../types/errors.js";

export type ValidationFunction<T> = (input: unknown) => IValidation<T>;

type RequestPart = "body" | "query" | "params";
const createValidationDecorator = (part: RequestPart) => {
  return (validator: ValidationFunction<any>) => {
    return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) => {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        const req = args[0] as Request;
        const dataToValidate = req[part];
        const validation = validator(dataToValidate);
        if (!validation.success) {
          throw new ValidationError(validation.errors);
        }
        if (part !== "query") {
          req[part] = validation.data;
        }
        return originalMethod.apply(this, args);
      };

      return descriptor;
    };
  };
};

export const ValidateParams = createValidationDecorator("params");
export const ValidateBody = createValidationDecorator("body");
export const ValidateQuery = createValidationDecorator("query");
