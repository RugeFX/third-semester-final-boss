import 'dotenv/config';
import { env } from '../../env';
import authRepository from "./auth.repository";
import HttpError from "../../common/exceptions/http.error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authenticateUser = async (username: string, password: string) => {
  const user = await authRepository.findUserByUsername(username);

  if (!user) throw new HttpError(401, "Invalid username or password");

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) throw new HttpError(401, "Invalid username or password");

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const secret = env.JWT_SECRET;
  
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables. Application cannot start.");
  }

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: "12h"
  });

  return token;
};

export default { authenticateUser };
