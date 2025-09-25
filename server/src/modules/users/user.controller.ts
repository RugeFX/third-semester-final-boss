import { Request, Response } from "express";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    const users = [
        {
            id: 1,
            name: "John Doe",
            password: "password123",
            role: "admin"
        },
        {
            id: 2,
            name: "Jane Doe",
            password: "password456",
            role: "member"  
        }
    ];

    res.json({
        success: true,
        code: 200,
        message: "Users fetched successfully",
        data: users
    });
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    const user = {
        id: 1,
        name: "John Doe",
        password: "password123",
        role: "admin"
    };

    res.json({
        success: true,
        code: 200,
        message: "User fetched successfully",
        data: user
    });
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    const { name, password, role } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "User created successfully",
        data: {
            name,
            password,
            role
        }
    });
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
    const { name, password, role } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "User updated successfully",
        data: {
            name,
            password,
            role
        }
    });
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
    res.json({
        success: true,
        code: 200,
        message: "User deleted successfully"
    });
};