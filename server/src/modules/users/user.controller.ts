import { Request, Response } from "express";
import userService from "./user.service";
import { paramsSchema, createUserSchema, updateUserSchema } from "./user.schema";
import HttpError from "../../common/exceptions/http.error";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
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

    const updatedUser = await userService.updateUser(id, userData);

    if (!updatedUser) throw new HttpError(500, "Failed to update user");

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
    });
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const deletedUser = await userService.deleteUser(id);

    if (!deletedUser) throw new HttpError(500, "Failed to delete user");

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser
    });
};