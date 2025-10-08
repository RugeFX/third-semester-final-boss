import { db } from "../../db";
import { eq } from "drizzle-orm";
import { Status, transactionsTable } from "../../db/schema";
import HttpError from "../common/exceptions/http.error";

// Get all transactions
export const getAllTransactions = async () => {
    const transactions = await db.query.transactionsTable.findMany({
        with: {
            user: true,
            vehicleDetail: true,
            parkingLevel: true,
        },
    });

    return transactions;
};

// Get transaction by ID
export const getTransactionById = async (transactionId: number) => {
    const transaction = await db.query.transactionsTable.findFirst({
        where: eq(transactionsTable.id, transactionId),
        with: {
            user: true,
            vehicleDetail: true,
            parkingLevel: true
        }
    });

    if (!transaction) throw new HttpError(404, "Transaction not found");

    return transaction;
};

// Get transaction by Access Code
export const getTransactionByAccessCode = async (accessCode: string) => {
    const transaction = await db.query.transactionsTable.findFirst({
        where: eq(transactionsTable.access_code, accessCode),
        with: {
            user: true,
            vehicleDetail: true,
            parkingLevel: true
        }
    });

    if (!transaction) throw new HttpError(404, "Transaction not found");

    return transaction;
};

// Create a new transaction
export const createTransaction = async (status: Status, paid_amount: number, access_code: string, user_id: number, vehicle_detail_id: number, parking_level_id: number) => {
    const [ newTransaction ] = await db.insert(transactionsTable).values({
        status,
        paid_amount: paid_amount.toString(),
        access_code,
        user_id,
        vehicle_detail_id,
        parking_level_id,
        created_at: new Date(),
        updated_at: new Date(),
    }).returning();

    return newTransaction;
};

// Update a transaction
export const updateTransaction = async (transactionId: number, status: Status, paid_amount: number, access_code: string, user_id: number, vehicle_detail_id: number, parking_level_id: number) => {
    await getTransactionById(transactionId);

    const [ updatedTransaction ] = await db.update(transactionsTable).set({
        status,
        paid_amount: paid_amount.toString(),
        access_code,
        user_id,
        vehicle_detail_id,
        parking_level_id,
        updated_at: new Date(),
    }).where(eq(transactionsTable.id, transactionId)).returning();

    return updatedTransaction;
};

export const processTransactionPayment = async (access_code: string, paid_amount: number) => {
    await getTransactionByAccessCode(access_code);

    const [ processedTransaction ] = await db.update(transactionsTable).set({
        paid_amount: paid_amount.toString(),
        updated_at: new Date(),
    }).where(eq(transactionsTable.access_code, access_code)).returning();
    
    return processedTransaction;
}


// Update a transaction to EXIT
export const updateTransactionToExit = async (access_code: string) => {
    await getTransactionByAccessCode(access_code);

    const [ updatedTransactionExit ] = await db.update(transactionsTable).set({
        status: "EXIT",
        updated_at: new Date(),
    }).where(eq(transactionsTable.access_code, access_code)).returning();
    
    return updatedTransactionExit;
};

// Delete a transaction
export const deleteTransaction = async (transactionId: number) => {
    await getTransactionById(transactionId);

    const deletedTransaction = await db.delete(transactionsTable).where(eq(transactionsTable.id, transactionId));

    return deletedTransaction;
};

export default { getAllTransactions, getTransactionById, getTransactionByAccessCode, createTransaction, updateTransaction, updateTransactionToExit, deleteTransaction };