import { Request, Response } from "express";

// Get all audit logs
export const getAllAuditLogs = async (req: Request, res: Response) => {
    const auditLogs = [
        {
            id: 1,
            context: "User created",
            type: "CREATE",
            created_at: new Date(),
            created_by: 1
        },
        {
            id: 2,
            context: "User deleted",
            type: "DELETE",
            created_at: new Date(),
            created_by: 1
        }
    ];

    res.json({
        success: true,
        code: 200,
        message: "Audit logs fetched successfully",
        data: auditLogs
    });
};

// Get audit log by ID
export const getAuditLogById = async (req: Request, res: Response) => {
    const auditLog = {
        id: 1,
        context: "User created",
        type: "CREATE",
        created_at: new Date(),
        created_by: 1
    };

    res.json({
        success: true,
        code: 200,
        message: "Audit log fetched successfully",
        data: auditLog
    });
};

// Create a new audit log
export const createAuditLog = async (req: Request, res: Response) => {
    const { context, type, created_at, created_by } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Audit log created successfully",
        data: {
            context,
            type,
            created_at,
            created_by
        }
    });
};

// Dont update and delete audit logs