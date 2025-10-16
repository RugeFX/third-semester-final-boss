import { Request, Response } from "express";
import transactionService from "./transaction.service";
import { paramsSchema, entryTransactionSchema, processPaymentSchema, updateTransactionSchema } from "./transaction.schema";

// Get all transactions
export const getAllTransactions = async (_req: Request, res: Response) => {
    const transactions = await transactionService.getAllTransactions();

    res.status(200).json({
        success: true,
        message: "Transactions fetched successfully",
        data: transactions
    });
};

export const getTransactionByAccessCode = async (req: Request, res: Response) => {
    const { accessCode } = paramsSchema.parse(req.params);

    const transaction = await transactionService.getTransactionByAccessCode(accessCode);

    res.status(200).json({
        success: true,
        message: "Transaction fetched successfully",
        data: transaction
    });
}

export const createTransactionEntry = async (req: Request, res: Response) => {
    const entryData = entryTransactionSchema.parse(req.body);

    const newTransaction = await transactionService.createEntryTransaction(entryData);

    res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: newTransaction
    });
};

export const manuallyUpdateTransaction = async (req: Request, res: Response) => {
    const { accessCode } = paramsSchema.parse(req.params);
    const transactionData = updateTransactionSchema.parse(req.body);

    const updatedTransaction = await transactionService.updateTransaction(accessCode, transactionData);

    res.status(200).json({
        success: true,
        message: "Transaction updated successfully",
        data: updatedTransaction
    });
}

export const processTransactionPayment = async (req: Request, res: Response) => {
    const { accessCode } = paramsSchema.parse(req.params);
    const { paidAmount } = processPaymentSchema.parse(req.body);

    const processedTransaction = await transactionService.processTransactionPayment(accessCode, { paidAmount });

    res.status(200).json({
        success: true,
        message: "Transaction processed successfully",
        data: processedTransaction
    });
}

export const updateTransactionExit = async (req: Request, res: Response) => {
    const { accessCode } = paramsSchema.parse(req.params);

    const updatedTransaction = await transactionService.updateTransactionToExit(accessCode);

    res.status(200).json({
        success: true,
        message: "Transaction updated successfully",
        data: updatedTransaction
    });
}

export const deleteTransaction = async (req: Request, res: Response) => {
    const { accessCode } = paramsSchema.parse(req.params);

    const deletedTransaction = await transactionService.deleteTransaction(accessCode);

    res.status(200).json({
        success: true,
        message: "Transaction deleted successfully",
        data: deletedTransaction
    });
}