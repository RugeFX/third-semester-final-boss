import { db } from "../../db";
import { InferSelectModel } from "drizzle-orm";
import { generateShortCode } from "../../common/utils/generate-short-code";
import HttpError from "../../common/exceptions/http.error";
import { z } from "zod";

import auditLogService from "../audit_logs/audit-log.service";
import categoryService from "../categories/category.service";
import parkingLevelService from "../parking_levels/parking-level.service";
import vehicleDetailService from "../vehicle_details/vehicle-detail.service";
import transactionRepository from "./transaction.repository";
import priceRepository from "../prices/price.repository";
import { transactionsTable, vehicleDetailsTable, categoriesTable } from "../../db/schema";
import { createTransactionSchema, updateTransactionSchema, processPaymentSchema, entryTransactionSchema } from "./transaction.schema";

// Define types for input schemas
type createTransactionInput = z.infer<typeof createTransactionSchema>;
type entryTransactionInput = z.infer<typeof entryTransactionSchema>;
type processPaymentInput = z.infer<typeof processPaymentSchema>;
type updateTransactionInput = z.infer<typeof updateTransactionSchema>;

// Define types for database models
type Transaction = InferSelectModel<typeof transactionsTable>;
type VehicleDetail = InferSelectModel<typeof vehicleDetailsTable>;
type Category = InferSelectModel<typeof categoriesTable>;

// Extended type to include related details
export type TransactionWithDetails = Transaction & {
  vehicleDetail: VehicleDetail & {
    category: Category;
  };
};

type TransactionDB = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Helper function to generate a unique access code by checking against the database.
 * It will retry up to 10 times before throwing an error.
 * @param {TransactionDB} tx - The Drizzle transaction instance.
 * @returns {Promise<string>} A unique access code.
 */
const generateUniqueAccessCode = async (tx: TransactionDB): Promise<string> => {
    let retries = 0;
    const maxRetries = 10;

    while (retries < maxRetries) {
        const candidateCode = generateShortCode();
        
        // Check if the generated code already exists in the database
        const existingTransaction = await transactionRepository.findByAccessCode(candidateCode, tx);

        if (!existingTransaction) {
            // If the code is unique, return it
            return candidateCode;
        }

        retries++;
    }

    // If the loop completes without finding a unique code, throw an error
    throw new HttpError(500, "Failed to generate a unique access code after several attempts.");
};

// Get all transactions
export const getAllTransactions = async () => {
    return await transactionRepository.findAll();
};

// Get transaction by ID
export const getTransactionById = async (transactionId: number) => {
    const transaction = await transactionRepository.findById(transactionId);

    if (!transaction) throw new HttpError(404, "Transaction not found");

    return transaction;
};

// Get transaction by Access Code
export const getTransactionByAccessCode = async (accessCode: string): Promise<TransactionWithDetails> => {
    const transaction = await transactionRepository.findByAccessCode(accessCode);

    if (!transaction) throw new HttpError(404, "Transaction not found");

    return transaction;
};

// Get transactions by User ID
export const getTransactionsByUserId = async (userId: number) => {
    return await transactionRepository.findByUserId(userId);
};

// Create a new transaction
export const createTransaction = async (transactionData: createTransactionInput) => {
    return await transactionRepository.create(transactionData);
};

export const createEntryTransaction = async (entryData: entryTransactionInput) => {
    const newTransactionResult = await db.transaction(async (tx) => {
        await categoryService.findCategoryById(entryData.categoryId);
        await parkingLevelService.findParkingLevelById(entryData.parkingLevelId);

        const newVehicleDetail = await vehicleDetailService.createVehicleDetail({
            plateNumber: entryData.plateNumber,
            categoryId: entryData.categoryId
        }, tx);

        // Handle potential failure in vehicle detail creation
        if (!newVehicleDetail) {
            throw new HttpError(500, "Failed to create vehicle detail");
        }

        // Generate a unique access code
        const accessCode = await generateUniqueAccessCode(tx);

        const newTransaction = await transactionRepository.create({
            status: "ENTRY",
            accessCode: accessCode,
            userId: entryData.userId,
            vehicleDetailId: newVehicleDetail.id,
            parkingLevelId: entryData.parkingLevelId
        }, tx);

        return newTransaction;
    });

    return newTransactionResult;
}

// Update a transaction
export const updateTransaction = async (accessCode: string, transactionData: updateTransactionInput, adminUserId: number) => {
    const oldTransaction = await getTransactionByAccessCode(accessCode);

    const updatedTransaction = await transactionRepository.update(accessCode, transactionData);

    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated transaction (Access Code: ${accessCode}). Old Data: ${JSON.stringify(oldTransaction)}, New Data: ${JSON.stringify(updatedTransaction)}`,
            type: "TRANSACTION_UPDATE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for transaction update:", error);
    }

    return updatedTransaction;
};

// Calculate parking fee based on duration and pricing rules
export const calculateParkingFee = async (transaction: TransactionWithDetails) => {
    const entryTime = new Date(transaction.created_at);
    const now = new Date();
    const durationInMillis = now.getTime() - entryTime.getTime();
    const totalDurationInHours = Math.ceil(durationInMillis / (1000 * 60 * 60));

    const categoryId = transaction.vehicleDetail.category.id;

    // Fetch initial block price details for the category
    const initialBlockPriceData = await priceRepository.findActivePriceByCategoryAndType(categoryId, 'INITIAL_BLOCK');
    
    // Fetch subsequent hour price details for the category
    const subsequentHourPriceData = await priceRepository.findActivePriceByCategoryAndType(categoryId, 'SUBSEQUENT_HOUR');

    console.log(initialBlockPriceData, subsequentHourPriceData);

    if (!initialBlockPriceData || !subsequentHourPriceData) {
        throw new HttpError(422, `Active pricing tiers are incomplete for category ID ${categoryId}`);
    }

    if (initialBlockPriceData.block_hours == null) {
        throw new HttpError(422, `INITIAL_BLOCK price for category ID ${categoryId} is missing block_hours`);
    }

    const initialBlockPrice = Number(initialBlockPriceData.amount);
    const initialBlockDuration = initialBlockPriceData.block_hours;
    const subsequentHourPrice = Number(subsequentHourPriceData.amount);

    let totalFee = 0;

    // Calculate total fee based on duration
    if (totalDurationInHours <= initialBlockDuration) {
        // If within the initial block duration, charge only the initial block price
        totalFee = initialBlockPrice;

        console.log(`Total Fee: ${totalFee}`);
    } else {
        // If exceeding the initial block duration, calculate additional fees
        const remainingHours = totalDurationInHours - initialBlockDuration;
        totalFee = initialBlockPrice + (remainingHours * subsequentHourPrice);

        console.log(`Total Fee: ${initialBlockPrice} + (${remainingHours} * ${subsequentHourPrice}) = ${totalFee}`);
    }

    return totalFee;
}

// Process payment for a transaction
export const processTransactionPaymentForNonMember = async (accessCode: string, paymentData: processPaymentInput) => {
    const transaction = await getTransactionByAccessCode(accessCode);

    // Validate transaction status
    if (transaction.status !== "ENTRY") {
        throw new HttpError(400, "Transaction is not in ENTRY status");
    }

    // Check if the transaction has already been paid
    if (transaction.paid_amount !== null) {
        throw new HttpError(400, "Transaction has already been paid");
    }

    let totalFee = await calculateParkingFee(transaction);

    // Validate payment amount
    if (paymentData.paidAmount < totalFee) {
        throw new HttpError(400, "Pembayaran tidak mencukupi, total yang harus dibayar adalah " + totalFee);
    }

    return await transactionRepository.updatePaidAmount(accessCode, paymentData.paidAmount);
}

// Process payment for a member transaction (sets paid amount to 0)
export const processTransactionPaymentForMember = async (accessCode: string) => {
    const transaction = await getTransactionByAccessCode(accessCode);

    // Validate transaction status
    if (transaction.status !== "ENTRY") {
        throw new HttpError(400, "Transaction is not in ENTRY status");
    }

    // Check if the transaction has already been paid
    if (transaction.paid_amount !== null) {
        throw new HttpError(400, "Transaction has already been paid");
    }

    return await transactionRepository.updatePaidAmount(accessCode, 0);
};


// Update transaction status to EXIT
export const updateTransactionToExit = async (accessCode: string) => {
    const transaction = await getTransactionByAccessCode(accessCode);

    // Validate transaction status
    if (transaction.status !== "ENTRY") {
        throw new HttpError(400, "Transaction is not in ENTRY status");
    }

    // Ensure the transaction has been paid before exiting
    if (transaction.paid_amount === null) {
        throw new HttpError(400, "Transaction has not been paid yet");
    }

    return await transactionRepository.updateToExit(accessCode);
};

// Delete a transaction
export const deleteTransaction = async (accessCode: string, adminUserId: number) => {
    await getTransactionByAccessCode(accessCode);

    const deletedTransaction = await transactionRepository.remove(accessCode);

    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted transaction (Access Code: ${accessCode}). Data: ${JSON.stringify(deletedTransaction)}`,
            type: "TRANSACTION_DELETE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for transaction deletion:", error);
    }

    return deletedTransaction;
};

export default { getAllTransactions, getTransactionById, getTransactionByAccessCode, getTransactionsByUserId, createTransaction, createEntryTransaction, processTransactionPaymentForNonMember, processTransactionPaymentForMember, updateTransaction, updateTransactionToExit, deleteTransaction };