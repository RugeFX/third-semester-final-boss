import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT)!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    ssl: false,
  },
});
