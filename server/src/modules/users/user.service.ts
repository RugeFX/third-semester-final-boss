import HttpError from "../../common/exceptions/http.error";
import userRepository from "./user.repository";
import { createUserSchema, updateUserSchema } from "./user.schema";
import { z } from "zod";
import bcrypt from 'bcrypt';

type createUserInput = z.infer<typeof createUserSchema>;
type updateUserInput = z.infer<typeof updateUserSchema>;

// Get all users
export const getAllUsers = async () => {
    return await userRepository.findAll();
};

// Find user by ID
export const findUserById = async (userId: number) => {
    const user = await userRepository.findById(userId);

    if (!user) throw new HttpError(404, "User not found");

    return user;
};

// Create a new user
export const createUser = async (userData: createUserInput) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return await userRepository.create({ ...userData, password: hashedPassword });
};

// Update a user
export const updateUser = async (userId: number, userData: updateUserInput) => {
    await findUserById(userId);

    return await userRepository.update(userId, userData);
};

// Delete a user
export const deleteUser = async (userId: number) => {
    await findUserById(userId);

    return await userRepository.remove(userId);
};

export default { getAllUsers, findUserById, createUser, updateUser, deleteUser };