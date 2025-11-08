import * as userRepository from "../repositories/user.repository.js";
import type { NewUser, UserUpdate } from "../types/database.js";
import type {
  ICreateUserRequest,
  IGetUsersQueryParams,
} from "../types/index.js";
import { cryptPassword } from "../utils/index.js";

const createUser = async (data: ICreateUserRequest) => {
  const password_hash = await cryptPassword(data.password);
  const userData: NewUser & { password?: string } = {
    ...data,
    password_hash: password_hash,
  };
  delete userData.password;
  const existingUser = await userRepository.findAll({ email: userData.email });
  if (existingUser.length > 0) {
    throw new Error("A user wih this email already exists");
  }
  const newUser = await userRepository.create(userData);
  return newUser;
};

const getUserById = async (id: number) => {
  const user = await userRepository.findById(id);
  return user;
};

const getUsers = async (filter: IGetUsersQueryParams) => {
  const users = await userRepository.findAll(filter);
  return users;
};

const updateUser = async (id: number, userData: Partial<UserUpdate>) => {
  const updatedUser = await userRepository.update(id, userData);
  return updatedUser;
};

const deleteUser = async (id: number) => {
  await userRepository.remove(id);
};

const userService = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default userService;
