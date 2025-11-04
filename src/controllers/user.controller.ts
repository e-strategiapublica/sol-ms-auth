import type { Request, Response } from "express";
import userService from "../services/user.service";
const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.status(200).json(users);
};

export default { getUsers };
