// middlewares/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import HttpError from "../modules/common/exceptions/http.error";
import BadRequestError from "../modules/common/exceptions/bad-request.error";

export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            data: {
                errorCode: 400,
                errorMeta: error.issues,
            },
        });
    }

    if (error instanceof BadRequestError) {
        return res.status(400).json({
            success: false,
            message: error.message,
            data: {
                errorCode: error.status,
                errorMeta: error.meta,
            },
        });
    }

    if (error instanceof HttpError) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
            data: {
                errorCode: error.status,
            },
        });
    }

    // 3. Tangani error lainnya (Internal Server Error)
    console.error(error); // Penting untuk logging
    return res.status(500).json({
        success: false,
        code: 500,
        message: "Internal Server Error",
    });
};
