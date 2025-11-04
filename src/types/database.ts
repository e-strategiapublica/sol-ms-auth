import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  user: UserTable;
}

export interface UserTable {
  id: Generated<number>;
  email: string;
  name?: string;
  password_hash?: string;
  password_salt?: string;
  email_code?: string;
  email_code_expires_at?: ColumnType<Date, string | undefined, string | undefined>;
  failed_login_attempts: ColumnType<number, number | undefined, number>;
  is_blocked: ColumnType<boolean, boolean | undefined, boolean>;
  last_login_at?: ColumnType<Date, string | undefined, string | undefined>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
