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
