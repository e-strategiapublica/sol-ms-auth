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

  // Identity
  email: string;
  name?: string;

  // Auth
  password_hash: string;
  password_salt?: string; // (main não tinha, mas é essencial para segurança)

  // Email verification
  email_verified?: boolean;
  email_code?: string;
  email_code_expires_at?: ColumnType<Date, string | undefined, string | undefined>;

  // Recovery
  recovery_code: string | null;
  recovery_code_expires_at: ColumnType<Date, string | undefined, never>;

  // Login control
  failed_login_attempts: ColumnType<number, number | undefined, number>;
  is_blocked: ColumnType<boolean, boolean | undefined, boolean>;
  is_locked?: boolean;
  last_login_at: ColumnType<Date, string | undefined, never>;
  last_login_ip?: string;
  last_password_change_at: ColumnType<Date, string | undefined, never>;

  // User status
  is_active?: boolean;
  deleted_at: ColumnType<Date, string | undefined, never>;

  // Timestamps
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
