import userRepository from "../repositories/user.repository";

const getUsers = async () => {
  const users = await userRepository.findAll();
  return users;
};

const userService = { getUsers };

export default userService;
