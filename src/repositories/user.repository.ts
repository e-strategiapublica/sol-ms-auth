import { db } from "../config/db";
import type { NewUser, UserUpdate } from "../types/database";

export const create = async (userData: NewUser) => {
  const result = await db
    .insertInto("user")
    .values(userData)
    .returningAll()
    .executeTakeFirst();
  return result;
};

export const findById = async (id: number) => {
  return await db
    .selectFrom("user")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
};

export const findAll = async () => {
  return await db.selectFrom("user").selectAll().execute();
};

export const update = async (id: number, userData: Partial<UserUpdate>) => {
  const result = await db
    .updateTable("user")
    .set(userData)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
  return result;
};

export const remove = async (id: number) => {
  await db.deleteFrom("user").where("id", "=", id).execute();
};
