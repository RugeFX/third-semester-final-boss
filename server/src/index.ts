import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import scalarDocsRouter from './modules/scalar';

import { env } from "./env";
import HttpError from "./modules/common/exceptions/http.error";
import BadRequestError from "./modules/common/exceptions/bad-request.error";

const app = express();

// Parse JSON
app.use(express.json());

app.use("/docs", scalarDocsRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof BadRequestError) {
    return res.status(400).json({ success: false, message: err.message, data: {
      errorCode: err.status,
      errorMeta: err.meta
    } });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ success: false, message: err.message, data: {
      errorCode: err.status,
    } });
  }
})

app.listen(env.APP_PORT, () => {
  console.log(`Server started on port ${env.APP_PORT}`);
});
