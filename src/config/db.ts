import type { Database } from "../types/database";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DB_NAME || "sol_ms_auth",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "changeme",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
