import type typia from "typia";
import type { Pattern } from "typia/lib/tags";

export interface ICreateUserRequest {
  email: string;
  password: string;
}

export interface IUpdateUserRequest {
  email?: string;
  password?: string;
}

export interface ValidationType {}

export interface IGetUsersQueryParams extends ValidationType {
  email?: string;
  page?: (string & Pattern<"^[0-9]+$">) | number;
  limit?: (string & Pattern<"^[0-9]+$">) | number;
}

export interface IGetUserPathParams {
  id: (string & Pattern<"^[0-9]+$">) | number;
}

export interface IUpdateUserPathParams {
  id: (string & Pattern<"^[0-9]+$">) | number;
}

export interface IDeleteUserPathParams {
  id: (string & Pattern<"^[0-9]+$">) | number;
}
