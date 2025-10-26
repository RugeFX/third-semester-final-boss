import transactionService from "./transaction.service";
import memberService from "../members/member.service";
import { paramsSchema, entryTransactionSchema, processPaymentSchema, updateTransactionSchema } from "./transaction.schema";
export const getAllTransactions = async (_req, res) => {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json({
        success: true,
        message: "Transactions fetched successfully",
        data: transactions
    });
};
export const getTransactionByAccessCode = async (req, res) => {
    const { accessCode } = paramsSchema.parse(req.params);
    const transaction = await transactionService.getTransactionByAccessCode(accessCode);
    res.status(200).json({
        success: true,
        message: "Transaction fetched successfully",
        data: transaction
    });
};
export const createTransactionEntry = async (req, res) => {
    const entryData = entryTransactionSchema.parse(req.body);
    const newTransaction = await transactionService.createEntryTransaction(entryData);
    res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: newTransaction
    });
};
export const manuallyUpdateTransaction = async (req, res) => {
    const { accessCode } = paramsSchema.parse(req.params);
    const transactionData = updateTransactionSchema.parse(req.body);
    const adminUserId = req.user.id;
    const updatedTransaction = await transactionService.updateTransaction(accessCode, transactionData, adminUserId);
    res.status(200).json({
        success: true,
        message: "Transaction updated successfully",
        data: updatedTransaction
    });
};
export const processTransactionPayment = async (req, res) => {
    const { accessCode } = paramsSchema.parse(req.params);
    const transaction = await transactionService.getTransactionByAccessCode(accessCode);
    let member = null;
    if (transaction.user_id) {
        member = await memberService.findMemberByUserId(transaction.user_id).catch(() => null);
    }
    let processedTransaction;
    if (member) {
        processedTransaction = await transactionService.processTransactionPaymentForMember(accessCode);
    }
    else {
        const { paidAmount } = processPaymentSchema.parse(req.body);
        processedTransaction = await transactionService.processTransactionPaymentForNonMember(accessCode, { paidAmount });
    }
    res.status(200).json({
        success: true,
        message: "Transaction processed successfully",
        data: processedTransaction
    });
};
export const updateTransactionExit = async (req, res) => {
    const { accessCode } = paramsSchema.parse(req.params);
    const updatedTransaction = await transactionService.updateTransactionToExit(accessCode);
    res.status(200).json({
        success: true,
        message: "Transaction updated successfully",
        data: updatedTransaction
    });
};
export const deleteTransaction = async (req, res) => {
    const { accessCode } = paramsSchema.parse(req.params);
    const adminUserId = req.user.id;
    const deletedTransaction = await transactionService.deleteTransaction(accessCode, adminUserId);
    res.status(200).json({
        success: true,
        message: "Transaction deleted successfully",
        data: deletedTransaction
    });
};
//# sourceMappingURL=transaction.controller.js.map