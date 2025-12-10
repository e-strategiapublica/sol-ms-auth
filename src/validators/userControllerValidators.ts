import typia from "typia";
import type {
  ICreateUserRequest,
  IDeleteUserPathParams,
  IGetUserPathParams,
  IGetUsersQueryParams,
  IUpdateUserPathParams,
  IUpdateUserRequest,
} from "../types";

export const CreateUserBodyValidator =
  typia.createValidateEquals<ICreateUserRequest>();

export const GetUserPathParamsValidator =
  typia.createValidateEquals<IGetUserPathParams>();

export const GetUsersQueryParamsValidator =
  typia.createValidateEquals<IGetUsersQueryParams>();

export const UpdateUserBodyValidator =
  typia.createValidateEquals<IUpdateUserRequest>();

export const UpdateUserParamsValidator =
  typia.createValidateEquals<IUpdateUserPathParams>();

export const DeleteUserPathParamsValidator =
  typia.createValidateEquals<IDeleteUserPathParams>();
