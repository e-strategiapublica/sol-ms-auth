import type { Request, Response } from "express";
import userService from "../services/user.service.js";
import type { UserUpdate } from "../types/database.js";
import type {
  IDeleteUserPathParams,
  IGetUserPathParams,
  IGetUsersQueryParams,
  IUpdateUserPathParams,
} from "../types/index.d.js";
import { cryptPassword } from "../utils/index.js";
import {
  ValidateBody,
  ValidateParams,
  ValidateQuery,
} from "../decorators/validation.js";
import {
  CreateUserBodyValidator,
  DeleteUserPathParamsValidator,
  GetUserPathParamsValidator,
  GetUsersQueryParamsValidator,
  UpdateUserBodyValidator,
  UpdateUserParamsValidator,
} from "../validators/userControllerValidators.js";

export class UserController {
  @ValidateParams(GetUserPathParamsValidator)
  public async getUserById(req: Request<IGetUserPathParams>, res: Response) {
    const user = await userService.getUserById(req.params.id as number);
    if (!user) throw new Error("User not found");
    res.status(200).json(user);
  }

  @ValidateBody(CreateUserBodyValidator)
  public async createUser(req: Request, res: Response) {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  }

  @ValidateQuery(GetUsersQueryParamsValidator)
  public async getUsers(req: Request<IGetUsersQueryParams>, res: Response) {
    const users = await userService.getUsers(req.query);
    res.status(200).json(users);
  }

  @ValidateBody(UpdateUserBodyValidator)
  @ValidateParams(UpdateUserParamsValidator)
  public async updateUser(req: Request<IUpdateUserPathParams>, res: Response) {
    const id = Number(req.params.id);
    const userData: UserUpdate & { password?: string } = { ...req.body };
    if (userData.password) {
      userData.password_hash = await cryptPassword(userData.password);
      delete userData.password;
    }
    const updatedUser = await userService.updateUser(id, userData);
    res.status(200).json(updatedUser);
  }

  @ValidateParams(DeleteUserPathParamsValidator)
  public async deleteUser(req: Request<IDeleteUserPathParams>, res: Response) {
    const id = Number(req.params.id);
    await userService.deleteUser(id);
    res.status(204).send();
  }
}
