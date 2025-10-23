import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
import authService from "../auth/auth.service";
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
    const sanitizedUpdatedUser = { ...updatedUser, password: undefined };

    // Create audit log for update
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated user (ID: ${userId}). Old Data: ${JSON.stringify(oldUser)}, New Data: ${JSON.stringify(sanitizedUpdatedUser)}`,
            type: "USER_UPDATE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for user update:", error);
    }

    return updatedUser;
};

// Reset user password
export const resetUserPassword = async (userId: number, newPassword: string, adminUserId: number) => {
    await findUserById(userId);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await userRepository.updateUserPassword(userId, hashedPassword);

    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) changed password for user (ID: ${userId}).`,
            type: "USER_PASSWORD_CHANGE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for user password change:", error);
    }

    return updatedUser;
};

// Delete a user
export const deleteUser = async (userId: number, adminUserId: number) => {
    await findUserById(userId);

    const deletedUser = await userRepository.remove(userId);
    const sanitizedDeletedUser = { ...deletedUser, password: undefined };

    // Create audit log for deletion
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted user (ID: ${userId}). Data: ${JSON.stringify(sanitizedDeletedUser)}`,
            type: "USER_DELETE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for user deletion:", error);
    }

    return deletedUser;
};

// Change user password
export const changeUserPassword = async (userId: number, currentPassword: string, newPassword: string) => {
    const user = await authService.findUserById(userId);

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) throw new HttpError(401, "Current password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await userRepository.updateUserPassword(userId, hashedPassword);

    try {
        await auditLogService.createAuditLog({
            context: `User (ID: ${userId}) changed their own password.`,
            type: "USER_PASSWORD_CHANGE",
            createdBy: userId
        });
    } catch (error) {
        console.error("Failed to create audit log for user password change:", error);
    }

    return updatedUser;
};

export default { getAllUsers, findUserById, createUser, updateUser, changeUserPassword, deleteUser, resetUserPassword };