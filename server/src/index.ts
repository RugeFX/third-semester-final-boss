import "dotenv/config";
import express from "express";
import cors from "cors";

import { env } from "./env";

import scalarDocsRouter from "./modules/scalar/scalar.route";
import categoryRouter from "./modules/categories/category.route";
import priceRouter from "./modules/prices/price.route";
import vehicleDetailRouter from "./modules/vehicle_details/vehicle-detail.route";
import parkingLevelRouter from "./modules/parking_levels/parking-level.route";
import transactionRouter from "./modules/transactions/transaction.route";
import userRouter from "./modules/users/user.route";
import memberRouter from "./modules/members/member.route";
import auditLogsRouter from "./modules/audit_logs/audit-log.route";
import authenticateRouter from "./modules/auth/auth.route";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/docs", scalarDocsRouter);
app.use("/categories", categoryRouter);
app.use("/prices", priceRouter);
app.use("/vehicle-details", vehicleDetailRouter);
app.use("/parking-levels", parkingLevelRouter);
app.use("/transactions", transactionRouter);
app.use("/users", userRouter);
app.use("/members", memberRouter);
app.use("/audit-logs", auditLogsRouter);
app.use("/auth", authenticateRouter);

app.use(errorHandler);

app.listen(env.APP_PORT, () => {
  console.log(`Server started on port ${env.APP_PORT}`);
});
