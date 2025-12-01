import { db } from "../config/db.js";
import type { NewUser, UserUpdate } from "../types/database.js";
import type { IGetUsersQueryParams } from "../types/index.js";

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

export const findAll = async (filter: IGetUsersQueryParams) => {
  const page = (filter.page as number) || 1;
  const limit = Math.min((filter.limit as number) || 20, 100); // Máximo 100
  const offset = (page - 1) * limit;
  let query = db.selectFrom("user").selectAll().where("deleted_at", "is", null);
  if (filter.email) {
    query = query.where("email", "=", filter.email);
  }
  return await query.limit(limit).offset(offset).execute();
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
