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
  email_verified?: boolean;
  password_hash: string;
  is_active?: boolean;
  is_locked?: boolean;
  failed_login_attempts?: number;
  last_login_ip?: string;
  recovery_code: string | null;
  last_login_at: ColumnType<Date, string | undefined, never>;
  last_password_change_at: ColumnType<Date, string | undefined, never>;
  recovery_code_expires_at: ColumnType<Date, string | undefined, never>;
  deleted_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
