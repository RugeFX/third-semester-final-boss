import { Request, Response } from "express";
import transactionService from "./transaction.service";
import vehicleDetailService from "../vehicle_details/vehicle-detail.service";
import { paramsSchema, entryTransactionSchema } from "./transaction.schema";
import HttpError from "../common/exceptions/http.error";

// Get all transactions
export const getAllTransactions = async (req: Request, res: Response) => {
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
    const 
        status = "ENTRY" as const, 
        paidAmount = 0, 
        accessCode = Math.floor(Math.random() * (100000 - 999999 + 1)) + 999999;
    
    const { userId, parkingLevelId, categoryId, plateNumber } = entryTransactionSchema.parse(req.body);

    // Create vehicle detail first and get its ID
    const newVehicleDetail = await vehicleDetailService.createVehicleDetail(plateNumber, categoryId); 

    if (!newVehicleDetail) throw new HttpError(500, "Failed to create vehicle detail");

    const newTransaction = await transactionService.createTransaction(status, paidAmount, accessCode.toString(), userId, newVehicleDetail.id, parkingLevelId);

    res.status(200).json({
        success: true,
        message: "Transaction created successfully",
        data: newTransaction
    });
};

export const updateTransactionExit = async (req: Request, res: Response) => {
    const { accessCode } = paramsSchema.parse(req.params);

    const updatedTransaction = await transactionService.updateTransactionToExit(accessCode);

    res.status(200).json({
        success: true,
        message: "Transaction updated successfully",
        data: updatedTransaction
    });
}