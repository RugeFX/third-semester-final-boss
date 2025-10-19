import { Request, Response } from "express";
import auditLogService from "./audit-log.service";
import { paramsSchema } from "./audit-log.schema";

// Get all audit logs
export const getAllAuditLogs = async (_req: Request, res: Response) => {
    const auditLogs = await auditLogService.getAllAuditLogs();

    res.status(200).json({
        success: true,
        message: "Audit logs fetched successfully",
        data: auditLogs
    });
};

// Get audit log by ID
export const getAuditLogById = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const auditLog = await auditLogService.findAuditLogById(Number(id));

    res.status(200).json({
        success: true,
        message: "Audit log fetched successfully",
        data: auditLog
    });
};