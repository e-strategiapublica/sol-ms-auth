import type { IValidation } from "typia";

export class ValidationError extends Error {
  errors: IValidation.IError[];
  constructor(errors: IValidation.IError[]) {
    super();
    this.errors = errors;
  }
}
