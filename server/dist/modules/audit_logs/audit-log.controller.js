import auditLogService from "./audit-log.service";
import { paramsSchema } from "./audit-log.schema";
export const getAllAuditLogs = async (_req, res) => {
    const auditLogs = await auditLogService.getAllAuditLogs();
    res.status(200).json({
        success: true,
        message: "Audit logs fetched successfully",
        data: auditLogs
    });
};
export const getAuditLogById = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const auditLog = await auditLogService.findAuditLogById(Number(id));
    res.status(200).json({
        success: true,
        message: "Audit log fetched successfully",
        data: auditLog
    });
};
//# sourceMappingURL=audit-log.controller.js.map