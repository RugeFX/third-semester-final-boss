import { Request, Response } from "express";

// Get all prices
export const getAllPrices = async (req: Request, res: Response) => {
    const prices = [
        {
            id: 1,
            amount: 100,
            category_id: 1,
            category: {
                id: 1,
                name: "Car",
                weight: 200
            }
        },
        {
            id: 2,
            amount: 200,
            category_id: 1,
            category: {
                id: 1,
                name: "Car",
                weight: 200
            }
        },
        {
            id: 3,
            amount: 300,
            category_id: 2,
            category: {
                id: 2,
                name: "Motorcycle",
                weight: 100
            }
        }
    ];

    res.json({
        success: true,
        code: 200,
        message: "Prices fetched successfully",
        data: prices
    });
};

// Get price by ID
export const getPriceById = async (req: Request, res: Response) => {
    const price = {
        id: 1,
        amount: 100,
        category_id: 1,
        category: {
            id: 1,
            name: "Car",
            weight: 200
        }
    };

    res.json({
        success: true,
        code: 200,
        message: "Price fetched successfully",
        data: price
    });
};

// Create a new price
export const createPrice = async (req: Request, res: Response) => {
    const { amount, category_id } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Price created successfully",
        data: {
            amount,
            category_id
        }
    });
};

// Update a price
export const updatePrice = async (req: Request, res: Response) => {
    const { amount, category_id } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Price updated successfully",
        data: {
            amount,
            category_id
        }
    });
};

// Delete a price
export const deletePrice = async (req: Request, res: Response) => {
    res.json({
        success: true,
        code: 200,
        message: "Price deleted successfully"
    });
};