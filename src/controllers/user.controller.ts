import type { Request, Response } from "express";
import userService from "../services/user.service";
import type { NewUser } from "../types/database";

export const createUser = async (req: Request, res: Response) => {
  const userData: NewUser = req.body;
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
