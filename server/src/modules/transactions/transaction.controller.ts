import { Request, Response } from "express";

// Get all transactions
export const getAllTransactions = async (req: Request, res: Response) => {
    const transactions = [
        {
            id: 1001,
            status: "EXIT",
            paid_amount: 20000,
            access_code: "PAC30223",
            user_id: 1,
            user: {
                id: 1,
                name: "John Doe",
                role: "member"
            },
            vehicle_detail_id: 501,
            vehicle_detail: {
                id: 501,
                plate_number: "B1234XYZ",
                category_id: 2,
                category: {
                    id: 2,
                    name: "Motorcycle",
                    weight: 100
                }
            },
            parking_level_id: 1,
            parking_level: {
                id: 1,
                name: "L1",
                max_weight: 2500
            },
            created_at: "2025-09-23T13:22:08.322Z",
            updated_at: "2025-09-23T13:22:08.322Z"
        },
        {
            id: 1002,
            status: "ENTRY",
            paid_amount: null,
            access_code: "PAC30243",
            user_id: 2,
            user: {
                id: 2,
                name: "Jane Doe",
                role: "member"
            },
            vehicle_detail_id: 501,
            vehicle_detail: {
                id: 501,
                plate_number: "A2423XYZ",
                category_id: 2,
                category: {
                    id: 2,
                    name: "Car",
                    weight: 200
                }
            },
            parking_level_id: 1,
            parking_level: {
                id: 1,
                name: "L1",
                max_weight: 2500
            },
            created_at: "2025-09-23T13:22:08.322Z",
            updated_at: "2025-09-23T13:22:08.322Z"
        }
    ];

    res.json({
        success: true,
        code: 200,
        message: "Transactions fetched successfully",
        data: transactions
    });
};

// Get transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
    const transaction = {
        id: 1001,
        status: "EXIT",
        paid_amount: 20000,
        access_code: "PAC30223",
        user_id: 1,
        user: {
            id: 1,
            name: "John Doe",
            role: "member"
        },
        vehicle_detail_id: 501,
        vehicle_detail: {
            id: 501,
            plate_number: "B1234XYZ",
            category_id: 2,
            category: {
                id: 2,
                name: "Motorcycle",
                weight: 100
            }
        },
        parking_level_id: 1,
        parking_level: {
            id: 1,
            name: "L1",
            max_weight: 2500
        },
        created_at: "2025-09-23T13:22:08.322Z",
        updated_at: "2025-09-23T13:22:08.322Z"
    };

    res.json({
        success: true,
        code: 200,
        message: "Transaction fetched successfully",
        data: transaction
    });
};

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
    const { status, paid_amount, access_code, user_id, vehicle_detail_id, parking_level_id } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Transaction created successfully",
        data: {
            status,
            paid_amount,
            access_code,
            user_id,
            vehicle_detail_id,
            parking_level_id
        }
    });
};

// Update a transaction
export const updateTransaction = async (req: Request, res: Response) => {
    const { status, paid_amount, access_code, user_id, vehicle_detail_id, parking_level_id } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Transaction updated successfully",
        data: {
            status,
            paid_amount,
            access_code,
            user_id,
            vehicle_detail_id,
            parking_level_id
        }
    });
}

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
    res.json({
        success: true,
        code: 200,
        message: "Transaction deleted successfully"
    });
};