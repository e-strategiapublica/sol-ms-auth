import { Kysely, sql } from "kysely";
import type { Database } from "../../types/database";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable("user")
    .addColumn("name", "varchar")
    .addColumn("password_hash", "varchar")
    .addColumn("password_salt", "varchar")
    .addColumn("email_code", "varchar")
    .addColumn("email_code_expires_at", "timestamp")
    .addColumn("failed_login_attempts", "integer", (col) => col.defaultTo(0).notNull())
    .addColumn("is_blocked", "boolean", (col) => col.defaultTo(false).notNull())
    .addColumn("last_login_at", "timestamp")
    .addColumn("updated_at", "timestamp", (col) => 
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable("user")
    .dropColumn("name")
    .dropColumn("password_hash")
    .dropColumn("password_salt")
    .dropColumn("email_code")
    .dropColumn("email_code_expires_at")
    .dropColumn("failed_login_attempts")
    .dropColumn("is_blocked")
    .dropColumn("last_login_at")
    .dropColumn("updated_at")
    .execute();
}
