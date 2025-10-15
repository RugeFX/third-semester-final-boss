import { db } from "../../db";
import { eq, InferSelectModel } from "drizzle-orm";
import { Status, transactionsTable, vehicleDetailsTable, categoriesTable } from "../../db/schema";
import HttpError from "../common/exceptions/http.error";
import priceService from "../prices/price.service";

// Define types for better clarity
type Transaction = InferSelectModel<typeof transactionsTable>;
type VehicleDetail = InferSelectModel<typeof vehicleDetailsTable>;
type Category = InferSelectModel<typeof categoriesTable>;

// Extended type to include related details
export type TransactionWithDetails = Transaction & {
  vehicleDetail: VehicleDetail & {
    category: Category;
  };
};

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
export const getTransactionByAccessCode = async (accessCode: string): Promise<TransactionWithDetails> => {
    const transaction = await db.query.transactionsTable.findFirst({
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

    if (!transaction) throw new HttpError(404, "Transaction not found");

    return transaction;
};

// Create a new transaction
export const createTransaction = async (status: Status, paid_amount: number, access_code: string, user_id: number | null | undefined, vehicle_detail_id: number, parking_level_id: number) => {
    const [newTransaction] = await db.insert(transactionsTable).values({
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

    const [updatedTransaction] = await db.update(transactionsTable).set({
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

// Calculate parking fee based on duration and pricing rules
export const calculateParkingFee = async (transaction: TransactionWithDetails) => {
    const entryTime = new Date(transaction.created_at);
    const now = new Date();
    const durationInMillis = now.getTime() - entryTime.getTime();
    const totalDurationInHours = Math.ceil(durationInMillis / (1000 * 60 * 60));

    const categoryId = transaction.vehicleDetail.category.id;

    // Fetch initial block price details for the category
    const initialBlockPriceData = await priceService.findActivePriceByCategoryAndType(categoryId, 'INITIAL_BLOCK');
    
    // Fetch subsequent hour price details for the category
    const subsequentHourPriceData = await priceService.findActivePriceByCategoryAndType(categoryId, 'SUBSEQUENT_HOUR');

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
export const processTransactionPayment = async (access_code: string, paid_amount: number) => {
    const transaction = await getTransactionByAccessCode(access_code);

    // Validate transaction status
    if (transaction.status !== "ENTRY") {
        throw new HttpError(400, "Transaction is not in ENTRY status");
    }

    // Important!
    // if (transaction.paid_amount !== null) {
    //     throw new HttpError(409, "Transaction has already been paid");
    // }

    let totalFee = await calculateParkingFee(transaction);

    // Validate payment amount
    if (paid_amount < totalFee) {
        throw new HttpError(400, "Pembayaran tidak mencukupi, total yang harus dibayar adalah " + totalFee);
    }

    const [ processedTransaction ] = await db.update(transactionsTable).set({
        paid_amount: paid_amount.toString(),
    }).where(eq(transactionsTable.access_code, access_code)).returning();

    return processedTransaction;
}


// Update a transaction to EXIT
export const updateTransactionToExit = async (access_code: string) => {
    await getTransactionByAccessCode(access_code);

    const [updatedTransactionExit] = await db.update(transactionsTable).set({
        status: "EXIT",
    }).where(eq(transactionsTable.access_code, access_code)).returning();

    return updatedTransactionExit;
};

// Delete a transaction
export const deleteTransaction = async (transactionId: number) => {
    await getTransactionById(transactionId);

    const deletedTransaction = await db.delete(transactionsTable).where(eq(transactionsTable.id, transactionId));

    return deletedTransaction;
};

export default { getAllTransactions, getTransactionById, getTransactionByAccessCode, createTransaction, processTransactionPayment, updateTransaction, updateTransactionToExit, deleteTransaction };