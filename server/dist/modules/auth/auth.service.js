import "dotenv/config";
import { env } from "../../env";
import authRepository from "./auth.repository";
import HttpError from "../../common/exceptions/http.error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const authenticateUser = async (username, password) => {
    const user = await authRepository.findUserByUsername(username);
    if (!user)
        throw new HttpError(401, "Invalid username or password");
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
        throw new HttpError(401, "Invalid username or password");
    const payload = {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        role: user.role,
    };
    const secret = env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables. Application cannot start.");
    }
    const token = jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn: "12h",
    });
    return token;
};
export const registerUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await authRepository.registerUser({ ...userData, password: hashedPassword });
};
export const findUserById = async (userId) => {
    const user = await authRepository.findUserById(userId);
    if (!user)
        throw new HttpError(404, "User not found");
    return user;
};
export default { authenticateUser, registerUser, findUserById };
//# sourceMappingURL=auth.service.js.map