import "dotenv/config";
import express from "express";
import scalarDocsRouter from "./modules/scalar/scalar.route";

import { db } from "./db";
import { usersTable } from "./db/schema";
import { env } from "./env";

const app = express();

app.get("/", async (req, res) => {
  const data = await db.select().from(usersTable);

  return res.json({
    message: "HoHo",
    data,
  });
});

app.use("/docs", scalarDocsRouter);

app.listen(env.APP_PORT, () => {
  console.log(`Server started on port ${env.APP_PORT}`);
});
