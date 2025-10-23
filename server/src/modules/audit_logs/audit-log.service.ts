import HttpError from "../../common/exceptions/http.error";
import auditLogRepository from "./audit-log.repository";
import { createAuditLogSchema } from "./audit-log.schema";
import { z } from "zod";

export type createAuditLogInput = z.infer<typeof createAuditLogSchema>;

// Get all audit logs
export const getAllAuditLogs = async () => {
    return await auditLogRepository.findAll();
};

// Find audit log by ID
export const findAuditLogById = async (logId: number) => {
    const auditLog = await auditLogRepository.findById(logId);

    if (!auditLog) throw new HttpError(404, "Audit log not found");

    return auditLog;
};

export const createAuditLog = async (logData: createAuditLogInput) => {
    return await auditLogRepository.create(logData);
};

export default { getAllAuditLogs, findAuditLogById, createAuditLog };