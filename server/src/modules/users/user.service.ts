import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
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
export const updateUser = async (userId: number, userData: updateUserInput, adminUserId: number) => {
    const oldUser = await findUserById(userId);

    const updatedUser = await userRepository.update(userId, userData);

    // Create audit log for update
    try {
        await auditLogService.createAuditLog({
            context: `Admin updated user (ID: ${userId}). Old Data: ${JSON.stringify(oldUser)}, New Data: ${JSON.stringify(updatedUser)}`,
            type: "USER_UPDATE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for user update:", error);
    }

    return updatedUser;
};

// Delete a user
export const deleteUser = async (userId: number, adminUserId: number) => {
    await findUserById(userId);

    const deletedUser = await userRepository.remove(userId);

    // Create audit log for deletion
    try {
        await auditLogService.createAuditLog({
            context: `Admin deleted user (ID: ${userId}). Data: ${JSON.stringify(deletedUser)}`,
            type: "USER_DELETE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for user deletion:", error);
    }

    return deletedUser;
};

export default { getAllUsers, findUserById, createUser, updateUser, deleteUser };