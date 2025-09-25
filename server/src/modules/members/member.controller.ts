import { Request, Response } from "express";

// Get all members
export const getAllMembers = async (req: Request, res: Response) => {
    const members = [
        {
            id: 1,
            joined_at: new Date(),
            ended_at: new Date(),
            user_id: 1,
            user: {
                id: 1,
                name: "John Doe",
                password: "password123",
                role: "admin"
            }
        },
        {
            id: 2,
            joined_at: new Date(),
            ended_at: new Date(),
            user_id: 2,
            user: {
                id: 2,
                name: "Jane Doe",
                password: "password456",
                role: "member"
            }
        }
    ];

    res.json({
        success: true,
        code: 200,
        message: "Members fetched successfully",
        data: members
    });
};

// Get member by ID
export const getMemberById = async (req: Request, res: Response) => {
    const member = {
        id: 1,
        joined_at: new Date(),
        ended_at: new Date(),
        user_id: 1,
        user: {
            id: 1,
            name: "John Doe",
            password: "password123",
            role: "admin"
        }
    };

    res.json({
        success: true,
        code: 200,
        message: "Member fetched successfully",
        data: member
    });
};

// Create a new member
export const createMember = async (req: Request, res: Response) => {
    const { joined_at, ended_at, user_id } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Member created successfully",
        data: {
            joined_at,
            ended_at,
            user_id
        }
    });
};

// Update a member
export const updateMember = async (req: Request, res: Response) => {
    const { joined_at, ended_at, user_id } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Member updated successfully",
        data: {
            joined_at,
            ended_at,
            user_id
        }
    });
};

// Delete a member
export const deleteMember = async (req: Request, res: Response) => {
    res.json({
        success: true,
        code: 200,
        message: "Member deleted successfully"
    });
};