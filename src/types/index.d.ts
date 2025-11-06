import type { Pattern } from "typia/lib/tags";

export interface ICreateUserRequest {
  email: string;
  password: string;
}

export interface IUpdateUserRequest {
  email?: string;
  password?: string;
}

export interface IGetUsersQueryParams {
  email?: string;
}

export interface IGetUserPathParams {
  id: (string & Pattern<"^[0-9]+$">) | number;
}
