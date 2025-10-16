import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { transactionsTable } from '../../db/schema';
import { createTransactionSchema, processPaymentSchema, updateTransactionSchema } from './transaction.schema';
import { z } from 'zod';

type TransactionDB = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

type newTransaction = z.infer<typeof createTransactionSchema>;
type updatedTransaction = z.infer<typeof updateTransactionSchema>;

// Get all transactions
export const findAll = async () => {
    return await db.query.transactionsTable.findMany({
            with: {
                user: true,
                vehicleDetail: true,
                parkingLevel: true,
            },
        });
};

// Find transaction by ID
export const findById = async (transactionId: number) => {
    return await db.query.transactionsTable.findFirst({
        where: eq(transactionsTable.id, transactionId),
        with: {
            user: true,
            vehicleDetail: {
                with: {
                    category: true
                }
            },
            parkingLevel: true
        }
    });
}

// Find transaction by Access Code
export const findByAccessCode = async (accessCode: string, tx: TransactionDB = db) => {
    return await tx.query.transactionsTable.findFirst({
        where: eq(transactionsTable.access_code, accessCode),
        with: {
            user: true,
            vehicleDetail: {
                with: {
                    category: true
                }
            },
            parkingLevel: true
        }
    });
}

// Create a new transaction
export const create = async (transactionData: newTransaction, tx: TransactionDB = db) => {
    const [ newTransaction ] = await tx.insert(transactionsTable).values({
        status: transactionData.status,
        paid_amount: transactionData.paidAmount?.toString(),
        access_code: transactionData.accessCode,
        user_id: transactionData.userId,
        vehicle_detail_id: transactionData.vehicleDetailId,
        parking_level_id: transactionData.parkingLevelId,
    }).returning();

    return newTransaction;
}

// Update a transaction
export const update = async (accessCode: string, transactionData: updatedTransaction) => {
    const [ updatedTransaction ] = await db.update(transactionsTable).set({
        status: transactionData.status,
        paid_amount: transactionData.paidAmount?.toString(),
    }).where(eq(transactionsTable.access_code, accessCode)).returning();

    return updatedTransaction;
}

// Update paid amount of a transaction
export const updatePaidAmount = async (accessCode: string, paidAmount: number) => {
    const [ updatedTransactionPaidAmount ] = await db.update(transactionsTable).set({
        paid_amount: paidAmount.toString(),
    }).where(eq(transactionsTable.access_code, accessCode)).returning();

    return updatedTransactionPaidAmount;
}

// Update a transaction to EXIT
export const updateToExit = async (accessCode: string) => {
    const [updatedTransactionExit] = await db.update(transactionsTable).set({
        status: "EXIT",
    }).where(eq(transactionsTable.access_code, accessCode)).returning();

    return updatedTransactionExit;
}

// Delete a transaction
export const remove = async (accessCode: string) => {
    const [ deletedTransaction ] = await db.delete(transactionsTable).where(
        eq(transactionsTable.access_code, accessCode)
    ).returning();

    return deletedTransaction;
}

export default { findAll, findById, findByAccessCode, create, update, updatePaidAmount, updateToExit, remove };