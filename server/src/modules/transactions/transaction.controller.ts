import { Request, Response } from "express";
import transactionService from "./transaction.service";
import vehicleDetailService from "../vehicle_details/vehicle-detail.service";
import categoryService from "../categories/category.service";
import parkingLevelService from "../parking_levels/parking-level.service";
import { paramsSchema, entryTransactionSchema, processPaymentSchema } from "./transaction.schema";
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

    // Check if category exists
    await categoryService.findCategoryById(categoryId);

    // Check if parking level exists
    await parkingLevelService.findParkingLevelById(parkingLevelId);

    // Create vehicle detail first and get its ID
    const newVehicleDetail = await vehicleDetailService.createVehicleDetail(plateNumber, categoryId); 

    if (!newVehicleDetail) throw new HttpError(500, "Failed to create vehicle detail");

    // Now create the transaction with the vehicle detail ID
    const newTransaction = await transactionService.createTransaction(status, paidAmount, accessCode.toString(), userId, newVehicleDetail.id, parkingLevelId);

    res.status(200).json({
        success: true,
        message: "Transaction created successfully",
        data: newTransaction
    });
};

export const processTransactionPayment = async (req: Request, res: Response) => {
    const { accessCode } = paramsSchema.parse(req.params);
    const { paidAmount } = processPaymentSchema.parse(req.body);

    const processedTransaction = await transactionService.processTransactionPayment(accessCode, paidAmount);

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