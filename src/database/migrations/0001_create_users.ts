import { Kysely, sql } from "kysely";
import type { Database } from "../../types/database";

export async function up(db: Kysely<Database>): Promise<void> {
  db.schema
    .createTable("user")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("email", "varchar", (col) => col.notNull().unique())
    .addColumn("email_verified", "boolean", (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn("password_hash", "varchar", (col) => col.notNull())
    .addColumn("is_active", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("is_locked", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("failed_login_attempts", "integer", (col) =>
      col.notNull().defaultTo(0)
    )
    .addColumn("last_login_ip", "varchar")
    .addColumn("last_login_at", "timestamp")
    .addColumn("recovery_code", "varchar")
    .addColumn("recovery_code_expires_at", "timestamp")
    .addColumn("last_password_change_at", "timestamp")
    .addColumn("deleted_at", "timestamp")
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  db.schema.dropTable("user").ifExists().execute();
}
