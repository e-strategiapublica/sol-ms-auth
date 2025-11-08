import "../config/env";
import * as path from "path";
import { Pool } from "pg";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from "kysely";
import type { Database } from "../types/database";
import { db } from "../config/db.js";

async function migrateToLatest() {
  console.log("Running migrations...");
  const arg = process.argv[2];

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  const directionToMigrate = arg !== "up" && arg !== "down" ? "up" : arg;

  const { error, results } =
    directionToMigrate === "up"
      ? await migrator.migrateToLatest()
      : await migrator.migrateDown();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
