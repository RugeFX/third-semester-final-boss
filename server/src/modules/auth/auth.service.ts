import authRepository from "./auth.repository";
import HttpError from "../common/exceptions/http.error";
import 'dotenv/config';
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

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'YOUR_SECRET_KEY_FALLBACK', {
    expiresIn: "12h"
  });

  return token;
};

export default { authenticateUser };
