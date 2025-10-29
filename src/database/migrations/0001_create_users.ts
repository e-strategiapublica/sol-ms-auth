import { Kysely, sql } from "kysely";
import type { Database } from "../../types/database";

export async function up(db: Kysely<Database>): Promise<void> {
  db.schema
    .createTable("user")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("email", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  db.schema.dropTable("user").ifExists().execute();
}
