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
  let query = db.selectFrom("user").selectAll();
  for (const key of Object.keys(filter) as (keyof IGetUsersQueryParams)[]) {
    const value = filter[key];
    if (value !== undefined) {
      query = query.where(key, "=", value);
    }
  }
  return await query.execute();
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
