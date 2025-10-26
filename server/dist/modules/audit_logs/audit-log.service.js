import HttpError from "../../common/exceptions/http.error";
import auditLogRepository from "./audit-log.repository";
export const getAllAuditLogs = async () => {
    return await auditLogRepository.findAll();
};
export const findAuditLogById = async (logId) => {
    const auditLog = await auditLogRepository.findById(logId);
    if (!auditLog)
        throw new HttpError(404, "Audit log not found");
    return auditLog;
};
export const createAuditLog = async (logData) => {
    return await auditLogRepository.create(logData);
};
export default { getAllAuditLogs, findAuditLogById, createAuditLog };
//# sourceMappingURL=audit-log.service.js.map