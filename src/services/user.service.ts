import * as userRepository from "../repositories/user.repository";
import type { NewUser, UserUpdate } from "../types/database";

const createUser = async (userData: NewUser) => {
  const newUser = await userRepository.create(userData);
  return newUser;
};

const getUserById = async (id: number) => {
  const user = await userRepository.findById(id);
  return user;
};

const getUsers = async () => {
  const users = await userRepository.findAll();
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
