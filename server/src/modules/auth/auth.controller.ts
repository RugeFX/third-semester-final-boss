import { Request, Response } from "express";
import { authenticateUser } from "./auth.service";
import { paramsSchema } from "./auth.schema";

export const authenticate = async (req: Request, res: Response) => {
    const { username, password } = paramsSchema.parse(req.body);

    const userToken = await authenticateUser(username, password);

    res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        data: {
            token: userToken
        }
    });
};