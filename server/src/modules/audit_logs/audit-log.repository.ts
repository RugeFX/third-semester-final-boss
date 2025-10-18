import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { auditLogsTable } from '../../db/schema';
import { z } from 'zod';

// Get all audit logs
export const findAll = async () => {
    return await db.query.auditLogsTable.findMany();
};

// Find audit log by ID
export const findById = async (logId: number) => {
    return await db.query.auditLogsTable.findFirst({
        where: eq(auditLogsTable.id, logId)
    });
};

export default { findAll, findById };