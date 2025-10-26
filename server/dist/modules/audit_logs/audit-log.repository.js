import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { auditLogsTable } from '../../db/schema';
export const findAll = async () => {
    return await db.query.auditLogsTable.findMany();
};
export const findById = async (logId) => {
    return await db.query.auditLogsTable.findFirst({
        where: eq(auditLogsTable.id, logId)
    });
};
export const create = async (logData) => {
    const [newLog] = await db.insert(auditLogsTable).values({
        context: logData.context,
        type: logData.type,
        created_by: logData.createdBy
    }).returning();
    return newLog;
};
export default { findAll, findById, create };
//# sourceMappingURL=audit-log.repository.js.map