import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { env } from "./src/env";

console.log({ env });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    user: env.DB_USER,
    ssl: env.DB_SSL,
  },
});
