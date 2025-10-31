import type { Database } from "../types/database";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "sol_ms_auth",
    host: "localhost",
    user: "changeme",
    password: "changeme",
    port: 5432,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
