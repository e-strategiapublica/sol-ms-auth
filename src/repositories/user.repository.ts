import { db } from "../config/db";

const findAll = async () => {
  return await db.selectFrom("user").selectAll().execute();
};

const userRepository = { findAll };

export default userRepository;
