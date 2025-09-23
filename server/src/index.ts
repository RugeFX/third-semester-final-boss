import "dotenv/config";
import express from "express";
import scalarDocsRouter from './modules/scalar';
import categoryRouter from './modules/categories/category.route';
import priceRouter from './modules/prices/price.route';
import vehicleDetailRouter from './modules/vehicle_details/vehicle-detail.route';
import parkingLevelRouter from './modules/parking_levels/parking-level.route';
import transactionRouter from './modules/transactions/transaction.route';
import userRouter from './modules/users/user.route';
import memberRouter from './modules/members/member.route';
import auditLogs from './modules/audit_logs/audit-log.route';

import { db } from "./db";
import { env } from "./env";

const app = express();

// app.get("/", async (req, res) => {
//   const data = await db.query.usersTable.findMany();

//   return res.json({
//     message: "HoHo",
//     data,
//   });
// });

app.use("/docs", scalarDocsRouter);
app.use("/categories", categoryRouter);
app.use("/prices", priceRouter);
app.use("/vehicle-details", vehicleDetailRouter);
app.use("/parking-levels", parkingLevelRouter);
app.use("/transactions", transactionRouter);
app.use("/users", userRouter);
app.use("/members", memberRouter);
app.use("/audit-logs", auditLogs);

app.listen(env.APP_PORT, () => {
  console.log(`Server started on port ${env.APP_PORT}`);
});
