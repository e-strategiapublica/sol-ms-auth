import { db } from "../config/db";
import type { User, NewUser, UserUpdate } from "../types/database";

const findAll = async (): Promise<User[]> => {
  return await db.selectFrom("user").selectAll().execute();
};

const findByEmail = async (email: string): Promise<User | undefined> => {
  return await db
    .selectFrom("user")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
};

const findById = async (id: number): Promise<User | undefined> => {
  return await db
    .selectFrom("user")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
};

const create = async (user: NewUser): Promise<User> => {
  return await db
    .insertInto("user")
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow();
};

const update = async (id: number, updates: UserUpdate): Promise<User | undefined> => {
  return await db
    .updateTable("user")
    .set({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

const updateEmailCode = async (
  email: string,
  code: string,
  expiresAt: Date
): Promise<void> => {
  await db
    .updateTable("user")
    .set({
      email_code: code,
      email_code_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .where("email", "=", email)
    .execute();
};

const updatePassword = async (
  id: number,
  passwordHash: string,
  passwordSalt: string
): Promise<void> => {
  await db
    .updateTable("user")
    .set({
      password_hash: passwordHash,
      password_salt: passwordSalt,
      updated_at: new Date().toISOString(),
    })
    .where("id", "=", id)
    .execute();
};

const incrementFailedAttempts = async (id: number): Promise<void> => {
  await db
    .updateTable("user")
    .set((eb) => ({
      failed_login_attempts: eb("failed_login_attempts", "+", 1),
      updated_at: new Date().toISOString(),
    }))
    .where("id", "=", id)
    .execute();
};

const resetFailedAttempts = async (id: number): Promise<void> => {
  await db
    .updateTable("user")
    .set({
      failed_login_attempts: 0,
      last_login_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .where("id", "=", id)
    .execute();
};

const userRepository = {
  findAll,
  findByEmail,
  findById,
  create,
  update,
  updateEmailCode,
  updatePassword,
  incrementFailedAttempts,
  resetFailedAttempts,
};

export default userRepository;
