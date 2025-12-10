import { db } from "../config/db";
import type { User, NewUser, UserUpdate } from "../types/database";
import type { IGetUsersQueryParams } from "../types/index";

// ===============================
// FIND FUNCTIONS
// ===============================

export const findAll = async (filter?: IGetUsersQueryParams): Promise<User[]> => {
  const page = Number(filter?.page ?? 1);
  const limit = Math.min(Number(filter?.limit ?? 20), 100);
  const offset = (page - 1) * limit;

  let query = db
    .selectFrom("user")
    .selectAll()
    .where("deleted_at", "is", null);

  if (filter?.email) {
    query = query.where("email", "=", filter.email);
  }

  return await query.limit(limit).offset(offset).execute();
};

export const findByEmail = async (email: string): Promise<User | undefined> => {
  return await db
    .selectFrom("user")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
};

export const findById = async (id: number): Promise<User | undefined> => {
  return await db
    .selectFrom("user")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
};

// ===============================
// CREATE
// ===============================

export const create = async (user: NewUser): Promise<User> => {
  return await db
    .insertInto("user")
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow();
};

// ===============================
// UPDATE FUNCTIONS
// ===============================

export const update = async (id: number, updates: UserUpdate): Promise<User | undefined> => {
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

export const updateEmailCode = async (
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

export const updatePassword = async (
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

// ===============================
// FAILED LOGIN ATTEMPTS
// ===============================

export const incrementFailedAttempts = async (id: number): Promise<void> => {
  await db
    .updateTable("user")
    .set((eb) => ({
      failed_login_attempts: eb("failed_login_attempts", "+", 1),
      updated_at: new Date().toISOString(),
    }))
    .where("id", "=", id)
    .execute();
};

export const resetFailedAttempts = async (id: number): Promise<void> => {
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

// ===============================
// DELETE (hard delete)
// ===============================

export const remove = async (id: number): Promise<void> => {
  await db.deleteFrom("user").where("id", "=", id).execute();
};
