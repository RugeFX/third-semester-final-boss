import { authenticateUser } from "./auth.service";
import { paramsSchema } from "./auth.schema";
import authService from "./auth.service";
import { registerUserSchema } from "./auth.schema";
export const authenticate = async (req, res) => {
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
export const register = async (req, res) => {
    const userData = registerUserSchema.parse(req.body);
    const newUser = await authService.registerUser(userData);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: newUser
    });
};
//# sourceMappingURL=auth.controller.js.map