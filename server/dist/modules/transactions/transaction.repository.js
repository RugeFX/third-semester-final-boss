import { db } from '../../db';
import { eq, and, isNull } from 'drizzle-orm';
import { transactionsTable } from '../../db/schema';
export const findAll = async () => {
    return await db.query.transactionsTable.findMany({
        with: {
            user: {
                columns: {
                    id: true,
                    fullname: true,
                    username: true,
                    role: true
                }
            },
            vehicleDetail: {
                with: {
                    category: true
                }
            },
            parkingLevel: true,
        },
    });
};
export const findById = async (transactionId) => {
    return await db.query.transactionsTable.findFirst({
        where: eq(transactionsTable.id, transactionId),
        with: {
            user: {
                columns: {
                    id: true,
                    fullname: true,
                    username: true,
                    role: true
                }
            },
            vehicleDetail: {
                with: {
                    category: true
                }
            },
            parkingLevel: true
        }
    });
};
export const findByAccessCode = async (accessCode, tx = db) => {
    return await tx.query.transactionsTable.findFirst({
        where: eq(transactionsTable.access_code, accessCode),
        with: {
            user: {
                columns: {
                    id: true,
                    fullname: true,
                    username: true,
                    role: true
                }
            },
            vehicleDetail: {
                with: {
                    category: true
                }
            },
            parkingLevel: true
        }
    });
};
export const findByUserId = async (userId) => {
    return await db.query.transactionsTable.findMany({
        where: eq(transactionsTable.user_id, userId),
        with: {
            user: {
                columns: {
                    id: true,
                    fullname: true,
                    username: true,
                    role: true
                }
            },
            vehicleDetail: {
                with: {
                    category: true
                }
            },
            parkingLevel: true,
        }
    });
};
export const create = async (transactionData, tx = db) => {
    const [newTransaction] = await tx.insert(transactionsTable).values({
        status: transactionData.status,
        paid_amount: transactionData.paidAmount?.toString(),
        access_code: transactionData.accessCode,
        user_id: transactionData.userId,
        vehicle_detail_id: transactionData.vehicleDetailId,
        parking_level_id: transactionData.parkingLevelId,
    }).returning();
    return newTransaction;
};
export const update = async (accessCode, transactionData) => {
    const [updatedTransaction] = await db.update(transactionsTable).set({
        status: transactionData.status,
        paid_amount: transactionData.paidAmount?.toString(),
    }).where(eq(transactionsTable.access_code, accessCode)).returning();
    return updatedTransaction;
};
export const updatePaidAmount = async (accessCode, paidAmount) => {
    const [updatedTransactionPaidAmount] = await db.update(transactionsTable).set({
        paid_amount: paidAmount.toString(),
    }).where(and(eq(transactionsTable.access_code, accessCode), eq(transactionsTable.status, "ENTRY"), isNull(transactionsTable.paid_amount))).returning();
    return updatedTransactionPaidAmount;
};
export const updateToExit = async (accessCode) => {
    const [updatedTransactionExit] = await db.update(transactionsTable).set({
        status: "EXIT",
    }).where(and(eq(transactionsTable.access_code, accessCode), eq(transactionsTable.status, "ENTRY"))).returning();
    return updatedTransactionExit;
};
export const remove = async (accessCode) => {
    const [deletedTransaction] = await db.delete(transactionsTable).where(eq(transactionsTable.access_code, accessCode)).returning();
    return deletedTransaction;
};
export default { findAll, findById, findByAccessCode, findByUserId, create, update, updatePaidAmount, updateToExit, remove };
//# sourceMappingURL=transaction.repository.js.map