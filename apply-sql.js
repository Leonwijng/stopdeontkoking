#!/usr/bin/env npm run ts-node

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);
const DB_NAME = process.env.DB_NAME || "your_database_name";
const DB_USER = process.env.DB_USER || "your_username";

// The order in which SQL files should be applied
const SQL_FILES = [
  "users.sql",
  "migration_users.sql",
  "recipes.sql",
  "recipe_updates.sql",
];

async function applySQLFiles() {
  console.log("Applying SQL files to database...");

  for (const file of SQL_FILES) {
    const filePath = path.join(process.cwd(), "sql", file);

    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: SQL file ${file} not found, skipping.`);
      continue;
    }

    console.log(`Applying ${file}...`);
    try {
      const { stdout, stderr } = await execAsync(
        `psql -U ${DB_USER} -d ${DB_NAME} -f ${filePath}`
      );
      if (stderr && !stderr.includes("NOTICE")) {
        console.error(`Error in ${file}:`, stderr);
      } else {
        console.log(`Successfully applied ${file}`);
      }
    } catch (error) {
      console.error(`Failed to apply ${file}:`, error.message);
      process.exit(1);
    }
  }

  console.log("All SQL files applied successfully!");
}

applySQLFiles().catch((err) => {
  console.error("Failed to apply SQL files:", err);
  process.exit(1);
});
