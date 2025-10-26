import { db } from "../../db";
import { generateShortCode } from "../../common/utils/generate-short-code";
import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
import categoryService from "../categories/category.service";
import parkingLevelService from "../parking_levels/parking-level.service";
import vehicleDetailService from "../vehicle_details/vehicle-detail.service";
import transactionRepository from "./transaction.repository";
import priceRepository from "../prices/price.repository";
const generateUniqueAccessCode = async (tx) => {
    let retries = 0;
    const maxRetries = 10;
    while (retries < maxRetries) {
        const candidateCode = generateShortCode();
        const existingTransaction = await transactionRepository.findByAccessCode(candidateCode, tx);
        if (!existingTransaction) {
            return candidateCode;
        }
        retries++;
    }
    throw new HttpError(500, "Failed to generate a unique access code after several attempts.");
};
export const getAllTransactions = async () => {
    return await transactionRepository.findAll();
};
export const getTransactionById = async (transactionId) => {
    const transaction = await transactionRepository.findById(transactionId);
    if (!transaction)
        throw new HttpError(404, "Transaction not found");
    return transaction;
};
export const getTransactionByAccessCode = async (accessCode) => {
    const transaction = await transactionRepository.findByAccessCode(accessCode);
    if (!transaction)
        throw new HttpError(404, "Transaction not found");
    return transaction;
};
export const getTransactionsByUserId = async (userId) => {
    return await transactionRepository.findByUserId(userId);
};
export const createTransaction = async (transactionData) => {
    return await transactionRepository.create(transactionData);
};
export const createEntryTransaction = async (entryData) => {
    const newTransactionResult = await db.transaction(async (tx) => {
        await categoryService.findCategoryById(entryData.categoryId);
        await parkingLevelService.findParkingLevelById(entryData.parkingLevelId);
        const newVehicleDetail = await vehicleDetailService.createVehicleDetail({
            plateNumber: entryData.plateNumber,
            categoryId: entryData.categoryId
        }, tx);
        if (!newVehicleDetail) {
            throw new HttpError(500, "Failed to create vehicle detail");
        }
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
};
export const updateTransaction = async (accessCode, transactionData, adminUserId) => {
    const oldTransaction = await getTransactionByAccessCode(accessCode);
    const updatedTransaction = await transactionRepository.update(accessCode, transactionData);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated transaction (Access Code: ${accessCode}). Old Data: ${JSON.stringify(oldTransaction)}, New Data: ${JSON.stringify(updatedTransaction)}`,
            type: "TRANSACTION_UPDATE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for transaction update:", error);
    }
    return updatedTransaction;
};
export const calculateParkingFee = async (transaction) => {
    const entryTime = new Date(transaction.created_at);
    const now = new Date();
    const durationInMillis = now.getTime() - entryTime.getTime();
    const totalDurationInHours = Math.ceil(durationInMillis / (1000 * 60 * 60));
    const categoryId = transaction.vehicleDetail.category.id;
    const initialBlockPriceData = await priceRepository.findActivePriceByCategoryAndType(categoryId, 'INITIAL_BLOCK');
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
    if (totalDurationInHours <= initialBlockDuration) {
        totalFee = initialBlockPrice;
        console.log(`Total Fee: ${totalFee}`);
    }
    else {
        const remainingHours = totalDurationInHours - initialBlockDuration;
        totalFee = initialBlockPrice + (remainingHours * subsequentHourPrice);
        console.log(`Total Fee: ${initialBlockPrice} + (${remainingHours} * ${subsequentHourPrice}) = ${totalFee}`);
    }
    return totalFee;
};
export const processTransactionPaymentForNonMember = async (accessCode, paymentData) => {
    const transaction = await getTransactionByAccessCode(accessCode);
    if (transaction.status !== "ENTRY") {
        throw new HttpError(400, "Transaction is not in ENTRY status");
    }
    if (transaction.paid_amount !== null) {
        throw new HttpError(400, "Transaction has already been paid");
    }
    let totalFee = await calculateParkingFee(transaction);
    if (paymentData.paidAmount < totalFee) {
        throw new HttpError(400, "Pembayaran tidak mencukupi, total yang harus dibayar adalah " + totalFee);
    }
    return await transactionRepository.updatePaidAmount(accessCode, paymentData.paidAmount);
};
export const processTransactionPaymentForMember = async (accessCode) => {
    const transaction = await getTransactionByAccessCode(accessCode);
    if (transaction.status !== "ENTRY") {
        throw new HttpError(400, "Transaction is not in ENTRY status");
    }
    if (transaction.paid_amount !== null) {
        throw new HttpError(400, "Transaction has already been paid");
    }
    return await transactionRepository.updatePaidAmount(accessCode, 0);
};
export const updateTransactionToExit = async (accessCode) => {
    const transaction = await getTransactionByAccessCode(accessCode);
    if (transaction.status !== "ENTRY") {
        throw new HttpError(400, "Transaction is not in ENTRY status");
    }
    if (transaction.paid_amount === null) {
        throw new HttpError(400, "Transaction has not been paid yet");
    }
    return await transactionRepository.updateToExit(accessCode);
};
export const deleteTransaction = async (accessCode, adminUserId) => {
    await getTransactionByAccessCode(accessCode);
    const deletedTransaction = await transactionRepository.remove(accessCode);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted transaction (Access Code: ${accessCode}). Data: ${JSON.stringify(deletedTransaction)}`,
            type: "TRANSACTION_DELETE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for transaction deletion:", error);
    }
    return deletedTransaction;
};
export default { getAllTransactions, getTransactionById, getTransactionByAccessCode, getTransactionsByUserId, createTransaction, createEntryTransaction, processTransactionPaymentForNonMember, processTransactionPaymentForMember, updateTransaction, updateTransactionToExit, deleteTransaction };
//# sourceMappingURL=transaction.service.js.map