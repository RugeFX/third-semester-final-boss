import HttpError from "../../common/exceptions/http.error";
import auditLogRepository from "./audit-log.repository";

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

export default { getAllAuditLogs, findAuditLogById };