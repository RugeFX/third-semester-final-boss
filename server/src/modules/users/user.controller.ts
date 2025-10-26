import { Request, Response } from "express";
import userService from "./user.service";
import { paramsSchema, createUserSchema, updateUserSchema, changeUserPasswordSchema, resetPasswordSchema } from "./user.schema";
import HttpError from "../../common/exceptions/http.error";

// Get all users
export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();

    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users
    });
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const { id: userId, fullname, username, role } = await userService.findUserById(id);

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: {
            userId,
            fullname,
            username,
            role
        }
    });
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    const userData = createUserSchema.parse(req.body);

    const newUser = await userService.createUser(userData);

    if (!newUser) throw new HttpError(500, "Failed to create user");

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser
    });
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const userData = updateUserSchema.parse(req.body);

    const adminUserId = req.user!.id;

    const updatedUser = await userService.updateUser(id, userData, adminUserId);

    if (!updatedUser) throw new HttpError(500, "Failed to update user");

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
    });
};

// Reset user password
export const resetUserPassword = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const { newPassword } = resetPasswordSchema.parse(req.body);

    const adminUserId = req.user!.id;

    const updatedUser = await userService.resetUserPassword(id, newPassword, adminUserId);

    if (!updatedUser) throw new HttpError(500, "Failed to reset user password");

    res.status(200).json({
        success: true,
        message: "User password reset successfully",
        data: updatedUser
    });
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const adminUserId = req.user!.id;

    const deletedUser = await userService.deleteUser(id, adminUserId);

    if (!deletedUser) throw new HttpError(500, "Failed to delete user");

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser
    });
};

// Change user password
export const changeUserPassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = changeUserPasswordSchema.parse(req.body);

    const userId = req.user!.id;

    const updatedUser = await userService.changeUserPassword(userId, currentPassword, newPassword);

    if (!updatedUser) throw new HttpError(500, "Failed to change user password");

    res.status(200).json({
        success: true,
        message: "User password changed successfully",
        data: updatedUser
    });
};