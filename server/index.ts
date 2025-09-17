import "dotenv/config";
import express from "express";
import { drizzle } from "drizzle-orm/postgres-js";

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || "postgres://postgres:postgres@localhost:5432/postgres";
const db = drizzle(DB_URL);

const app = express();

app.get("/", (req, res) => {
  return res.send("Hello Sigma!");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
