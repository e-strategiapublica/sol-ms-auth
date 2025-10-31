import type { Request, Response } from "express";
import userService from "../services/user.service.js";
import type { NewUser } from "../types/database.js";
import bcrypt from "bcryptjs";
import typia from "typia";
import type { ICreateUserRequest } from "../types/index.d.js";

export const createUser = async (req: Request, res: Response) => {
  const validation = typia.validate<ICreateUserRequest>(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: validation.errors,
    });
  }
  const password_hash = await bcrypt.hash(validation.data.password, 10);
  const userData: NewUser = {
    email: validation.data.email,
    password_hash: password_hash,
  };

  const newUser = await userService.createUser(userData);
  res.status(201).json(newUser);
};

export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await userService.getUserById(id);
  res.status(200).json(user);
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.status(200).json(users);
};

export const updateUser = async (req: Request, res: Response) => {
  const userData = req.body;
  const id = Number(req.params.id);
  const updatedUser = await userService.updateUser(id, userData);
  res.status(200).json(updatedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await userService.deleteUser(id);
  res.status(204).send();
};
